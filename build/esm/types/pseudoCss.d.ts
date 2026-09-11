/**
 * 擬似要素（矢印）のCSS生成。
 *
 * 【重要】このモジュールは styled-components / @wordpress パッケージに依存しない。
 * ビュースクリプトから参照されるため、依存を足すとエディタ用パッケージが
 * フロントエンドへ配信される。以前は PseudoElm.tsx（インスペクターUI）に同居して
 * いたため、矢印1つのためにUI一式を引き込んでいた。
 *
 * 返り値は素の文字列。`cssValueToString()` を通しても styled-components の
 * `css` タグ付きテンプレートと同じ結果になる。
 */
export type ArrowDirection = "upper" | "left" | "right" | "under" | "down";
export interface ArrowProps {
    direction?: ArrowDirection;
}
/** 矢印の向きに応じたスタイルを生成するヘルパー関数 */
export declare const arrowDirectionStyles: (direction: ArrowDirection) => string;
/** 矢印のスタイルを生成する */
export declare const Arrow: ({ direction }?: ArrowProps) => string;
