/**
 * アニメーション用のCSS生成。
 *
 * 【重要】このモジュールは styled-components に依存しない。以前は
 * `css` タグ付きテンプレートを返していたが、ビュースクリプトから
 * 参照されるため styled-components をフロントエンドへ持ち込んでいた。
 * 返り値は素の文字列で、`cssValueToString()` を通しても同じ結果になる。
 */
export interface AnimeAttributes {
    pattern?: string;
    delay?: number | string;
    duration?: number | string;
    [key: string]: any;
}
export declare const anime_comp: (attributes: AnimeAttributes) => string;
