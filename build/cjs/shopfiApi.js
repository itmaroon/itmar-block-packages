'use strict';

var _rollupPluginBabelHelpers = require('./_virtual/_rollupPluginBabelHelpers.js');

var _excluded = ["_wpnonce", "nonce"];
function generateNonce() {
  var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 32;
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var nonce = "";
  for (var i = 0; i < length; i++) {
    nonce += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return nonce;
}
function generateCodeVerifier() {
  var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 128;
  var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  var result = "";
  for (var i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}
function generateCodeChallenge(_x) {
  return _generateCodeChallenge.apply(this, arguments);
} // ✅ Shopifyへの認証リダイレクト
function _generateCodeChallenge() {
  _generateCodeChallenge = _rollupPluginBabelHelpers.asyncToGenerator(function* (codeVerifier) {
    var encoder = new TextEncoder();
    var data = encoder.encode(codeVerifier);
    var digest = yield crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode(...new Uint8Array(digest))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  });
  return _generateCodeChallenge.apply(this, arguments);
}
function redirectCustomerAuthorize(_x2, _x3, _x4, _x5, _x6) {
  return _redirectCustomerAuthorize.apply(this, arguments);
}

// ✅ トークンがあれば検証（Storefront API 経由で customer を取得）
function _redirectCustomerAuthorize() {
  _redirectCustomerAuthorize = _rollupPluginBabelHelpers.asyncToGenerator(function* (shopId, clientId, userMail, callbackUri, redirectUri) {
    //呼び出し元の戻り先
    var statePayload = {
      ts: Date.now(),
      random: Math.random().toString(36).substring(2),
      return_url: redirectUri
    };
    //stateで渡しておく
    var state = btoa(JSON.stringify(statePayload));
    var nonce = generateNonce();
    var codeVerifier = generateCodeVerifier();
    var codeChallenge = yield generateCodeChallenge(codeVerifier);
    localStorage.setItem("shopify_code_verifier", codeVerifier);
    localStorage.setItem("shopify_state", state);
    localStorage.setItem("shopify_nonce", nonce);
    localStorage.setItem("shopify_client_id", clientId);
    localStorage.setItem("shopify_user_mail", userMail);
    localStorage.setItem("shopify_shop_id", shopId);
    localStorage.setItem("shopify_redirect_uri", callbackUri); //ログアウトの処理で使用する

    var url = new URL("https://shopify.com/authentication/".concat(shopId, "/oauth/authorize"));
    url.searchParams.append("scope", "openid email customer-account-api:full");
    url.searchParams.append("client_id", clientId);
    url.searchParams.append("response_type", "code");
    url.searchParams.append("redirect_uri", callbackUri);
    url.searchParams.append("state", state);
    url.searchParams.append("nonce", nonce);
    url.searchParams.append("code_challenge", codeChallenge);
    url.searchParams.append("code_challenge_method", "S256");
    window.location.href = url.toString();
  });
  return _redirectCustomerAuthorize.apply(this, arguments);
}
function checkCustomerLoginState() {
  return _checkCustomerLoginState.apply(this, arguments);
}

/**
 * @param {string} urlOrPath - RESTは '/itmar-shopify/v1/...' でも '/wp-json/...' でもOK。admin-ajaxは '/wp-admin/admin-ajax.php'
 * @param {object} data - 送信するデータ。nonce は data._wpnonce か data.nonce に入れておけばOK
 * @param {'auto'|'rest'|'ajax'} mode - 既定は 'auto'
 */
function _checkCustomerLoginState() {
  _checkCustomerLoginState = _rollupPluginBabelHelpers.asyncToGenerator(function* () {
    var token = localStorage.getItem("shopify_customer_token");
    if (!token) return false;
    var checkUrl = "/wp-json/itmar-ec-relate/v1/shopify-login-check";
    var postData = {
      nonce: itmar_option.nonce,
      token: JSON.stringify({
        token
      })
    };
    sendRegistrationAjax(checkUrl, postData, true).done(function (res) {
      console.log(res);
    }).fail(function (xhr, status, error) {
      alert("サーバーエラー: " + error);
      console.error(xhr.responseText);
    });
  });
  return _checkCustomerLoginState.apply(this, arguments);
}
function sendRegistrationRequest(_x7) {
  return _sendRegistrationRequest.apply(this, arguments);
}
function _sendRegistrationRequest() {
  _sendRegistrationRequest = _rollupPluginBabelHelpers.asyncToGenerator(function* (urlOrPath) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "auto";
    var isRestUrlLike = u => u.startsWith("/wp-json") || !u.startsWith("/wp-admin");

    // 送信先の確定（RESTのときは /wp-json 省略パスでもOKにする）
    var isRest;
    if (mode === "auto") {
      isRest = isRestUrlLike(urlOrPath);
    } else {
      isRest = mode === "rest";
    }
    var url = urlOrPath;
    if (isRest) {
      // '/itmar-shopify/v1/...' のようなパスだけ渡されたら /wp-json を補う
      if (!url.startsWith("/wp-json")) {
        var root = window.wpApiSettings && window.wpApiSettings.root || "/wp-json/";
        url = root.replace(/\/+$/, "/") + url.replace(/^\/+/, "");
      }
    } else {
      // admin-ajax の既定URL
      if (!url) url = "/wp-admin/admin-ajax.php";
    }
    var fetchOptions = {
      method: "POST",
      credentials: "same-origin",
      // 同一オリジン Cookie
      headers: {}
    };

    // ノンス抽出（_wpnonce を優先）
    var nonce = data._wpnonce || data.nonce || window.wpApiSettings && window.wpApiSettings.nonce;
    if (isRest) {
      fetchOptions.headers["Content-Type"] = "application/json";
      if (nonce) fetchOptions.headers["X-WP-Nonce"] = nonce;

      // nonce系は本文から除く（任意）
      var {
          _wpnonce,
          nonce: _legacyNonce
        } = data,
        rest = _rollupPluginBabelHelpers.objectWithoutProperties(data, _excluded);
      fetchOptions.body = JSON.stringify(rest);
    } else {
      // admin-ajax は URLSearchParams で送る
      var form = new URLSearchParams();
      Object.entries(data).forEach(_ref => {
        var [k, v] = _ref;
        if (v !== undefined && v !== null) form.append(k, String(v));
      });
      // ノンスは _wpnonce に統一
      if (nonce && !form.has("_wpnonce")) form.append("_wpnonce", nonce);
      fetchOptions.body = form;
    }
    var res = yield fetch(url, fetchOptions);

    // WP REST はメソッド不一致・ルートなし等でも JSON 返さないことがあるので分岐
    var contentType = res.headers.get("content-type") || "";
    var tryJson = contentType.includes("application/json");
    if (!res.ok) {
      var msg = "HTTP ".concat(res.status);
      if (tryJson) {
        try {
          var j = yield res.json();
          msg += j.message ? ": ".concat(j.message) : "";
        } catch (_unused) {}
      } else {
        var t = yield res.text();
        if (t) msg += ": ".concat(t.slice(0, 200));
      }
      throw new Error(msg);
    }
    return tryJson ? res.json() : res.text();
  });
  return _sendRegistrationRequest.apply(this, arguments);
}

exports.checkCustomerLoginState = checkCustomerLoginState;
exports.redirectCustomerAuthorize = redirectCustomerAuthorize;
exports.sendRegistrationRequest = sendRegistrationRequest;
//# sourceMappingURL=shopfiApi.js.map
