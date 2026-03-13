/**
 * 文字列が有効な絶対URL形式（http/https等）であるか検証する
 * @param urlString 検証対象の文字列
 */
const isValidUrlWithUrlApi = (urlString) => {
    if (!urlString)
        return false;
    try {
        const cleanString = urlString.replace(/<[^>]+>/g, "");
        new URL(cleanString);
        return true;
    }
    catch (err) {
        return false;
    }
};

export { isValidUrlWithUrlApi };
//# sourceMappingURL=validationCheck.js.map
