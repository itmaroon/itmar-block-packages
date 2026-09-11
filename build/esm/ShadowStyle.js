import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { __ } from '@wordpress/i18n';
import { PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, RadioControl, RangeControl, PanelRow, ToggleControl } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { dispatch } from '@wordpress/data';
import { ShadowElm } from './shadowCss.js';

/** 影を算出できなかったときに編集画面へ通知する。算出ロジック側は純粋に保つ。 */
const notifyShadowError = (reason) => {
    let message;
    if (reason === "gradient-newmor") {
        message = __("Neumorphism cannot be set when the background color is a gradient.", "itmar_guest_contact_block");
    }
    else if (reason === "gradient-claymor") {
        message = __("claymorphism cannot be set when the background color is a gradient.", "itmar_guest_contact_block");
    }
    else {
        message = __("Failed to interpret the base color.", "itmar_guest_contact_block");
    }
    dispatch("core/notices").createNotice("error", message, {
        type: "snackbar",
        isDismissible: true,
    });
};
const ShadowStyle = ({ shadowStyle, onChange }) => {
    const [shadowState, setShadowState] = useState(shadowStyle);
    const { shadowType, spread, lateral, longitude, nomalBlur, shadowColor, blur, intensity, distance, newDirection, clayDirection, embos, opacity, depth, bdBlur, expand, glassblur, glassopa, hasOutline, } = shadowState;
    //シャドーのスタイル変更と背景色変更に伴う親コンポーネントの変更
    useEffect(() => {
        const shadowElm = ShadowElm(shadowState, notifyShadowError);
        if (shadowElm)
            onChange(shadowElm, shadowState);
    }, [shadowState]);
    // ヘルパー: ステートの一部を更新
    const updateState = (partial) => {
        setShadowState((prev) => ({ ...prev, ...partial }));
    };
    return (jsxs(Fragment, { children: [jsxs(PanelBody, { title: __("Shadow Type", "block-collections"), initialOpen: true, children: [jsx("div", { className: "itmar_shadow_type", children: jsx(RadioControl, { selected: shadowType, options: [
                                { label: __("Normal", "block-collections"), value: "nomal" },
                                {
                                    label: __("Neumorphism", "block-collections"),
                                    value: "newmor",
                                },
                                {
                                    label: __("Claymorphism", "block-collections"),
                                    value: "claymor",
                                },
                                {
                                    label: __("Glassmorphism", "block-collections"),
                                    value: "glassmor",
                                },
                            ], onChange: (val) => updateState({ shadowType: val }) }) }), shadowType !== "claymor" && (jsx("div", { className: "embos", children: jsx(RadioControl, { label: __("unevenness", "block-collections"), selected: embos, options: [
                                { label: "Swell", value: "swell" },
                                { label: "Dent", value: "dent" },
                            ], onChange: (val) => updateState({ embos: val }) }) }))] }), shadowType === "nomal" && (jsxs(PanelBody, { title: __("Normal settings", "block-collections"), initialOpen: false, children: [jsx(RangeControl, { value: spread, label: __("Spread", "block-collections"), max: 50, min: 0, onChange: (val) => updateState({ spread: val ?? 0 }) }), jsx(RangeControl, { value: lateral, label: __("Lateral direction", "block-collections"), max: 50, min: 0, onChange: (val) => updateState({ lateral: val ?? 0 }) }), jsx(RangeControl, { value: longitude, label: __("Longitudinal direction", "block-collections"), max: 50, min: 0, onChange: (val) => updateState({ longitude: val ?? 0 }) }), jsx(RangeControl, { value: nomalBlur, label: __("Blur", "block-collections"), max: 20, min: 0, onChange: (val) => updateState({ nomalBlur: val ?? 0 }) }), jsx(PanelColorSettings, { title: __("Shadow Color Setting", "block-collections"), colorSettings: [
                            {
                                value: shadowColor,
                                label: __("Choose Shadow color", "block-collections"),
                                onChange: (val) => updateState({ shadowColor: val || "" }),
                            },
                        ] })] })), shadowType === "newmor" && (jsxs(PanelBody, { title: __("Neumorphism settings", "block-collections"), initialOpen: false, children: [jsx(RangeControl, { value: distance, label: __("Distance", "block-collections"), max: 50, min: 0, onChange: (val) => updateState({ distance: val ?? 0 }) }), jsx(RangeControl, { value: intensity, label: __("Intensity", "block-collections"), max: 100, min: 0, onChange: (val) => updateState({ intensity: val ?? 0 }) }), jsx(RangeControl, { value: blur, label: __("Blur", "block-collections"), max: 20, min: 0, onChange: (val) => updateState({ blur: val ?? 0 }) }), jsx(PanelRow, { children: jsx("div", { className: "light_direction", children: jsx(RadioControl, { selected: newDirection, options: [
                                    { label: "Top Left", value: "top_left" },
                                    { label: "Top Right", value: "top_right" },
                                    { label: "Bottom Left", value: "bottom_left" },
                                    { label: "Bottom Right", value: "bottom_right" },
                                ], onChange: (val) => updateState({ newDirection: val }) }) }) })] })), shadowType === "claymor" && (jsxs(PanelBody, { title: __("Claymorphism settings", "block-collections"), initialOpen: false, children: [jsx(RangeControl, { value: opacity, label: __("Opacity", "block-collections"), max: 1, min: 0, step: 0.1, onChange: (val) => updateState({ opacity: val ?? 1 }) }), jsx(RangeControl, { value: depth, label: "Depth", max: 20, min: 0, onChange: (val) => updateState({ depth: val ?? 0 }) }), jsx(RangeControl, { value: expand, label: "Expand", max: 50, min: 0, onChange: (val) => updateState({ expand: val ?? 0 }) }), jsx(RangeControl, { value: bdBlur, label: "Background Blur", max: 10, min: 0, onChange: (val) => updateState({ bdBlur: val ?? 0 }) }), jsx("div", { className: "light_direction claymor", children: jsx(RadioControl, { selected: clayDirection, options: [
                                { label: "Right Bottom", value: "right_bottom" },
                                { label: "Top Right", value: "top_right" },
                                { label: "Top", value: "top" },
                            ], onChange: (val) => updateState({ clayDirection: val }) }) })] })), shadowType === "glassmor" && (jsxs(PanelBody, { title: __("Grassmophism settings", "block-collections"), initialOpen: false, children: [jsx(RangeControl, { value: glassblur, label: __("Glass blur", "block-collections"), max: 20, min: 0, onChange: (val) => updateState({ glassblur: val ?? 0 }) }), jsx(RangeControl, { value: glassopa, label: __("Glass Opacity", "block-collections"), max: 1, min: 0, step: 0.1, onChange: (val) => updateState({ glassopa: val ?? 0.5 }) }), jsx(ToggleControl, { label: __("Show outline", "block-collections"), checked: hasOutline, onChange: (val) => updateState({ hasOutline: val }) })] }))] }));
};

export { ShadowElm, ShadowStyle as default };
//# sourceMappingURL=ShadowStyle.js.map
