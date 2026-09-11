'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var i18n = require('@wordpress/i18n');
var components = require('@wordpress/components');

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

exports.default = PseudoElm;
//# sourceMappingURL=PseudoElm.js.map
