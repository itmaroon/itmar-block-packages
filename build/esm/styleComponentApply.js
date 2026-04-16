import { jsx } from 'react/jsx-runtime';
import { ServerStyleSheet } from 'styled-components';
import { renderToString } from 'react-dom/server';

const styleComponentApply = (StyleComp, blockSelector) => {
    const blocks = document.querySelectorAll(blockSelector);
    blocks.forEach((el) => {
        const attrData = el.getAttribute("data-attributes");
        if (!attrData)
            return;
        try {
            const attributes = JSON.parse(attrData);
            //styleタグの生成
            const sheet = new ServerStyleSheet();
            const html = renderToString(sheet.collectStyles(jsx(StyleComp, { attributes: attributes })));
            const styleTags = sheet.getStyleTags();
            // 正規表現でクラス名を抽出
            const classMatch = html.match(/class="([^"]+)"/);
            const className = classMatch ? classMatch[1] : "";
            // ----------------------------------
            // 1. スタイルタグを <head> または要素の直前に注入
            const styleContainer = document.createElement("div");
            styleContainer.innerHTML = styleTags;
            document.head.appendChild(styleContainer.firstChild);
            // 2. クラス名を適用する対象を探す
            // save.tsx で <div className="itmar-wrap"> のように目印をつけておくと確実です
            const target = el.querySelector(".itmar-wrap") || el;
            if (className) {
                target.classList.add(...className.split(" "));
            }
        }
        catch (e) {
            console.error("Style injection failed:", e);
        }
    });
};

export { styleComponentApply };
//# sourceMappingURL=styleComponentApply.js.map
