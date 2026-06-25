type TargetMode = "self" | "outer" | "inner" | "auto";
type StyleComponentApplyOptions = {
    selector?: string;
    target?: TargetMode;
    getTarget?: (el: Element) => Element | null;
};
export declare const styleComponentApply: <T>(StyleComp: React.ComponentType<{
    attributes: T;
    children?: React.ReactNode;
}>, blockSelector: string, options?: StyleComponentApplyOptions) => void;
export {};
