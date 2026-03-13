export declare function redirectCustomerAuthorize(shopId: string, clientId: string, userMail: string, callbackUri: string, // Shopify側の管理画面で登録したリダイレクト先
redirectUri: string): Promise<void>;
/**
 * Shopifyの顧客トークンを検証し、ログイン状態を確認する
 */
export declare function checkCustomerLoginState(): Promise<boolean | void>;
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
export declare function sendRegistrationRequest<T = any>(urlOrPath: string, data?: Record<string, any>, mode?: ApiMode): Promise<T>;
export {};
