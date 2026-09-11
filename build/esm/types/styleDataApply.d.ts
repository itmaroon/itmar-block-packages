/**
 * 保存済み属性からスコープ付きCSSを生成し、フロントエンドへ適用する。
 *
 * 【重要】このモジュールは React / styled-components / @wordpress パッケージに
 * 一切依存しない。ビュースクリプト（view.js）から読み込まれるため、ここに依存を
 * 足すと wp-scripts が view.asset.php にその依存を書き出し、エディタ用パッケージ
 * 一式が訪問者のブラウザへ配信されてしまう。依存を追加しないこと。
 */
export type TargetMode = "self" | "outer" | "inner" | "auto";
export type StyleComponentApplyOptions = {
    selector?: string;
    target?: TargetMode;
    getTarget?: (el: Element) => Element | null;
};
export type StyleDataApplyOptions<T> = StyleComponentApplyOptions & {
    attributeName?: string;
    classPrefix?: string;
    observe?: boolean;
    decorateTarget?: (target: Element, attributes: T) => void;
};
export type StyleDataApplyController = {
    refresh: (root?: ParentNode) => void;
    disconnect: () => void;
};
/**
 * スタイルを適用する要素を決める。
 *
 * ブロックによってスタイルの起点が異なるため、ブロック要素そのもの・直親・
 * 子孫のいずれかを選べるようにしている。既定の起点は `.itmar-wrap`。
 */
export declare const resolveTarget: (el: Element, selector?: string, mode?: TargetMode) => Element | null;
/**
 * React/styled-componentsを使わず、保存済み属性からスコープ付きCSSを適用する。
 * 戻り値のrefreshはAjax等で追加されたブロックにも再適用できる。
 */
export declare const styleDataApply: <T>(createCss: (attributes: T, scopeSelector: string) => string, blockSelector: string, options?: StyleDataApplyOptions<T>) => StyleDataApplyController;
/** 純粋CSS生成関数。オブジェクト・配列・スカラーをCSS文字列へ畳み込む。 */
export declare const cssValueToString: (value: unknown) => string;
