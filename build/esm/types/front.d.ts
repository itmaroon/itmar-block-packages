/**
 * フロントエンド（ビュースクリプト）専用のエントリポイント。
 *
 * ## なぜ分けるのか
 *
 * メインの `index.ts` はエディタ用コンポーネント（ShadowStyle・GridControls・
 * TypographyControls など）を再エクスポートしている。それらは
 * `@wordpress/block-editor` `@wordpress/components` `@wordpress/data`
 * `@wordpress/element` `styled-components` に依存するため、ビュースクリプトが
 * `itmar-block-packages` から1つでも import すると、wp-scripts がそれらを
 * `view.asset.php` の依存として書き出し、**訪問者のブラウザにブロックエディタ
 * 一式が配信される**。
 *
 * このエントリは、値として解決される外部依存を持たないモジュールだけを
 * 再エクスポートする。`view.ts` と、そこから読まれる `Style*.tsx` は
 * こちらから import すること。
 *
 *     import { styleDataApply } from "itmar-block-packages/front";
 *
 * ## 追加するときの決まり
 *
 * ここに足すモジュールは、`@wordpress/*` `react` `react-dom` `styled-components`
 * を **値として** import していないこと。型だけの参照（`import type`）は
 * ビルド時に消えるので問題ない。判断に迷ったら、対象ファイルの import 文を
 * 確認してから追加する。
 */
export { styleDataApply, cssValueToString, resolveTarget, } from "./styleDataApply";
export type { TargetMode, StyleComponentApplyOptions, StyleDataApplyOptions, StyleDataApplyController, } from "./styleDataApply";
export { radius_prm, space_prm, position_prm, max_width_prm, width_prm, height_prm, align_prm, convertToScss, borderProperty, radiusProperty, marginProperty, paddingProperty, } from "./cssPropertes";
export { anime_comp } from "./animationCss";
export type { AnimeAttributes } from "./animationCss";
export { Arrow, arrowDirectionStyles } from "./pseudoCss";
export type { ArrowDirection, ArrowProps } from "./pseudoCss";
export { ShadowElm } from "./shadowCss";
export type { ShadowState, ShadowResult, CornerDirection, ShadowErrorReason, } from "./shadowCss";
export { hslToRgb16, rgb16ToHsl, HexToRGB } from "./hslToRgb";
export { generateGridAreas } from "./gridAreas";
export { isValidUrlWithUrlApi } from "./validationCheck";
export { default as MasonryControl } from "./MasonryControl";
export { slideBlockSwiperInit } from "./SwiperControl";
export { fetchZipToAddress } from "./ZipAddress";
export { checkCustomerLoginState, redirectCustomerAuthorize, sendRegistrationRequest, } from "./shopfiApi";
export { ensureCtx, registerPickup, getCtx, subscribe, setState, } from "./pickupStore";
