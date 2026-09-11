/**
 * 影（ノーマル / ニューモフィズム / クレイモーフィズム / グラスモーフィズム）の
 * スタイル算出。
 *
 * 【重要】このモジュールは @wordpress パッケージに依存しない。ビュースクリプトから
 * 参照されるため、依存を足すとエディタ用パッケージがフロントエンドへ配信される。
 *
 * 以前は ShadowStyle.tsx（インスペクターUI）に同居し、エラー時に
 * `dispatch("core/notices")` を直接呼んでいた。CSSの算出と編集画面への通知は
 * 関心が別なので、通知は `onError` コールバックへ委ねている。エディタ側は
 * ハンドラを渡し、フロントエンド側は渡さない。
 */
import type { CSSProperties } from "react";
export type CornerDirection = "top_left" | "top_right" | "bottom_left" | "bottom_right" | "right_bottom" | "top";
/** 影を算出できなかった理由。エディタ側で文言を組み立てるために使う。 */
export type ShadowErrorReason = "gradient-newmor" | "gradient-claymor" | "color-parse";
export interface ShadowState {
    shadowType: "nomal" | "newmor" | "claymor" | "glassmor";
    spread: number;
    lateral: number;
    longitude: number;
    nomalBlur: number;
    shadowColor: string;
    blur: number;
    intensity: number;
    distance: number;
    newDirection: CornerDirection;
    clayDirection: CornerDirection;
    embos: "swell" | "dent";
    opacity: number;
    depth: number;
    bdBlur: number;
    expand: number;
    glassblur: number;
    glassopa: number;
    hasOutline: boolean;
    baseColor: string;
}
export interface ShadowResult {
    style: CSSProperties;
}
/**
 * 影のスタイルを算出する。算出できない場合は null。
 *
 * @param shadowState 影の設定
 * @param onError     算出できなかった理由の通知先（エディタ側のみ渡す）
 */
export declare const ShadowElm: (shadowState: ShadowState, onError?: (reason: ShadowErrorReason) => void) => ShadowResult | null;
