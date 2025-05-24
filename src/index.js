//カスタムフック（一般）
export {
  useIsIframeMobile,
  useElementBackgroundColor,
  useElementStyleObject,
  useElementWidth,
  useIsMobile,
  useDeepCompareEffect,
  useFontawesomeIframe,
  useBlockAttributeChanges,
  useDuplicateBlockRemove,
} from "./customFooks";

//WordPressデータを取得するためのRestAPI
export {
  fetchPagesOptions,
  fetchArchiveOptions,
  restFetchData,
  restTaxonomies,
  restFieldes,
  termToDispObj,
  PageSelectControl,
  ArchiveSelectControl,
  TermChoiceControl,
  FieldChoiceControl,
} from "./wordpressApi";

//styled-componet用のcssプロパティ生成関数
export {
  space_prm,
  max_width_prm,
  width_prm,
  height_prm,
  align_prm,
  position_prm,
  radius_prm,
  convertToScss,
  borderProperty,
  radiusProperty,
  marginProperty,
  paddingProperty,
} from "./cssPropertes";

//ボックスシャドーを設定するコントロール
export { default as ShadowStyle, ShadowElm } from "./ShadowStyle";

//疑似要素を設定するコントロール
export { default as PseudoElm, Arrow } from "./PseudoElm";

//メディアライブラリから複数の画像を選択するコントロール
export { SingleImageSelect, MultiImageSelect } from "./mediaUpload";

//ブロックのドラッガブルを設定するコントロール
export { default as DraggableBox, useDraggingMove } from "./DraggableBox";

//アニメーションを設定するコントロール
export { default as AnimationBlock, anime_comp } from "./AnimationBlock";

//ブロックの配置を設定するコントロール
export { default as BlockPlace, BlockWidth, BlockHeight } from "./BlockPlace";
export { default as GridControls } from "./GridControls";

//DOM要素の表示を反転させるコントロール
export { default as ToggleElement } from "./ToggleElement";

//タイポグラフィーの設定をするコントロール
export { default as TypographyControls } from "./TypographyControls";

//アイコンの表示を設定するコントロール
export { default as IconSelectControl } from "./IconSelectControl";

//ブロックをlazy Loadさせるためのラッパーモジュール
export { default as BlockEditWrapper } from "./BlockEditWrapper";

//色コードの変換関数
export { hslToRgb16, rgb16ToHsl, HexToRGB } from "./hslToRgb";

//日付関連の関数、コントロール
export {
  generateDateArray,
  generateMonthCalendar,
  PeriodCtrl,
  getPeriodQuery,
  getTodayYearMonth,
  getTodayYear,
  getTodayMonth,
  generateGridAreas,
  JapaneseHolidays,
} from "./DateElm";

//インナーブロック関連の関数
export { flattenBlocks, useTargetBlocks } from "./blockStore";

//特定の投稿タイプの投稿に含まれる本ブロックの属性を書き換える
export { default as UpdateAllPostsBlockAttributes } from "./UpdateAllPostsBlockAttributes";
