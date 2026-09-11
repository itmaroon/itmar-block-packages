import { ServerStyleSheet } from "styled-components";
import { renderToString } from "react-dom/server";

import { resolveTarget } from "./styleDataApply";
import type { StyleComponentApplyOptions } from "./styleDataApply";

/**
 * styled-components が生成したスタイルをフロントエンドへ送る旧実装。
 *
 * 【非推奨】styled-components のバージョン差でブロック検証エラーを招いたため、
 * `styleDataApply()` へ移行済み。現在どのブロックからも参照されていないが、
 * 外部利用の可能性を考えて残している。
 *
 * このファイルは styled-components と react-dom/server に依存するので、
 * **ビュースクリプトから読み込まないこと。** フロントエンドで属性からCSSを
 * 適用したい場合は `itmar-block-packages/front` の `styleDataApply()` を使う。
 */

// 注入済みのクラス名を記憶する（関数の外で定義することで、呼び出し間で共有される）
const injectedClasses = new Set<string>();

export const styleComponentApply = <T,>(
  StyleComp: React.ComponentType<{ attributes: T; children?: React.ReactNode }>,
  blockSelector: string,
  options: StyleComponentApplyOptions = {},
) => {
  const blocks = document.querySelectorAll(blockSelector);

  blocks.forEach((el) => {
    const attrData = el.getAttribute("data-attributes");
    if (!attrData) return;

    try {
      const attributes = JSON.parse(attrData) as T;

      //styleタグの生成
      const sheet = new ServerStyleSheet();
      let html = "";
      let styleTags = "";

      try {
        html = renderToString(
          sheet.collectStyles(<StyleComp attributes={attributes} />),
        );
        styleTags = sheet.getStyleTags();
      } finally {
        sheet.seal();
      }

      // 正規表現でクラス名を抽出
      const classMatch = html.match(/class="([^"]+)"/);
      const className = classMatch ? classMatch[1] : "";

      if (className) {
        // このクラス名がまだ注入されていなければ実行
        if (!injectedClasses.has(className)) {
          const styleContainer = document.createElement("div");
          styleContainer.innerHTML = styleTags;

          const styleElement = styleContainer.firstChild;
          if (styleElement instanceof Node) {
            document.head.appendChild(styleElement);
            injectedClasses.add(className);
          }
        }

        // クラス名を適用する対象を探す
        const target =
          options.getTarget?.(el) ||
          resolveTarget(
            el,
            options.selector ?? ".itmar-wrap",
            options.target ?? "auto",
          );

        if (!target) return;

        const classNames = className.trim().split(/\s+/).filter(Boolean);
        target.classList.add(...classNames);
      }
    } catch (e) {
      console.error("Style injection failed:", e);
    }
  });
};

/**
 * 後方互換のための再エクスポート。
 * 新しく書くコードは `itmar-block-packages/front` から読み込むこと。
 */
export { styleDataApply, cssValueToString, resolveTarget } from "./styleDataApply";
export type {
  TargetMode,
  StyleComponentApplyOptions,
  StyleDataApplyOptions,
  StyleDataApplyController,
} from "./styleDataApply";
