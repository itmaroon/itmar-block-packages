/**
 * アニメーションCSSの生成は styled-components 非依存の ./animationCss へ移した。
 * ビュースクリプトが `anime_comp` を参照する際に、このファイル（@wordpress/components
 * 依存）を引き込まないようにするため。後方互換のためここから再エクスポートする。
 */
export { anime_comp } from "./animationCss";
export type { AnimeAttributes } from "./animationCss";
interface AnimePrm {
    pattern: string;
    duration: number;
    delay: number;
    trigger: string;
}
interface AnimationBlockProps {
    attributes: {
        is_anime: boolean;
        anime_prm: AnimePrm;
    };
    onChange: (newAttributes: Partial<AnimationBlockProps["attributes"]>) => void;
}
export default function AnimationBlock(props: AnimationBlockProps): import("react/jsx-runtime").JSX.Element;
