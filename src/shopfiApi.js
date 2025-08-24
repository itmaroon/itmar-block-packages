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

export async function sendRegistrationRequest(url, postData, isRest = false) {
  try {
    const fetchOptions = {
      method: "POST",
      credentials: "include", //cookieの送信可
      headers: {},
    };

    if (isRest) {
      fetchOptions.headers["Content-Type"] = "application/json";
      fetchOptions.headers["X-WP-Nonce"] = postData.nonce;
      fetchOptions.body = JSON.stringify(postData);
    } else {
      const formData = new URLSearchParams();
      for (const key in postData) {
        formData.append(key, postData[key]);
      }
      fetchOptions.body = formData;
    }

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Request failed:", error);
    throw error; // 呼び出し元で catch できるように
  }
}
