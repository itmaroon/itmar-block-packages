/**
 * zipcloud API のレスポンス型定義
 */
interface ZipCloudResult {
    address1: string;
    address2: string;
    address3: string;
    kana1: string;
    kana2: string;
    kana3: string;
    prefcode: string;
    zipcode: string;
}
/**
 * 郵便番号から住所を取得する
 */
export declare const fetchZipToAddress: (zipNum: string) => Promise<ZipCloudResult | null>;
export {};
