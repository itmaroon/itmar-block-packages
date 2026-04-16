'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var components = require('@wordpress/components');
var Select = require('react-select');
var i18n = require('@wordpress/i18n');

const TypographyControls = ({ title, fontStyle, initialOpen = true, isMobile, onChange, }) => {
    const { default_fontSize, mobile_fontSize, fontFamily, fontWeight, isItalic, } = fontStyle;
    const fontFamilyOptions = [
        {
            value: "Arial, sans-serif",
            label: "Arial",
            fontFamily: "Arial, sans-serif",
        },
        {
            value: "Courier New, monospace",
            label: "Courier New",
            fontFamily: "Courier New, monospace",
        },
        { value: "Georgia, serif", label: "Georgia", fontFamily: "Georgia, serif" },
        {
            label: "Noto Sans JP",
            value: "Noto Sans JP, sans-serif",
            fontFamily: "Noto Sans JP, sans-serif",
        },
        {
            label: "Texturina",
            value: "Texturina, serif",
            fontFamily: "Texturina, serif",
        },
    ];
    const units = [
        { value: "px", label: "px" },
        { value: "em", label: "em" },
        { value: "rem", label: "rem" },
    ];
    // react-select 用のスタイル定義
    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            fontFamily: state.data.fontFamily,
        }),
    };
    // 内部コンポーネント FontSelect
    const FontSelect = ({ label, value, onSelectChange, }) => (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [label && (jsxRuntime.jsx("label", { className: "components-base-control__label", children: label })), jsxRuntime.jsx(Select, { options: fontFamilyOptions, value: fontFamilyOptions.find((option) => option.value === value), onChange: (newValue) => {
                    onSelectChange(newValue.value);
                }, styles: customStyles })] }));
    return (jsxRuntime.jsxs(components.PanelBody, { title: title, initialOpen: initialOpen, children: [jsxRuntime.jsx(components.__experimentalUnitControl, { label: !isMobile
                    ? i18n.__("Size(desktop)", "block-collections")
                    : i18n.__("Size(mobile)", "block-collections"), value: !isMobile ? default_fontSize : mobile_fontSize, units: units, onChange: (newValue) => {
                    const safeValue = newValue !== undefined && newValue !== "" ? newValue : "0px";
                    const set_size = !isMobile
                        ? { default_fontSize: safeValue }
                        : { mobile_fontSize: safeValue };
                    onChange({ ...fontStyle, ...set_size });
                } }), jsxRuntime.jsx(FontSelect, { label: i18n.__("font family", "block-collections"), value: fontFamily, onSelectChange: (newValue) => {
                    onChange({ ...fontStyle, fontFamily: newValue });
                } }), jsxRuntime.jsx("label", { className: "components-base-control__label", children: i18n.__("font weight", "block-collections") }), jsxRuntime.jsx(components.PanelRow, { className: "itmar_weight_row", children: jsxRuntime.jsx(components.RadioControl, { selected: fontWeight, options: [
                        { label: "LIGHT", value: "300" },
                        { label: "REGULAR", value: "400" },
                        { label: "MEDIUM", value: "500" },
                        { label: "S-BOLD", value: "600" },
                        { label: "BOLD", value: "700" },
                        { label: "BLACK", value: "900" },
                    ], onChange: (newValue) => {
                        const newStyle = { ...fontStyle, fontWeight: newValue };
                        onChange(newStyle);
                    } }) }), jsxRuntime.jsx(components.ToggleControl, { label: i18n.__("Italic display", "block-collections"), checked: isItalic, onChange: (newValue) => {
                    onChange({ ...fontStyle, isItalic: newValue });
                } })] }));
};

exports.default = TypographyControls;
//# sourceMappingURL=TypographyControls.js.map
