'use strict';

var jsxRuntime = require('react/jsx-runtime');
var styledComponents = require('styled-components');
var server = require('react-dom/server');

// 注入済みのクラス名を記憶する（関数の外で定義することで、呼び出し間で共有される）
const injectedClasses = new Set();
const styleComponentApply = (StyleComp, blockSelector) => {
    const blocks = document.querySelectorAll(blockSelector);
    blocks.forEach((el) => {
        const attrData = el.getAttribute("data-attributes");
        if (!attrData)
            return;
        try {
            const attributes = JSON.parse(attrData);
            //styleタグの生成
            const sheet = new styledComponents.ServerStyleSheet();
            const html = server.renderToString(sheet.collectStyles(jsxRuntime.jsx(StyleComp, { attributes: attributes })));
            const styleTags = sheet.getStyleTags();
            // 正規表現でクラス名を抽出
            const classMatch = html.match(/class="([^"]+)"/);
            const className = classMatch ? classMatch[1] : "";
            // ----------------------------------
            if (className) {
                console.log(`${className} : ${injectedClasses.has(className)}`);
                // 3. 【重要】このクラス名がまだ注入されていなければ実行
                if (!injectedClasses.has(className)) {
                    // 1. スタイルタグを <head> または要素の直前に注入
                    const styleContainer = document.createElement("div");
                    styleContainer.innerHTML = styleTags;
                    const styleElement = styleContainer.firstChild;
                    if (styleElement instanceof Node) {
                        document.head.appendChild(styleElement);
                        // 注入済みとして記録
                        injectedClasses.add(className);
                    }
                }
                // 2. クラス名を適用する対象を探す
                // save.tsx で <div className="itmar-wrap"> のように目印をつけておくと確実です
                const target = el.querySelector(".itmar-wrap") || el;
                target.classList.add(...className.split(" "));
            }
        }
        catch (e) {
            console.error("Style injection failed:", e);
        }
    });
};

exports.styleComponentApply = styleComponentApply;
//# sourceMappingURL=styleComponentApply.js.map
