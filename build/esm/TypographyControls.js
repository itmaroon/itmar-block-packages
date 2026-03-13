import { createElement, Fragment } from '@wordpress/element';
import { PanelBody, __experimentalUnitControl, PanelRow, RadioControl, ToggleControl } from '@wordpress/components';
import Select from 'react-select';
import { __ } from '@wordpress/i18n';

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
    const FontSelect = ({ label, value, onSelectChange, }) => (createElement(Fragment, null,
        label && (createElement("label", { className: "components-base-control__label" }, label)),
        createElement(Select, { options: fontFamilyOptions, value: fontFamilyOptions.find((option) => option.value === value), onChange: (newValue) => {
                onSelectChange(newValue.value);
            }, styles: customStyles })));
    return (createElement(PanelBody, { title: title, initialOpen: initialOpen },
        createElement(__experimentalUnitControl, { label: !isMobile
                ? __("Size(desktop)", "block-collections")
                : __("Size(mobile)", "block-collections"), value: !isMobile ? default_fontSize : mobile_fontSize, units: units, onChange: (newValue) => {
                const safeValue = newValue !== undefined && newValue !== "" ? newValue : "0px";
                const set_size = !isMobile
                    ? { default_fontSize: safeValue }
                    : { mobile_fontSize: safeValue };
                onChange({ ...fontStyle, ...set_size });
            } }),
        createElement(FontSelect, { label: __("font family", "block-collections"), value: fontFamily, onSelectChange: (newValue) => {
                onChange({ ...fontStyle, fontFamily: newValue });
            } }),
        createElement("label", { className: "components-base-control__label" }, __("font weight", "block-collections")),
        createElement(PanelRow, { className: "itmar_weight_row" },
            createElement(RadioControl, { selected: fontWeight, options: [
                    { label: "LIGHT", value: "300" },
                    { label: "REGULAR", value: "400" },
                    { label: "MEDIUM", value: "500" },
                    { label: "S-BOLD", value: "600" },
                    { label: "BOLD", value: "700" },
                    { label: "BLACK", value: "900" },
                ], onChange: (newValue) => {
                    const newStyle = { ...fontStyle, fontWeight: newValue };
                    onChange(newStyle);
                } })),
        createElement(ToggleControl, { label: __("Italic display", "block-collections"), checked: isItalic, onChange: (newValue) => {
                onChange({ ...fontStyle, isItalic: newValue });
            } })));
};

export { TypographyControls as default };
//# sourceMappingURL=TypographyControls.js.map
