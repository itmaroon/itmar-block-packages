import { ShadowElm } from "./shadowCss";
import type { ShadowState, ShadowResult, CornerDirection, ShadowErrorReason } from "./shadowCss";
/**
 * 影のスタイル算出は @wordpress 非依存の ./shadowCss へ移した。
 * ビュースクリプトが `ShadowElm` を参照する際に、このファイル
 * （@wordpress/block-editor 依存）を引き込まないようにするため。
 * 後方互換のためここから再エクスポートする。
 */
export { ShadowElm };
export type { ShadowState, ShadowResult, CornerDirection, ShadowErrorReason };
interface ShadowStyleProps {
    shadowStyle: ShadowState;
    onChange: (elm: ShadowResult, state: ShadowState) => void;
}
declare const ShadowStyle: ({ shadowStyle, onChange }: ShadowStyleProps) => import("react/jsx-runtime").JSX.Element;
export default ShadowStyle;
