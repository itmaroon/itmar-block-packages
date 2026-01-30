'use strict';

var _rollupPluginBabelHelpers = require('./_virtual/_rollupPluginBabelHelpers.js');
var i18n = require('@wordpress/i18n');
var components = require('@wordpress/components');
var date = require('@wordpress/date');

//日付のフォーマット
var dateFormats = [{
  label: "YYYY-MM-DD HH:mm:ss",
  value: "Y-m-d H:i:s"
}, {
  label: "MM/DD/YYYY",
  value: "m/d/Y"
}, {
  label: "DD/MM/YYYY",
  value: "d/m/Y"
}, {
  label: "MMMM D, YYYY",
  value: "F j, Y"
}, {
  label: "HH:mm:ss",
  value: "H:i:s"
}, {
  label: "YYYY.M.D",
  value: "Y.n.j"
}, {
  label: "Day, MMMM D, YYYY",
  value: "l, F j, Y"
}, {
  label: "ddd, MMM D, YYYY",
  value: "D, M j, Y"
}, {
  label: "YYYY年M月D日 (曜日)",
  value: "Y年n月j日 (l)"
}];
//プレーンのフォーマット
var plaineFormats = [{
  key: "str_free",
  label: i18n.__("Free String", "block-collections"),
  value: "%s"
}, {
  key: "num_comma",
  label: i18n.__("Numbers (comma separated)", "block-collections"),
  value: {
    style: "decimal",
    useGrouping: true // カンマ区切り
  }
}, {
  key: "num_no_comma",
  label: i18n.__("Numbers (no commas)", "block-collections"),
  value: {
    style: "decimal",
    useGrouping: false
  }
}, {
  key: "num_amount",
  label: i18n.__("Amount", "block-collections"),
  value: {
    style: "currency",
    currency: "JPY"
  }
}];
var FormatSelectControl = _ref => {
  var {
    titleType,
    userFormat,
    freeStrFormat,
    decimal,
    onFormatChange
  } = _ref;
  var isPlaine = titleType === "plaine";
  var isDate = titleType === "date";
  var isUser = titleType === "user";

  //SelectControlのオプションを生成
  var options = isDate ? dateFormats : plaineFormats.map(f => ({
    label: f.label,
    value: f.key
  }));
  return /*#__PURE__*/React.createElement(components.PanelBody, {
    title: i18n.__("Display Format Setting", "block-collections")
  }, (isPlaine || isDate) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(components.SelectControl, {
    label: i18n.__("Select Format", "block-collections"),
    value: userFormat,
    options: options,
    onChange: newFormat => onFormatChange({
      userFormat: newFormat,
      freeStrFormat,
      decimal
    })
  }), (userFormat === null || userFormat === void 0 ? void 0 : userFormat.startsWith("str_")) && /*#__PURE__*/React.createElement(components.TextControl, {
    label: i18n.__("String Format", "block-collections"),
    value: freeStrFormat,
    onChange: newFormat => onFormatChange({
      userFormat,
      freeStrFormat: newFormat,
      decimal
    })
  }), (userFormat === null || userFormat === void 0 ? void 0 : userFormat.startsWith("num_")) && /*#__PURE__*/React.createElement(components.PanelRow, {
    className: "itmar_post_blocks_pannel"
  }, /*#__PURE__*/React.createElement(components.RangeControl, {
    value: decimal,
    label: i18n.__("Decimal Num", "query-blocks"),
    max: 5,
    min: 0,
    onChange: val => onFormatChange({
      userFormat,
      freeStrFormat,
      decimal: val
    })
  }))), isUser && /*#__PURE__*/React.createElement(components.TextControl, {
    label: i18n.__("User Format", "block-collections"),
    value: freeStrFormat,
    onChange: newFormat => onFormatChange({
      userFormat: "str_free",
      freeStrFormat: newFormat,
      decimal
    })
  }));
};
var displayFormated = (content, userFormat, freeStrFormat, decimal) => {
  var _getSettings$l10n, _plaineFormats$find;
  // 内部で使用するロケール
  var locale = ((_getSettings$l10n = date.getSettings().l10n) === null || _getSettings$l10n === void 0 ? void 0 : _getSettings$l10n.locale) || "en";

  //日付にフォーマットがあれば、それで書式設定してリターン
  var isDateFormat = dateFormats.find(f => f.value === userFormat);
  if (isDateFormat) {
    var ret_val = date.format(userFormat, content, date.getSettings());
    return ret_val;
  }
  //数値や文字列のフォーマット
  var selectedFormat = (_plaineFormats$find = plaineFormats.find(f => f.key === userFormat)) === null || _plaineFormats$find === void 0 ? void 0 : _plaineFormats$find.value;
  if (typeof selectedFormat === "object") {
    // Intl.NumberFormat オプション
    try {
      var numeric = parseFloat(content);
      // `selectedFormat` を元に新しいフォーマット設定を生成（mutateしない）
      var options = _rollupPluginBabelHelpers.objectSpread2({}, selectedFormat);
      if (typeof decimal === "number" && decimal > 0) {
        options.minimumFractionDigits = decimal;
        options.maximumFractionDigits = decimal;
      }
      var formatter = new Intl.NumberFormat(locale, options);
      return formatter.format(numeric);
    } catch (e) {
      console.warn("Number format failed:", e);
      return content;
    }
  } else if (typeof selectedFormat === "string") {
    return freeStrFormat.replace("%s", content);
  }
  //フォーマットが見つからないときはそのまま返す
  return content;
};

exports.FormatSelectControl = FormatSelectControl;
exports.displayFormated = displayFormated;
//# sourceMappingURL=formatCreate.js.map
