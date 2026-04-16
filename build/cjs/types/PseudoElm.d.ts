type ArrowDirection = "upper" | "left" | "right" | "under" | "down";
interface PseudoElmProps {
    direction: ArrowDirection;
    onChange: (value: ArrowDirection) => void;
}
interface ArrowProps {
    direction?: ArrowDirection;
}
export declare const Arrow: ({ direction }: ArrowProps) => import("styled-components").RuleSet<object>;
declare const PseudoElm: ({ direction, onChange }: PseudoElmProps) => import("react/jsx-runtime").JSX.Element;
export default PseudoElm;
