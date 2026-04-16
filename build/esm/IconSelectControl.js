import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { createElement } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { PanelRow, RadioControl, TextControl, ComboboxControl, __experimentalUnitControl } from '@wordpress/components';
import { PanelColorSettings } from '@wordpress/block-editor';

const helpLink = createElement("a", { href: "https://fontawesome.com/search", target: "_blank" }, "FontAwesome");
const helpTextCode = createElement("span", {}, helpLink, __("Select the icon from and enter Unicode (the upper right four digits of the selection dialog). ", "block-collections"));
const helpImageURL = createElement("span", {}, __("Enter the URL for the image.", "block-collections"));
const helpTextFamily = createElement("span", {}, __("Please select the first class name shown in the HTML code field of the selection dialog. ", "block-collections"));
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
    return (jsxs(Fragment, { children: [jsx("label", { className: "components-base-control__label", children: __("Icon Types", "block-collections") }), jsx(PanelRow, { className: "itmar_position_row", children: jsx(RadioControl, { selected: icon_type, options: [
                        { label: __("Awesome", "block-collections"), value: "awesome" },
                        { label: __("Image", "block-collections"), value: "image" },
                        { label: __("Avatar", "block-collections"), value: "avatar" },
                    ], onChange: (newValue) => {
                        const newStyle = { ...iconStyle, icon_type: newValue };
                        onChange(newStyle);
                    } }) }), icon_type === "awesome" && (jsxs(Fragment, { children: [jsx(TextControl, { label: __("icon name", "block-collections"), help: typeof helpTextCode !== "undefined" ? helpTextCode : "", value: icon_name || "", onChange: (newValue) => {
                            onChange({ ...iconStyle, icon_name: newValue });
                        } }), jsx(ComboboxControl, { label: __("Icon Family", "block-collections"), help: typeof helpTextFamily !== "undefined" ? helpTextFamily : "", options: typeof family_option !== "undefined" ? family_option : [], value: icon_family ? icon_family : "Font Awesome 6 Free", onChange: (newValue) => {
                            onChange({ ...iconStyle, icon_family: newValue || "" });
                        } })] })), icon_type === "image" && (jsx(TextControl, { label: __("icon url", "block-collections"), help: typeof helpImageURL !== "undefined" ? helpImageURL : "", value: icon_url || "", onChange: (newValue) => {
                    onChange({ ...iconStyle, icon_url: newValue });
                } })), jsxs(PanelRow, { className: "sizing_row", children: [jsx(__experimentalUnitControl, { dragDirection: "e", onChange: (newValue) => {
                            const newStyle = { ...iconStyle, icon_size: newValue };
                            onChange(newStyle);
                        }, label: __("Size", "block-collections"), value: icon_size, units: units }), setPosition && (jsx(__experimentalUnitControl, { dragDirection: "e", onChange: (newValue) => {
                            const newStyle = { ...iconStyle, icon_space: newValue };
                            onChange(newStyle);
                        }, label: __("spacing to end", "block-collections"), value: icon_space, units: units }))] }), jsx(PanelColorSettings, { title: __("Color settings", "itmar_location"), colorSettings: [
                    {
                        value: icon_color || "",
                        onChange: (newValue) => {
                            onChange({ ...iconStyle, icon_color: newValue || "" });
                        },
                        label: __("Icon color", "itmar_location"),
                    },
                ] }), setPosition && (jsxs(Fragment, { children: [jsx("label", { className: "components-base-control__label", children: __("Arrangement", "block-collections") }), jsx(PanelRow, { className: "itmar_position_row", children: jsx(RadioControl, { selected: icon_pos, options: [
                                { label: __("left", "block-collections"), value: "left" },
                                { label: __("right", "block-collections"), value: "right" },
                            ], onChange: (newValue) => {
                                const newStyle = { ...iconStyle, icon_pos: newValue };
                                onChange(newStyle);
                            } }) })] }))] }));
};

export { IconSelectControl as default };
//# sourceMappingURL=IconSelectControl.js.map
