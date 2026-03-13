import { CSSProperties } from "react";
interface RadiusObject {
    value?: string;
    topLeft?: string;
    topRight?: string;
    bottomLeft?: string;
    bottomRight?: string;
}
export declare const radius_prm: (radius: RadiusObject | undefined) => string;
interface SpaceObject {
    top?: string | number;
    right?: string | number;
    bottom?: string | number;
    left?: string | number;
}
export declare const space_prm: (space: SpaceObject | undefined) => string;
interface PositionObject {
    vertBase: "top" | "bottom";
    horBase: "left" | "right";
    vertValue: string;
    horValue: string;
    isVertCenter?: boolean;
    isHorCenter?: boolean;
}
type PositionType = "absolute" | "fixed" | "sticky" | "relative" | string;
export declare const position_prm: (pos: PositionObject | any, type: PositionType) => string | null;
type WidthType = "wideSize" | "contentSize" | "free" | "full" | "fit" | string;
type HeightType = "fit" | "full" | "free" | string;
type AlignType = "center" | "right" | "left" | string;
export declare const max_width_prm: (width: WidthType, free_val?: string) => string;
export declare const width_prm: (width: WidthType, free_val?: string) => string;
export declare const height_prm: (height: HeightType, free_val?: string) => string;
export declare const align_prm: (align: AlignType, camelFLg?: boolean) => string | CSSProperties;
export declare const convertToScss: (styleObject: Record<string, string | number>) => string;
/**
 * ボーダー設定オブジェクトをCSSプロパティオブジェクトに変換する
 */
export declare const borderProperty: (borderObj: any) => Record<string, string> | null;
interface BoxSpacing {
    top?: string | number;
    right?: string | number;
    bottom?: string | number;
    left?: string | number;
    value?: string | number;
    topLeft?: string | number;
    topRight?: string | number;
    bottomLeft?: string | number;
    bottomRight?: string | number;
}
export declare const radiusProperty: (radiusObj: BoxSpacing | undefined) => CSSProperties;
export declare const marginProperty: (marginObj: BoxSpacing | undefined) => CSSProperties;
export declare const paddingProperty: (paddingObj: BoxSpacing | undefined) => CSSProperties;
export {};
