import { __ } from "@wordpress/i18n";

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

async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest("SHA-256", data);

  // Uint8Array への変換と Base64 エンコード
  const hashArray = new Uint8Array(digest);

  // バイナリデータを文字列に変換
  // ※スプレッド構文 (...) は大規模なデータでスタックオーバーフローの可能性があるため
  // 小規模な PKCE 用途では問題ありませんが、型定義を明確にします。
  const binaryString = String.fromCharCode(...Array.from(hashArray));

  // Base64 を Base64URL 形式（Shopify / OAuth 2.0 仕様）に変換
  return btoa(binaryString)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// ✅ Shopifyへの認証リダイレクト
export async function redirectCustomerAuthorize(
  shopId: string,
  clientId: string,
  userMail: string,
  callbackUri: string, // Shopify側の管理画面で登録したリダイレクト先
  redirectUri: string, // ログイン完了後に最終的に戻したい自社サイトのURL
): Promise<void> {
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
    `https://shopify.com/authentication/${shopId}/oauth/authorize`,
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

// 1. グローバル変数の型定義
declare const itmar_option: {
  nonce: string;
  [key: string]: any;
};

/**
 * Shopifyの顧客トークンを検証し、ログイン状態を確認する
 */
export async function checkCustomerLoginState(): Promise<boolean | void> {
  const token = localStorage.getItem("shopify_customer_token");

  if (!token) return false;

  const checkUrl = "/wp-json/itmar-ec-relate/v1/shopify-login-check";
  const postData = {
    nonce: itmar_option.nonce,
    token: JSON.stringify({ token }),
  };

  // sendRegistrationAjax が内部で jQuery.ajax を返している（Promise互換）と想定
  try {
    const response = await sendRegistrationRequest(checkUrl, postData, "rest");

    // 成功時の処理
    console.log("Login check success:", response);

    // ここでサーバーからのレスポンス内容（成功/失敗）に応じて return するのが理想です
    return response.success === true;
  } catch (error: any) {
    // 失敗時の処理
    const errorMessage = error.statusText || error || "Unknown Error";
    alert(__("Server Error: ", "itmar-ec-relate") + errorMessage);
    console.error("Login check failed:", error);

    return false;
  }
}

/**
 * 通信モードの定義
 * auto: URLから自動判別
 * rest: WP REST API形式 (application/json)
 * admin: admin-ajax.php形式 (x-www-form-urlencoded)
 */
type ApiMode = "auto" | "rest" | "admin";

/**
 * 統合された WordPress 通信関数
 */
export async function sendRegistrationRequest<T = any>(
  urlOrPath: string,
  data: Record<string, any> = {},
  mode: ApiMode = "auto",
): Promise<T> {
  // 1. REST かどうかを判定
  const isRestUrlLike = (u: string) =>
    u.startsWith("/wp-json") ||
    (!u.startsWith("/wp-admin") && !u.includes("admin-ajax.php"));

  let isRest: boolean;
  if (mode === "auto") {
    isRest = isRestUrlLike(urlOrPath);
  } else {
    isRest = mode === "rest";
  }

  // 2. パスの補完 (/wp-json/ を省略した場合の対応)
  let url = urlOrPath;
  if (isRest && !url.startsWith("http") && !url.startsWith("/wp-json")) {
    const root = (window as any).wpApiSettings?.root || "/wp-json/";
    url = root.replace(/\/+$/, "/") + url.replace(/^\/+/, "");
  }

  // 3. ノンス (Security Token) の抽出
  const nonce =
    data._wpnonce || data.nonce || (window as any).wpApiSettings?.nonce;

  // 4. 通信オプションの構築
  const fetchOptions: RequestInit = {
    method: "POST",
    credentials: "same-origin", // 同一オリジン Cookie
    headers: {},
  };

  if (isRest) {
    // --- REST API モード: JSON で送る ---
    (fetchOptions.headers as Record<string, string>)["Content-Type"] =
      "application/json";
    if (nonce)
      (fetchOptions.headers as Record<string, string>)["X-WP-Nonce"] = nonce;

    // Body から nonce 関連を分離して純粋なデータのみにする
    const { _wpnonce, nonce: _legacyNonce, ...cleanData } = data;
    fetchOptions.body = JSON.stringify(cleanData);
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
  // 5. 実行
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

  return tryJson ? res.json() : (res.text() as any);
}
