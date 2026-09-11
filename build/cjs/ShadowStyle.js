'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var i18n = require('@wordpress/i18n');
var blockEditor = require('@wordpress/block-editor');
var components = require('@wordpress/components');
var element = require('@wordpress/element');
var data = require('@wordpress/data');
var shadowCss = require('./shadowCss.js');

/** 影を算出できなかったときに編集画面へ通知する。算出ロジック側は純粋に保つ。 */
const notifyShadowError = (reason) => {
    let message;
    if (reason === "gradient-newmor") {
        message = i18n.__("Neumorphism cannot be set when the background color is a gradient.", "itmar_guest_contact_block");
    }
    else if (reason === "gradient-claymor") {
        message = i18n.__("claymorphism cannot be set when the background color is a gradient.", "itmar_guest_contact_block");
    }
    else {
        message = i18n.__("Failed to interpret the base color.", "itmar_guest_contact_block");
    }
    data.dispatch("core/notices").createNotice("error", message, {
        type: "snackbar",
        isDismissible: true,
    });
};
const ShadowStyle = ({ shadowStyle, onChange }) => {
    const [shadowState, setShadowState] = element.useState(shadowStyle);
    const { shadowType, spread, lateral, longitude, nomalBlur, shadowColor, blur, intensity, distance, newDirection, clayDirection, embos, opacity, depth, bdBlur, expand, glassblur, glassopa, hasOutline, } = shadowState;
    //シャドーのスタイル変更と背景色変更に伴う親コンポーネントの変更
    element.useEffect(() => {
        const shadowElm = shadowCss.ShadowElm(shadowState, notifyShadowError);
        if (shadowElm)
            onChange(shadowElm, shadowState);
    }, [shadowState]);
    // ヘルパー: ステートの一部を更新
    const updateState = (partial) => {
        setShadowState((prev) => ({ ...prev, ...partial }));
    };
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsxs(components.PanelBody, { title: i18n.__("Shadow Type", "block-collections"), initialOpen: true, children: [jsxRuntime.jsx("div", { className: "itmar_shadow_type", children: jsxRuntime.jsx(components.RadioControl, { selected: shadowType, options: [
                                { label: i18n.__("Normal", "block-collections"), value: "nomal" },
                                {
                                    label: i18n.__("Neumorphism", "block-collections"),
                                    value: "newmor",
                                },
                                {
                                    label: i18n.__("Claymorphism", "block-collections"),
                                    value: "claymor",
                                },
                                {
                                    label: i18n.__("Glassmorphism", "block-collections"),
                                    value: "glassmor",
                                },
                            ], onChange: (val) => updateState({ shadowType: val }) }) }), shadowType !== "claymor" && (jsxRuntime.jsx("div", { className: "embos", children: jsxRuntime.jsx(components.RadioControl, { label: i18n.__("unevenness", "block-collections"), selected: embos, options: [
                                { label: "Swell", value: "swell" },
                                { label: "Dent", value: "dent" },
                            ], onChange: (val) => updateState({ embos: val }) }) }))] }), shadowType === "nomal" && (jsxRuntime.jsxs(components.PanelBody, { title: i18n.__("Normal settings", "block-collections"), initialOpen: false, children: [jsxRuntime.jsx(components.RangeControl, { value: spread, label: i18n.__("Spread", "block-collections"), max: 50, min: 0, onChange: (val) => updateState({ spread: val ?? 0 }) }), jsxRuntime.jsx(components.RangeControl, { value: lateral, label: i18n.__("Lateral direction", "block-collections"), max: 50, min: 0, onChange: (val) => updateState({ lateral: val ?? 0 }) }), jsxRuntime.jsx(components.RangeControl, { value: longitude, label: i18n.__("Longitudinal direction", "block-collections"), max: 50, min: 0, onChange: (val) => updateState({ longitude: val ?? 0 }) }), jsxRuntime.jsx(components.RangeControl, { value: nomalBlur, label: i18n.__("Blur", "block-collections"), max: 20, min: 0, onChange: (val) => updateState({ nomalBlur: val ?? 0 }) }), jsxRuntime.jsx(blockEditor.PanelColorSettings, { title: i18n.__("Shadow Color Setting", "block-collections"), colorSettings: [
                            {
                                value: shadowColor,
                                label: i18n.__("Choose Shadow color", "block-collections"),
                                onChange: (val) => updateState({ shadowColor: val || "" }),
                            },
                        ] })] })), shadowType === "newmor" && (jsxRuntime.jsxs(components.PanelBody, { title: i18n.__("Neumorphism settings", "block-collections"), initialOpen: false, children: [jsxRuntime.jsx(components.RangeControl, { value: distance, label: i18n.__("Distance", "block-collections"), max: 50, min: 0, onChange: (val) => updateState({ distance: val ?? 0 }) }), jsxRuntime.jsx(components.RangeControl, { value: intensity, label: i18n.__("Intensity", "block-collections"), max: 100, min: 0, onChange: (val) => updateState({ intensity: val ?? 0 }) }), jsxRuntime.jsx(components.RangeControl, { value: blur, label: i18n.__("Blur", "block-collections"), max: 20, min: 0, onChange: (val) => updateState({ blur: val ?? 0 }) }), jsxRuntime.jsx(components.PanelRow, { children: jsxRuntime.jsx("div", { className: "light_direction", children: jsxRuntime.jsx(components.RadioControl, { selected: newDirection, options: [
                                    { label: "Top Left", value: "top_left" },
                                    { label: "Top Right", value: "top_right" },
                                    { label: "Bottom Left", value: "bottom_left" },
                                    { label: "Bottom Right", value: "bottom_right" },
                                ], onChange: (val) => updateState({ newDirection: val }) }) }) })] })), shadowType === "claymor" && (jsxRuntime.jsxs(components.PanelBody, { title: i18n.__("Claymorphism settings", "block-collections"), initialOpen: false, children: [jsxRuntime.jsx(components.RangeControl, { value: opacity, label: i18n.__("Opacity", "block-collections"), max: 1, min: 0, step: 0.1, onChange: (val) => updateState({ opacity: val ?? 1 }) }), jsxRuntime.jsx(components.RangeControl, { value: depth, label: "Depth", max: 20, min: 0, onChange: (val) => updateState({ depth: val ?? 0 }) }), jsxRuntime.jsx(components.RangeControl, { value: expand, label: "Expand", max: 50, min: 0, onChange: (val) => updateState({ expand: val ?? 0 }) }), jsxRuntime.jsx(components.RangeControl, { value: bdBlur, label: "Background Blur", max: 10, min: 0, onChange: (val) => updateState({ bdBlur: val ?? 0 }) }), jsxRuntime.jsx("div", { className: "light_direction claymor", children: jsxRuntime.jsx(components.RadioControl, { selected: clayDirection, options: [
                                { label: "Right Bottom", value: "right_bottom" },
                                { label: "Top Right", value: "top_right" },
                                { label: "Top", value: "top" },
                            ], onChange: (val) => updateState({ clayDirection: val }) }) })] })), shadowType === "glassmor" && (jsxRuntime.jsxs(components.PanelBody, { title: i18n.__("Grassmophism settings", "block-collections"), initialOpen: false, children: [jsxRuntime.jsx(components.RangeControl, { value: glassblur, label: i18n.__("Glass blur", "block-collections"), max: 20, min: 0, onChange: (val) => updateState({ glassblur: val ?? 0 }) }), jsxRuntime.jsx(components.RangeControl, { value: glassopa, label: i18n.__("Glass Opacity", "block-collections"), max: 1, min: 0, step: 0.1, onChange: (val) => updateState({ glassopa: val ?? 0.5 }) }), jsxRuntime.jsx(components.ToggleControl, { label: i18n.__("Show outline", "block-collections"), checked: hasOutline, onChange: (val) => updateState({ hasOutline: val }) })] }))] }));
};

exports.ShadowElm = shadowCss.ShadowElm;
exports.default = ShadowStyle;
//# sourceMappingURL=ShadowStyle.js.map
