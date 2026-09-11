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

//保存済み属性からスコープ付きCSSを適用する（ビュー側の中核）
export {
  styleDataApply,
  cssValueToString,
  resolveTarget,
} from "./styleDataApply";
export type {
  TargetMode,
  StyleComponentApplyOptions,
  StyleDataApplyOptions,
  StyleDataApplyController,
} from "./styleDataApply";

//CSS生成ヘルパ
export {
  radius_prm,
  space_prm,
  position_prm,
  max_width_prm,
  width_prm,
  height_prm,
  align_prm,
  convertToScss,
  borderProperty,
  radiusProperty,
  marginProperty,
  paddingProperty,
} from "./cssPropertes";

//アニメーション
export { anime_comp } from "./animationCss";
export type { AnimeAttributes } from "./animationCss";

//擬似要素（矢印）
export { Arrow, arrowDirectionStyles } from "./pseudoCss";
export type { ArrowDirection, ArrowProps } from "./pseudoCss";

//影
export { ShadowElm } from "./shadowCss";
export type {
  ShadowState,
  ShadowResult,
  CornerDirection,
  ShadowErrorReason,
} from "./shadowCss";

//色変換
export { hslToRgb16, rgb16ToHsl, HexToRGB } from "./hslToRgb";

//カレンダーの grid-template-areas
export { generateGridAreas } from "./gridAreas";

// 注: JapaneseHolidays はここに置かない。`getPeriodQuery` を DateElm.tsx から
// 取り込んでおり、DateElm.tsx は @wordpress/components と nanoid に依存するため、
// フロントエンドへエディタ用のコントロールを引き込んでしまう。ビュー側で祝日判定が
// 必要になったら、先に DateElm.tsx から純粋部分を切り出すこと。

//バリデーション
export { isValidUrlWithUrlApi } from "./validationCheck";

//Masonry グリッドの初期化
export { default as MasonryControl } from "./MasonryControl";

//Swiper の初期化
export { slideBlockSwiperInit } from "./SwiperControl";

//住所変換
export { fetchZipToAddress } from "./ZipAddress";

//Shopify API
export {
  checkCustomerLoginState,
  redirectCustomerAuthorize,
  sendRegistrationRequest,
} from "./shopfiApi";

//フロントエンドのデータ共有
export {
  ensureCtx,
  registerPickup,
  getCtx,
  subscribe,
  setState,
} from "./pickupStore";
