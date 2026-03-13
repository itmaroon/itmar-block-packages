'use strict';

var i18n = require('@wordpress/i18n');

/**
 * 郵便番号から住所を取得する
 */
const fetchZipToAddress = async (zipNum) => {
    const cleanZip = zipNum.replace("-", "");
    if (!/^\d{7}$/.test(cleanZip)) {
        alert(i18n.__("Please enter your postal code as 7 digits without hyphens.", "block-collections"));
        return null;
    }
    try {
        const response = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${cleanZip}`);
        // API自体は200 OKを返すが、中身でエラーを出す場合があるため型を当てる
        const data = await response.json();
        if (data.status !== 200) {
            alert(data.message || i18n.__("Error fetching address", "block-collections"));
            return null;
        }
        if (data.results && data.results.length > 0) {
            return data.results[0];
        }
        else {
            alert(i18n.__("No matching address found", "block-collections"));
            return null;
        }
    }
    catch (error) {
        console.error("ZipCloud API Error:", error);
        alert(i18n.__("Communication failed", "block-collections"));
        return null;
    }
};

exports.fetchZipToAddress = fetchZipToAddress;
//# sourceMappingURL=ZipAddress.js.map
