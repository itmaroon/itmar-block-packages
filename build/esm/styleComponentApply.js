import { jsx } from 'react/jsx-runtime';
import { ServerStyleSheet } from 'styled-components';
import { renderToString } from 'react-dom/server';

// 注入済みのクラス名を記憶する（関数の外で定義することで、呼び出し間で共有される）
const injectedClasses = new Set();
const resolveTarget = (el, selector = ".itmar-wrap", mode = "auto") => {
    if (mode === "self") {
        return el;
    }
    if (mode === "outer") {
        const parent = el.parentElement;
        return parent?.matches(selector) ? parent : null;
    }
    if (mode === "inner") {
        return el.querySelector(selector);
    }
    // auto: 外側は直親だけ、内側は直近の子孫
    const parent = el.parentElement;
    if (parent?.matches(selector)) {
        return parent;
    }
    return el.querySelector(selector) || el;
};
const styleComponentApply = (StyleComp, blockSelector, options = {}) => {
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
            if (className) {
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
                const target = options.getTarget?.(el) ||
                    resolveTarget(el, options.selector ?? ".itmar-wrap", options.target ?? "auto");
                if (blockSelector === ".wp-block-itmar-input-figure-block") {
                    console.log(target);
                }
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

export { styleComponentApply };
//# sourceMappingURL=styleComponentApply.js.map
