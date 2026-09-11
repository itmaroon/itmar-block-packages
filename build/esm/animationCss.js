/**
 * アニメーション用のCSS生成。
 *
 * 【重要】このモジュールは styled-components に依存しない。以前は
 * `css` タグ付きテンプレートを返していたが、ビュースクリプトから
 * 参照されるため styled-components をフロントエンドへ持ち込んでいた。
 * 返り値は素の文字列で、`cssValueToString()` を通しても同じ結果になる。
 */
const anime_comp = (attributes) => {
    return `
    &.fadeTrigger {
      opacity: 0;
    }
    &.${attributes.pattern} {
      animation-name: ${attributes.pattern};
      animation-delay: ${attributes.delay}s;
      animation-duration: ${attributes.duration}s;
      animation-fill-mode: forwards;
      opacity: 0;
    }
  `;
};

export { anime_comp };
//# sourceMappingURL=animationCss.js.map
