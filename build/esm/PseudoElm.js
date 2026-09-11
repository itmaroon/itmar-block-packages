import { jsx } from 'react/jsx-runtime';
import { __ } from '@wordpress/i18n';
import { RadioControl } from '@wordpress/components';

//擬似要素の出力を選択させるインスペクターコントロール
const PseudoElm = ({ direction, onChange }) => {
    return (jsx(RadioControl, { selected: direction, options: [
            { label: __("Upper", "itmar_block_collections"), value: "upper" },
            { label: __("Left", "itmar_block_collections"), value: "left" },
            { label: __("Right", "itmar_block_collections"), value: "right" },
            { label: __("Under", "itmar_block_collections"), value: "under" },
        ], onChange: (changeOption) => {
            onChange(changeOption);
        } }));
};

export { PseudoElm as default };
//# sourceMappingURL=PseudoElm.js.map
