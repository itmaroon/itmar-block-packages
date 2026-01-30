'use strict';

var _rollupPluginBabelHelpers = require('./_virtual/_rollupPluginBabelHelpers.js');
var i18n = require('@wordpress/i18n');

//郵便番号検索のデータと関数
var fetchZipToAddress = /*#__PURE__*/function () {
  var _ref = _rollupPluginBabelHelpers.asyncToGenerator(function* (zipNum) {
    if (!/^\d{7}$/.test(zipNum)) {
      alert(i18n.__("Please enter your postal code as 7 digits without hyphens.", "block-collections"));
      return null;
    }
    try {
      var response = yield fetch("https://zipcloud.ibsnet.co.jp/api/search?zipcode=".concat(zipNum.replace("-", "")));
      var data = yield response.json();
      if (data.results && data.results.length > 0) {
        var result = data.results[0];
        return result;
      } else {
        alert(i18n.__("No matching address found", "block-collections"));
        return null;
      }
    } catch (error) {
      alert(i18n.__("Communication failed", "block-collections"));
      return null;
    }
  });
  return function fetchZipToAddress(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.fetchZipToAddress = fetchZipToAddress;
//# sourceMappingURL=ZipAddress.js.map
