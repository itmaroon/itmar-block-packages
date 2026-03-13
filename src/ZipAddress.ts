import { __ } from "@wordpress/i18n";

/**
 * zipcloud API のレスポンス型定義
 */
interface ZipCloudResult {
  address1: string; // 都道府県名
  address2: string; // 市区町村名
  address3: string; // 町域名
  kana1: string;
  kana2: string;
  kana3: string;
  prefcode: string;
  zipcode: string;
}

/**
 * 郵便番号から住所を取得する
 */
export const fetchZipToAddress = async (
  zipNum: string,
): Promise<ZipCloudResult | null> => {
  const cleanZip = zipNum.replace("-", "");

  if (!/^\d{7}$/.test(cleanZip)) {
    alert(
      __(
        "Please enter your postal code as 7 digits without hyphens.",
        "block-collections",
      ),
    );
    return null;
  }

  try {
    const response = await fetch(
      `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${cleanZip}`,
    );

    // API自体は200 OKを返すが、中身でエラーを出す場合があるため型を当てる
    const data: {
      results: ZipCloudResult[] | null;
      status: number;
      message: string | null;
    } = await response.json();

    if (data.status !== 200) {
      alert(data.message || __("Error fetching address", "block-collections"));
      return null;
    }

    if (data.results && data.results.length > 0) {
      return data.results[0];
    } else {
      alert(__("No matching address found", "block-collections"));
      return null;
    }
  } catch (error) {
    console.error("ZipCloud API Error:", error);
    alert(__("Communication failed", "block-collections"));
    return null;
  }
};
