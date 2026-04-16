'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var element = require('@wordpress/element');
var i18n = require('@wordpress/i18n');
var components = require('@wordpress/components');
var blockEditor = require('@wordpress/block-editor');

const helpLink = element.createElement("a", { href: "https://fontawesome.com/search", target: "_blank" }, "FontAwesome");
const helpTextCode = element.createElement("span", {}, helpLink, i18n.__("Select the icon from and enter Unicode (the upper right four digits of the selection dialog). ", "block-collections"));
const helpImageURL = element.createElement("span", {}, i18n.__("Enter the URL for the image.", "block-collections"));
const helpTextFamily = element.createElement("span", {}, i18n.__("Please select the first class name shown in the HTML code field of the selection dialog. ", "block-collections"));
const units = [
    { value: "px", label: "px" },
    { value: "em", label: "em" },
    { value: "rem", label: "rem" },
];
const family_option = [
    { value: "Font Awesome 6 Free", label: "SOLID" },
    { value: "Font Awesome 6 Brands", label: "BRANDS" },
];
var IconSelectControl = ({ iconStyle, setPosition, onChange }) => {
    const { icon_type, icon_url, icon_name, icon_pos, icon_size, icon_color, icon_space, icon_family, } = iconStyle;
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx("label", { className: "components-base-control__label", children: i18n.__("Icon Types", "block-collections") }), jsxRuntime.jsx(components.PanelRow, { className: "itmar_position_row", children: jsxRuntime.jsx(components.RadioControl, { selected: icon_type, options: [
                        { label: i18n.__("Awesome", "block-collections"), value: "awesome" },
                        { label: i18n.__("Image", "block-collections"), value: "image" },
                        { label: i18n.__("Avatar", "block-collections"), value: "avatar" },
                    ], onChange: (newValue) => {
                        const newStyle = { ...iconStyle, icon_type: newValue };
                        onChange(newStyle);
                    } }) }), icon_type === "awesome" && (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(components.TextControl, { label: i18n.__("icon name", "block-collections"), help: typeof helpTextCode !== "undefined" ? helpTextCode : "", value: icon_name || "", onChange: (newValue) => {
                            onChange({ ...iconStyle, icon_name: newValue });
                        } }), jsxRuntime.jsx(components.ComboboxControl, { label: i18n.__("Icon Family", "block-collections"), help: typeof helpTextFamily !== "undefined" ? helpTextFamily : "", options: typeof family_option !== "undefined" ? family_option : [], value: icon_family ? icon_family : "Font Awesome 6 Free", onChange: (newValue) => {
                            onChange({ ...iconStyle, icon_family: newValue || "" });
                        } })] })), icon_type === "image" && (jsxRuntime.jsx(components.TextControl, { label: i18n.__("icon url", "block-collections"), help: typeof helpImageURL !== "undefined" ? helpImageURL : "", value: icon_url || "", onChange: (newValue) => {
                    onChange({ ...iconStyle, icon_url: newValue });
                } })), jsxRuntime.jsxs(components.PanelRow, { className: "sizing_row", children: [jsxRuntime.jsx(components.__experimentalUnitControl, { dragDirection: "e", onChange: (newValue) => {
                            const newStyle = { ...iconStyle, icon_size: newValue };
                            onChange(newStyle);
                        }, label: i18n.__("Size", "block-collections"), value: icon_size, units: units }), setPosition && (jsxRuntime.jsx(components.__experimentalUnitControl, { dragDirection: "e", onChange: (newValue) => {
                            const newStyle = { ...iconStyle, icon_space: newValue };
                            onChange(newStyle);
                        }, label: i18n.__("spacing to end", "block-collections"), value: icon_space, units: units }))] }), jsxRuntime.jsx(blockEditor.PanelColorSettings, { title: i18n.__("Color settings", "itmar_location"), colorSettings: [
                    {
                        value: icon_color || "",
                        onChange: (newValue) => {
                            onChange({ ...iconStyle, icon_color: newValue || "" });
                        },
                        label: i18n.__("Icon color", "itmar_location"),
                    },
                ] }), setPosition && (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx("label", { className: "components-base-control__label", children: i18n.__("Arrangement", "block-collections") }), jsxRuntime.jsx(components.PanelRow, { className: "itmar_position_row", children: jsxRuntime.jsx(components.RadioControl, { selected: icon_pos, options: [
                                { label: i18n.__("left", "block-collections"), value: "left" },
                                { label: i18n.__("right", "block-collections"), value: "right" },
                            ], onChange: (newValue) => {
                                const newStyle = { ...iconStyle, icon_pos: newValue };
                                onChange(newStyle);
                            } }) })] }))] }));
};

exports.default = IconSelectControl;
//# sourceMappingURL=IconSelectControl.js.map
