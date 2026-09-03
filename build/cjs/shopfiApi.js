'use strict';

var i18n = require('@wordpress/i18n');

// ✅ Shopifyへの認証リダイレクト
async function redirectCustomerAuthorize(shopId, clientId, userMail, callbackUri, // Shopify側の管理画面で登録したリダイレクト先
redirectUri) {
    const response = await sendRegistrationRequest("/itmar-ec-relate/v1/customer/oauth-start", {
        shop_id: shopId,
        client_id: clientId,
        user_mail: userMail,
        callback_uri: callbackUri,
        return_url: redirectUri,
        nonce: itmar_option.nonce,
    }, "rest");
    if (!response?.success || !response?.authorization_url) {
        throw new Error("Shopify authentication could not be started.");
    }
    window.location.href = response.authorization_url;
}
/**
 * Shopifyの顧客トークンを検証し、ログイン状態を確認する
 */
async function checkCustomerLoginState() {
    const checkUrl = window.itmar_option?.ajaxUrl || window.ajaxurl;
    if (!checkUrl)
        return false;
    const postData = {
        action: "itmar_validate_customer",
        _wpnonce: itmar_option.nonce,
    };
    // sendRegistrationAjax が内部で jQuery.ajax を返している（Promise互換）と想定
    try {
        const response = await sendRegistrationRequest(checkUrl, postData, "admin");
        // 成功時の処理
        console.log("Login check success:", response);
        // ここでサーバーからのレスポンス内容（成功/失敗）に応じて return するのが理想です
        return response.success === true && response.data?.authenticated === true;
    }
    catch (error) {
        // 失敗時の処理
        const errorMessage = error.statusText || error || "Unknown Error";
        alert(i18n.__("Server Error: ", "itmar-ec-relate") + errorMessage);
        console.error("Login check failed:", error);
        return false;
    }
}
/**
 * 統合された WordPress 通信関数
 */
async function sendRegistrationRequest(urlOrPath, data = {}, mode = "auto") {
    // 1. REST かどうかを判定
    const isRestUrlLike = (u) => u.startsWith("/wp-json") ||
        (!u.startsWith("/wp-admin") && !u.includes("admin-ajax.php"));
    let isRest;
    if (mode === "auto") {
        isRest = isRestUrlLike(urlOrPath);
    }
    else {
        isRest = mode === "rest";
    }
    // 2. RESTルートをWordPressの設置先に合わせて補完する。
    // `/wp-json/...` を渡す旧実装も、サブディレクトリ環境で正しく動くようにする。
    let url = urlOrPath;
    if (isRest && !/^https?:\/\//i.test(url)) {
        const homeUrl = String(window.itmar_option?.home_url || "").replace(/\/+$/, "");
        const root = window.wpApiSettings?.root ||
            (homeUrl ? `${homeUrl}/wp-json/` : "/wp-json/");
        const route = url.replace(/^\/?wp-json\/?/i, "").replace(/^\/+/, "");
        url = root.replace(/\/+$/, "/") + route;
    }
    // 3. ノンス (Security Token) の抽出
    const nonce = data._wpnonce || data.nonce || window.wpApiSettings?.nonce;
    // 4. 通信オプションの構築
    const fetchOptions = {
        method: "POST",
        credentials: "same-origin", // 同一オリジン Cookie
        headers: {},
    };
    if (isRest) {
        // --- REST API モード: JSON で送る ---
        fetchOptions.headers["Content-Type"] =
            "application/json";
        if (nonce)
            fetchOptions.headers["X-WP-Nonce"] = nonce;
        // Body から nonce 関連を分離して純粋なデータのみにする
        const { _wpnonce, nonce: _legacyNonce, ...cleanData } = data;
        fetchOptions.body = JSON.stringify(cleanData);
    }
    else {
        // admin-ajax は URLSearchParams で送る
        const form = new URLSearchParams();
        Object.entries(data).forEach(([k, v]) => {
            if (v !== undefined && v !== null)
                form.append(k, String(v));
        });
        // ノンスは _wpnonce に統一
        if (nonce && !form.has("_wpnonce"))
            form.append("_wpnonce", nonce);
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
                const detail = j.message || j.error;
                msg += detail ? `: ${detail}` : "";
            }
            catch { }
        }
        else {
            const t = await res.text();
            if (t)
                msg += `: ${t.slice(0, 200)}`;
        }
        throw new Error(msg);
    }
    return tryJson ? res.json() : res.text();
}

exports.checkCustomerLoginState = checkCustomerLoginState;
exports.redirectCustomerAuthorize = redirectCustomerAuthorize;
exports.sendRegistrationRequest = sendRegistrationRequest;
//# sourceMappingURL=shopfiApi.js.map
