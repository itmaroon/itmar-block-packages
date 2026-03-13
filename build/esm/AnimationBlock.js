import { __ } from '@wordpress/i18n';
import { css } from 'styled-components';
import { createElement, Fragment } from '@wordpress/element';
import { PanelBody, ToggleControl, RadioControl, RangeControl } from '@wordpress/components';

const anime_comp = (attributes) => {
    return css `
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
    return (createElement(Fragment, null,
        createElement(PanelBody, { title: __("Animation Setting", "block-collections"), initialOpen: true },
            createElement(ToggleControl, { label: __("Is Animation", "block-collections"), checked: is_anime, onChange: (newVal) => {
                    props.onChange({ is_anime: newVal });
                } }),
            is_anime && (createElement(Fragment, null,
                createElement("div", { className: "itmar_link_type" },
                    createElement(RadioControl, { label: __("Animation Pattern", "block-collections"), selected: anime_prm.pattern, options: [
                            { label: "flipDown", value: "flipDown" },
                            { label: "fadeUp", value: "fadeUp" },
                            { label: "fadeLeft", value: "fadeLeft" },
                            { label: "fadeRight", value: "fadeRight" },
                        ], onChange: (changeOption) => {
                            props.onChange({
                                anime_prm: { ...anime_prm, pattern: changeOption },
                            });
                        } })),
                createElement(RangeControl, { value: anime_prm.duration, label: __("Animation duration time", "block-collections"), max: 5, min: 0, onChange: (val) => {
                        // val が undefined の場合は 0（または適切なデフォルト値）を採用する
                        const safeValue = val ?? 0;
                        props.onChange({
                            anime_prm: { ...anime_prm, duration: safeValue },
                        });
                    }, step: 0.1, withInputField: true }),
                createElement(RangeControl, { value: anime_prm.delay, label: __("Animation delay time", "block-collections"), max: 3, min: 0, onChange: (val) => {
                        // val が undefined の場合は 0（または適切なデフォルト値）を採用する
                        const safeValue = val ?? 0;
                        props.onChange({
                            anime_prm: { ...anime_prm, delay: safeValue },
                        });
                    }, step: 0.1, withInputField: true }),
                createElement("div", { className: "itmar_link_type" },
                    createElement(RadioControl, { label: __("Animation Trigger", "block-collections"), selected: anime_prm.trigger, options: [
                            {
                                label: __("Page Opend", "block-collections"),
                                value: "opend",
                            },
                            {
                                label: __("Enter Visible", "block-collections"),
                                value: "visible",
                            },
                        ], onChange: (changeOption) => {
                            props.onChange({
                                anime_prm: { ...anime_prm, trigger: changeOption },
                            });
                        } })))))));
}

export { anime_comp, AnimationBlock as default };
//# sourceMappingURL=AnimationBlock.js.map
