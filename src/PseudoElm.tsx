import { createElement, Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { css } from "styled-components";
import { RadioControl } from "@wordpress/components";

// 1. 許可される方向を型として定義
type ArrowDirection = "upper" | "left" | "right" | "under" | "down";

// 2. Props の型定義
interface PseudoElmProps {
  direction: ArrowDirection;
  onChange: (value: ArrowDirection) => void;
}

// 矢印の向きに応じたスタイルを生成するヘルパー関数
const arrowDirectionStyles = (direction: ArrowDirection) => {
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

// 矢印のスタイルを適用するコンポーネント
interface ArrowProps {
  direction?: ArrowDirection;
}
export const Arrow = ({ direction = "down" }: ArrowProps) => css`
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
