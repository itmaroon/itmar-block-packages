'use strict';

var jsxRuntime = require('react/jsx-runtime');
var styledComponents = require('styled-components');
var server = require('react-dom/server');
var styleDataApply = require('./styleDataApply.js');

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
const injectedClasses = new Set();
const styleComponentApply = (StyleComp, blockSelector, options = {}) => {
    const blocks = document.querySelectorAll(blockSelector);
    blocks.forEach((el) => {
        const attrData = el.getAttribute("data-attributes");
        if (!attrData)
            return;
        try {
            const attributes = JSON.parse(attrData);
            //styleタグの生成
            const sheet = new styledComponents.ServerStyleSheet();
            let html = "";
            let styleTags = "";
            try {
                html = server.renderToString(sheet.collectStyles(jsxRuntime.jsx(StyleComp, { attributes: attributes })));
                styleTags = sheet.getStyleTags();
            }
            finally {
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
                const target = options.getTarget?.(el) ||
                    styleDataApply.resolveTarget(el, options.selector ?? ".itmar-wrap", options.target ?? "auto");
                if (!target)
                    return;
                const classNames = className.trim().split(/\s+/).filter(Boolean);
                target.classList.add(...classNames);
            }
        }
        catch (e) {
            console.error("Style injection failed:", e);
        }
    });
};

exports.cssValueToString = styleDataApply.cssValueToString;
exports.resolveTarget = styleDataApply.resolveTarget;
exports.styleDataApply = styleDataApply.styleDataApply;
exports.styleComponentApply = styleComponentApply;
//# sourceMappingURL=styleComponentApply.js.map
