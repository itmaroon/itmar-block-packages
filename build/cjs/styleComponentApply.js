'use strict';

var jsxRuntime = require('react/jsx-runtime');
var styledComponents = require('styled-components');
var server = require('react-dom/server');

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
const stableSerialize = (value) => {
    if (value === null || typeof value !== "object") {
        return JSON.stringify(value) ?? "null";
    }
    if (Array.isArray(value)) {
        return `[${value.map(stableSerialize).join(",")}]`;
    }
    const record = value;
    const keys = Object.keys(record).sort();
    return `{${keys
        .map((key) => `${JSON.stringify(key)}:${stableSerialize(record[key])}`)
        .join(",")}}`;
};
const hashString = (value) => {
    let hash = 0x811c9dc5;
    for (let index = 0; index < value.length; index += 1) {
        hash ^= value.charCodeAt(index);
        hash = Math.imul(hash, 0x01000193);
    }
    return (hash >>> 0).toString(36);
};
/**
 * React/styled-componentsを使わず、保存済み属性からスコープ付きCSSを適用する。
 * 戻り値のrefreshはAjax等で追加されたブロックにも再適用できる。
 */
const styleDataApply = (createCss, blockSelector, options = {}) => {
    const processedElements = new WeakSet();
    const attributeName = options.attributeName ?? "data-attributes";
    const classPrefix = options.classPrefix ?? "itmar-style-";
    const applyToElement = (el) => {
        if (processedElements.has(el))
            return;
        const attrData = el.getAttribute(attributeName);
        if (!attrData)
            return;
        try {
            const attributes = JSON.parse(attrData);
            const styleKey = hashString(`${blockSelector}:${classPrefix}:${stableSerialize(attributes)}`);
            const scopeClass = `${classPrefix}${styleKey}`;
            const scopeSelector = `.${scopeClass}`;
            const cssText = createCss(attributes, scopeSelector).trim();
            const target = options.getTarget?.(el) ??
                resolveTarget(el, options.selector ?? ".itmar-wrap", options.target ?? "auto");
            if (!target)
                return;
            target.classList.add(scopeClass);
            options.decorateTarget?.(target, attributes);
            const existingStyle = document.head.querySelector(`style[data-itmar-style="${styleKey}"]`);
            if (cssText && !existingStyle) {
                const styleElement = document.createElement("style");
                styleElement.dataset.itmarStyle = styleKey;
                styleElement.textContent = cssText;
                document.head.appendChild(styleElement);
            }
            processedElements.add(el);
        }
        catch (error) {
            console.error("Style data injection failed:", error, el);
        }
    };
    const refresh = (root = document) => {
        if (root instanceof Element && root.matches(blockSelector)) {
            applyToElement(root);
        }
        root.querySelectorAll(blockSelector).forEach(applyToElement);
    };
    const observer = options.observe === false
        ? null
        : new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node instanceof Element)
                        refresh(node);
                });
            });
        });
    refresh();
    observer?.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });
    return {
        refresh,
        disconnect: () => observer?.disconnect(),
    };
};
//純粋CSS生成関数
const cssValueToString = (value) => {
    if (value == null || value === false)
        return "";
    if (Array.isArray(value)) {
        return value.map(cssValueToString).join("");
    }
    if (typeof value === "object") {
        return Object.entries(value)
            .filter(([, cssValue]) => cssValue != null)
            .map(([property, cssValue]) => {
            const cssProperty = property.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
            return `${cssProperty}:${cssValue};`;
        })
            .join("");
    }
    return String(value);
};

exports.cssValueToString = cssValueToString;
exports.styleComponentApply = styleComponentApply;
exports.styleDataApply = styleDataApply;
//# sourceMappingURL=styleComponentApply.js.map
