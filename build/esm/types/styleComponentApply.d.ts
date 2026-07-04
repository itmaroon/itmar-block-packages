type TargetMode = "self" | "outer" | "inner" | "auto";
type StyleComponentApplyOptions = {
    selector?: string;
    target?: TargetMode;
    getTarget?: (el: Element) => Element | null;
};
type StyleDataApplyOptions<T> = StyleComponentApplyOptions & {
    attributeName?: string;
    classPrefix?: string;
    observe?: boolean;
    decorateTarget?: (target: Element, attributes: T) => void;
};
type StyleDataApplyController = {
    refresh: (root?: ParentNode) => void;
    disconnect: () => void;
};
export declare const styleComponentApply: <T>(StyleComp: React.ComponentType<{
    attributes: T;
    children?: React.ReactNode;
}>, blockSelector: string, options?: StyleComponentApplyOptions) => void;
/**
 * React/styled-componentsを使わず、保存済み属性からスコープ付きCSSを適用する。
 * 戻り値のrefreshはAjax等で追加されたブロックにも再適用できる。
 */
export declare const styleDataApply: <T>(createCss: (attributes: T, scopeSelector: string) => string, blockSelector: string, options?: StyleDataApplyOptions<T>) => StyleDataApplyController;
export declare const cssValueToString: (value: unknown) => string;
export {};
