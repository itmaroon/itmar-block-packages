'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var i18n = require('@wordpress/i18n');
var styledComponents = require('styled-components');
var components = require('@wordpress/components');

// 矢印の向きに応じたスタイルを生成するヘルパー関数
const arrowDirectionStyles = (direction) => {
    switch (direction) {
        case "left":
            return "transform: translate(-50%, -50%) rotate(-135deg);";
        case "right":
            return "transform: translate(-50%, -50%) rotate(45deg);";
        case "upper":
            return "transform: translate(-50%, -50%) rotate(-45deg);";
        case "under":
            return "transform: translate(-50%, -50%) rotate(135deg);";
        default:
            return "transform: translate(-50%, -50%) rotate(45deg);"; // default to 'down'
    }
};
const Arrow = ({ direction = "down" }) => styledComponents.css `
  &::after {
    content: "";
    position: absolute;
    display: block;
    width: 15%;
    height: 15%;
    border-top: 3px solid var(--wp--preset--color--accent-2);
    border-right: 3px solid var(--wp--preset--color--accent-2);
    top: 50%;
    left: 50%;
    ${arrowDirectionStyles(direction)}
  }
`;
//擬似要素の出力を選択させるインスペクターコントロール
const PseudoElm = ({ direction, onChange }) => {
    return (jsxRuntime.jsx(components.RadioControl, { selected: direction, options: [
            { label: i18n.__("Upper", "itmar_block_collections"), value: "upper" },
            { label: i18n.__("Left", "itmar_block_collections"), value: "left" },
            { label: i18n.__("Right", "itmar_block_collections"), value: "right" },
            { label: i18n.__("Under", "itmar_block_collections"), value: "under" },
        ], onChange: (changeOption) => {
            onChange(changeOption);
        } }));
};

exports.Arrow = Arrow;
exports.default = PseudoElm;
//# sourceMappingURL=PseudoElm.js.map
