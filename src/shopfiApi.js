function generateState() {
  const timestamp = Date.now().toString();
  const randomString = Math.random().toString(36).substring(2);
  return timestamp + randomString;
}

function generateNonce(length = 32) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let nonce = "";
  for (let i = 0; i < length; i++) {
    nonce += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return nonce;
}

function generateCodeVerifier(length = 128) {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// ✅ Shopifyへの認証リダイレクト
export async function redirectCustomerAuthorize(
  shopId,
  clientId,
  userMail,
  callbackUri,
  redirectUri
) {
  //呼び出し元の戻り先
  const statePayload = {
    ts: Date.now(),
    random: Math.random().toString(36).substring(2),
    return_url: redirectUri,
  };
  //stateで渡しておく
  const state = btoa(JSON.stringify(statePayload));
  const nonce = generateNonce();
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  localStorage.setItem("shopify_code_verifier", codeVerifier);
  localStorage.setItem("shopify_state", state);
  localStorage.setItem("shopify_nonce", nonce);
  localStorage.setItem("shopify_client_id", clientId);
  localStorage.setItem("shopify_user_mail", userMail);
  localStorage.setItem("shopify_shop_id", shopId);
  localStorage.setItem("shopify_redirect_uri", callbackUri); //ログアウトの処理で使用する

  const url = new URL(
    `https://shopify.com/authentication/${shopId}/oauth/authorize`
  );
  url.searchParams.append("scope", "openid email customer-account-api:full");
  url.searchParams.append("client_id", clientId);
  url.searchParams.append("response_type", "code");
  url.searchParams.append("redirect_uri", callbackUri);
  url.searchParams.append("state", state);
  url.searchParams.append("nonce", nonce);
  url.searchParams.append("code_challenge", codeChallenge);
  url.searchParams.append("code_challenge_method", "S256");

  window.location.href = url.toString();
}

// ✅ トークンがあれば検証（Storefront API 経由で customer を取得）
export async function checkCustomerLoginState() {
  const token = localStorage.getItem("shopify_customer_token");

  if (!token) return false;

  const checkUrl = "/wp-json/itmar-ec-relate/v1/shopify-login-check";
  const postData = {
    nonce: itmar_option.nonce,
    token: JSON.stringify({ token }),
  };
  sendRegistrationAjax(checkUrl, postData, true)
    .done(function (res) {
      console.log(res);
    })
    .fail(function (xhr, status, error) {
      alert("サーバーエラー: " + error);
      console.error(xhr.responseText);
    });
}

/**
 * @param {string} urlOrPath - RESTは '/itmar-shopify/v1/...' でも '/wp-json/...' でもOK。admin-ajaxは '/wp-admin/admin-ajax.php'
 * @param {object} data - 送信するデータ。nonce は data._wpnonce か data.nonce に入れておけばOK
 * @param {'auto'|'rest'|'ajax'} mode - 既定は 'auto'
 */
export async function sendRegistrationRequest(
  urlOrPath,
  data = {},
  mode = "auto"
) {
  const isRestUrlLike = (u) =>
    u.startsWith("/wp-json") || !u.startsWith("/wp-admin");

  // 送信先の確定（RESTのときは /wp-json 省略パスでもOKにする）
  let isRest;
  if (mode === "auto") {
    isRest = isRestUrlLike(urlOrPath);
  } else {
    isRest = mode === "rest";
  }

  let url = urlOrPath;

  if (isRest) {
    // '/itmar-shopify/v1/...' のようなパスだけ渡されたら /wp-json を補う
    if (!url.startsWith("/wp-json")) {
      const root =
        (window.wpApiSettings && window.wpApiSettings.root) || "/wp-json/";
      url = root.replace(/\/+$/, "/") + url.replace(/^\/+/, "");
    }
  } else {
    // admin-ajax の既定URL
    if (!url) url = "/wp-admin/admin-ajax.php";
  }

  const fetchOptions = {
    method: "POST",
    credentials: "same-origin", // 同一オリジン Cookie
    headers: {},
  };

  // ノンス抽出（_wpnonce を優先）
  const nonce =
    data._wpnonce ||
    data.nonce ||
    (window.wpApiSettings && window.wpApiSettings.nonce);

  if (isRest) {
    fetchOptions.headers["Content-Type"] = "application/json";
    if (nonce) fetchOptions.headers["X-WP-Nonce"] = nonce;

    // nonce系は本文から除く（任意）
    const { _wpnonce, nonce: _legacyNonce, ...rest } = data;
    fetchOptions.body = JSON.stringify(rest);
  } else {
    // admin-ajax は URLSearchParams で送る
    const form = new URLSearchParams();
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined && v !== null) form.append(k, String(v));
    });
    // ノンスは _wpnonce に統一
    if (nonce && !form.has("_wpnonce")) form.append("_wpnonce", nonce);
    fetchOptions.body = form;
  }

  const res = await fetch(url, fetchOptions);

  // WP REST はメソッド不一致・ルートなし等でも JSON 返さないことがあるので分岐
  const contentType = res.headers.get("content-type") || "";
  const tryJson = contentType.includes("application/json");

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    if (tryJson) {
      try {
        const j = await res.json();
        msg += j.message ? `: ${j.message}` : "";
      } catch {}
    } else {
      const t = await res.text();
      if (t) msg += `: ${t.slice(0, 200)}`;
    }
    throw new Error(msg);
  }

  return tryJson ? res.json() : res.text();
}
