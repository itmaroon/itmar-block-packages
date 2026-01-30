//URLのバリデーションチェック
var isValidUrlWithUrlApi = string => {
  try {
    var cleanString = string.replace(/<[^>]+>/g, "");
    new URL(cleanString);
    return true;
  } catch (err) {
    return false;
  }
};

export { isValidUrlWithUrlApi };
//# sourceMappingURL=validationCheck.js.map
