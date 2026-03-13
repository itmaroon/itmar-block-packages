'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var i18n = require('@wordpress/i18n');
var styledComponents = require('styled-components');
var element = require('@wordpress/element');
var components = require('@wordpress/components');

const anime_comp = (attributes) => {
    return styledComponents.css `
    &.fadeTrigger {
      opacity: 0;
    }
    &.${attributes.pattern} {
      animation-name: ${attributes.pattern};
      animation-delay: ${attributes.delay}s;
      animation-duration: ${attributes.duration}s;
      animation-fill-mode: forwards;
      opacity: 0;
    }
  `;
};
function AnimationBlock(props) {
    const { is_anime, anime_prm } = props.attributes;
    return (element.createElement(element.Fragment, null,
        element.createElement(components.PanelBody, { title: i18n.__("Animation Setting", "block-collections"), initialOpen: true },
            element.createElement(components.ToggleControl, { label: i18n.__("Is Animation", "block-collections"), checked: is_anime, onChange: (newVal) => {
                    props.onChange({ is_anime: newVal });
                } }),
            is_anime && (element.createElement(element.Fragment, null,
                element.createElement("div", { className: "itmar_link_type" },
                    element.createElement(components.RadioControl, { label: i18n.__("Animation Pattern", "block-collections"), selected: anime_prm.pattern, options: [
                            { label: "flipDown", value: "flipDown" },
                            { label: "fadeUp", value: "fadeUp" },
                            { label: "fadeLeft", value: "fadeLeft" },
                            { label: "fadeRight", value: "fadeRight" },
                        ], onChange: (changeOption) => {
                            props.onChange({
                                anime_prm: { ...anime_prm, pattern: changeOption },
                            });
                        } })),
                element.createElement(components.RangeControl, { value: anime_prm.duration, label: i18n.__("Animation duration time", "block-collections"), max: 5, min: 0, onChange: (val) => {
                        // val が undefined の場合は 0（または適切なデフォルト値）を採用する
                        const safeValue = val ?? 0;
                        props.onChange({
                            anime_prm: { ...anime_prm, duration: safeValue },
                        });
                    }, step: 0.1, withInputField: true }),
                element.createElement(components.RangeControl, { value: anime_prm.delay, label: i18n.__("Animation delay time", "block-collections"), max: 3, min: 0, onChange: (val) => {
                        // val が undefined の場合は 0（または適切なデフォルト値）を採用する
                        const safeValue = val ?? 0;
                        props.onChange({
                            anime_prm: { ...anime_prm, delay: safeValue },
                        });
                    }, step: 0.1, withInputField: true }),
                element.createElement("div", { className: "itmar_link_type" },
                    element.createElement(components.RadioControl, { label: i18n.__("Animation Trigger", "block-collections"), selected: anime_prm.trigger, options: [
                            {
                                label: i18n.__("Page Opend", "block-collections"),
                                value: "opend",
                            },
                            {
                                label: i18n.__("Enter Visible", "block-collections"),
                                value: "visible",
                            },
                        ], onChange: (changeOption) => {
                            props.onChange({
                                anime_prm: { ...anime_prm, trigger: changeOption },
                            });
                        } })))))));
}

exports.anime_comp = anime_comp;
exports.default = AnimationBlock;
//# sourceMappingURL=AnimationBlock.js.map
