//URLのバリデーションチェック
export const isValidUrlWithUrlApi = (string) => {
  try {
    const cleanString = string.replace(/<[^>]+>/g, "");
    new URL(cleanString);
    return true;
  } catch (err) {
    return false;
  }
};
