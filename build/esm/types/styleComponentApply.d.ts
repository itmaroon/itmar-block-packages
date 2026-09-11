import type { StyleComponentApplyOptions } from "./styleDataApply";
export declare const styleComponentApply: <T>(StyleComp: React.ComponentType<{
    attributes: T;
    children?: React.ReactNode;
}>, blockSelector: string, options?: StyleComponentApplyOptions) => void;
/**
 * 後方互換のための再エクスポート。
 * 新しく書くコードは `itmar-block-packages/front` から読み込むこと。
 */
export { styleDataApply, cssValueToString, resolveTarget } from "./styleDataApply";
export type { TargetMode, StyleComponentApplyOptions, StyleDataApplyOptions, StyleDataApplyController, } from "./styleDataApply";
