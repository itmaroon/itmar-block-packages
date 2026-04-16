'use strict';

var jsxRuntime = require('react/jsx-runtime');
var i18n = require('@wordpress/i18n');
var components = require('@wordpress/components');
var date = require('@wordpress/date');

//日付のフォーマット
const dateFormats = [
    { label: "YYYY-MM-DD HH:mm:ss", value: "Y-m-d H:i:s" },
    { label: "MM/DD/YYYY", value: "m/d/Y" },
    { label: "DD/MM/YYYY", value: "d/m/Y" },
    { label: "MMMM D, YYYY", value: "F j, Y" },
    { label: "HH:mm:ss", value: "H:i:s" },
    { label: "YYYY.M.D", value: "Y.n.j" },
    { label: "Day, MMMM D, YYYY", value: "l, F j, Y" },
    { label: "ddd, MMM D, YYYY", value: "D, M j, Y" },
    { label: "YYYY年M月D日 (曜日)", value: "Y年n月j日 (l)" },
];
//プレーンのフォーマット
const plaineFormats = [
    {
        key: "str_free",
        label: i18n.__("Free String", "block-collections"),
        value: "%s",
    },
    {
        key: "num_comma",
        label: i18n.__("Numbers (comma separated)", "block-collections"),
        value: {
            style: "decimal",
            useGrouping: true, // カンマ区切り
        },
    },
    {
        key: "num_no_comma",
        label: i18n.__("Numbers (no commas)", "block-collections"),
        value: {
            style: "decimal",
            useGrouping: false,
        },
    },
    {
        key: "num_amount",
        label: i18n.__("Amount", "block-collections"),
        value: {
            style: "currency",
            currency: "JPY",
        },
    },
];
const FormatSelectControl = ({ titleType, userFormat, freeStrFormat, decimal, onFormatChange, }) => {
    const isPlaine = titleType === "plaine";
    const isDate = titleType === "date";
    const isUser = titleType === "user";
    //SelectControlのオプションを生成
    const options = isDate
        ? dateFormats
        : plaineFormats.map((f) => ({ label: f.label, value: f.key }));
    return (jsxRuntime.jsxs(components.PanelBody, { title: i18n.__("Display Format Setting", "block-collections"), children: [(isPlaine || isDate) && (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(components.SelectControl, { label: i18n.__("Select Format", "block-collections"), value: userFormat, options: options, onChange: (newFormat) => onFormatChange({
                            userFormat: newFormat,
                            freeStrFormat,
                            decimal,
                        }) }), userFormat?.startsWith("str_") && (jsxRuntime.jsx(components.TextControl, { label: i18n.__("String Format", "block-collections"), value: freeStrFormat, onChange: (newFormat) => onFormatChange({
                            userFormat,
                            freeStrFormat: newFormat,
                            decimal,
                        }) })), userFormat?.startsWith("num_") && (jsxRuntime.jsx(components.PanelRow, { className: "itmar_post_blocks_pannel", children: jsxRuntime.jsx(components.RangeControl, { value: decimal, label: i18n.__("Decimal Num", "query-blocks"), max: 5, min: 0, onChange: (val) => onFormatChange({
                                userFormat,
                                freeStrFormat,
                                decimal: val ?? 0,
                            }) }) }))] })), isUser && (jsxRuntime.jsx(components.TextControl, { label: i18n.__("User Format", "block-collections"), value: freeStrFormat, onChange: (newFormat) => onFormatChange({
                    userFormat: "str_free",
                    freeStrFormat: newFormat,
                    decimal,
                }) }))] }));
};
/**
 * 値を指定されたフォーマットで整形して返す
 */
const displayFormated = (content, userFormat, freeStrFormat, decimal) => {
    if (content === undefined || content === null)
        return "";
    // 内部で使用するロケール
    const locale = date.getSettings().l10n?.locale || "en";
    //日付にフォーマットがあれば、それで書式設定してリターン
    const isDateFormat = dateFormats.find((f) => f.value === userFormat);
    if (isDateFormat && userFormat) {
        // WordPressの format 関数を使用して日付を整形
        return date.format(userFormat, content);
    }
    //数値や文字列のフォーマット
    const selectedFormat = plaineFormats.find((f) => f.key === userFormat)?.value;
    if (typeof selectedFormat === "object" && selectedFormat !== null) {
        // Intl.NumberFormat オプション
        try {
            const numeric = typeof content === "number" ? content : parseFloat(content);
            if (isNaN(numeric))
                return String(content);
            // `selectedFormat` を元に新しいフォーマット設定を生成（mutateしない）
            // options を型安全に生成
            const options = { ...selectedFormat };
            if (typeof decimal === "number" && decimal > 0) {
                options.minimumFractionDigits = decimal;
                options.maximumFractionDigits = decimal;
            }
            const formatter = new Intl.NumberFormat(locale, options);
            return formatter.format(numeric);
        }
        catch (e) {
            console.warn("Number format failed:", e);
            return String(content);
        }
    }
    else if (typeof selectedFormat === "string") {
        return freeStrFormat.replace("%s", String(content));
    }
    //フォーマットが見つからないときはそのまま返す
    return content;
};

exports.FormatSelectControl = FormatSelectControl;
exports.displayFormated = displayFormated;
//# sourceMappingURL=formatCreate.js.map
