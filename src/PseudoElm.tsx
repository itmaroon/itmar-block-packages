import { __ } from "@wordpress/i18n";
import { RadioControl } from "@wordpress/components";

import type { ArrowDirection } from "./pseudoCss";

/**
 * 矢印のCSS生成は styled-components 非依存の ./pseudoCss へ移した。
 * ビュースクリプトが `Arrow` を参照する際に、このファイル（@wordpress/components
 * 依存）を引き込まないようにするため。後方互換のためここから再エクスポートする。
 */
export { Arrow, arrowDirectionStyles } from "./pseudoCss";
export type { ArrowDirection, ArrowProps } from "./pseudoCss";

// Props の型定義
interface PseudoElmProps {
  direction: ArrowDirection;
  onChange: (value: ArrowDirection) => void;
}

//擬似要素の出力を選択させるインスペクターコントロール
const PseudoElm = ({ direction, onChange }: PseudoElmProps) => {
  return (
    <RadioControl
      selected={direction}
      options={[
        { label: __("Upper", "itmar_block_collections"), value: "upper" },
        { label: __("Left", "itmar_block_collections"), value: "left" },
        { label: __("Right", "itmar_block_collections"), value: "right" },
        { label: __("Under", "itmar_block_collections"), value: "under" },
      ]}
      onChange={(changeOption) => {
        onChange(changeOption as ArrowDirection);
      }}
    />
  );
};
export default PseudoElm;
