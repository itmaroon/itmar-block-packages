type CornerDirection = "top_left" | "top_right" | "bottom_left" | "bottom_right" | "right_bottom" | "top";
interface ShadowState {
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
interface ShadowResult {
    style: React.CSSProperties;
}
export declare const ShadowElm: (shadowState: ShadowState) => ShadowResult | null;
interface ShadowStyleProps {
    shadowStyle: ShadowState;
    onChange: (elm: ShadowResult, state: ShadowState) => void;
}
declare const ShadowStyle: ({ shadowStyle, onChange }: ShadowStyleProps) => JSX.Element;
export default ShadowStyle;
