interface AnimeAttributes {
    pattern?: string;
    delay?: number | string;
    duration?: number | string;
    [key: string]: any;
}
export declare const anime_comp: (attributes: AnimeAttributes) => import("styled-components").RuleSet<object>;
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
export {};
