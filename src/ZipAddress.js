import { __ } from "@wordpress/i18n";

//郵便番号検索のデータと関数
export const fetchZipToAddress = async (zipNum) => {
  if (!/^\d{7}$/.test(zipNum)) {
    alert(
      __(
        "Please enter your postal code as 7 digits without hyphens.",
        "block-collections"
      )
    );
    return null;
  }

  try {
    const response = await fetch(
      `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipNum.replace(
        "-",
        ""
      )}`
    );
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      return result;
    } else {
      alert(__("No matching address found", "block-collections"));
      return null;
    }
  } catch (error) {
    alert(__("Communication failed", "block-collections"));
    return null;
  }
};
