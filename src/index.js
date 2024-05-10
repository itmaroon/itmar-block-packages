import "./editor.scss";
import "./style.scss";

//カスタムフック（一般）
export {
  useIsIframeMobile,
  useElementBackgroundColor,
  useElementWidth,
  useIsMobile,
  useDeepCompareEffect,
  useFontawesomeIframe,
} from "./customFooks";

//WordPressデータを取得するためのRestAPI
export {
  fetchPagesOptions,
  fetchArchiveOptions,
  restTaxonomies,
  //restFieldes,
  PageSelectControl,
  ArchiveSelectControl,
  TermChoiceControl,
  //FieldChoiceControl,
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
export { default as BlockPlace } from "./BlockPlace";
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
