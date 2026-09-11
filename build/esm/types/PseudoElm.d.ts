import type { ArrowDirection } from "./pseudoCss";
/**
 * 矢印のCSS生成は styled-components 非依存の ./pseudoCss へ移した。
 * ビュースクリプトが `Arrow` を参照する際に、このファイル（@wordpress/components
 * 依存）を引き込まないようにするため。後方互換のためここから再エクスポートする。
 */
export { Arrow, arrowDirectionStyles } from "./pseudoCss";
export type { ArrowDirection, ArrowProps } from "./pseudoCss";
interface PseudoElmProps {
    direction: ArrowDirection;
    onChange: (value: ArrowDirection) => void;
}
declare const PseudoElm: ({ direction, onChange }: PseudoElmProps) => import("react/jsx-runtime").JSX.Element;
export default PseudoElm;
