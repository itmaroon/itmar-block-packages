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
export const resolveTarget = (
  el: Element,
  selector: string = ".itmar-wrap",
  mode: TargetMode = "auto",
): Element | null => {
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

/** キー順に依存しない安定したシリアライズ。同一設定を同一ハッシュにするため。 */
const stableSerialize = (value: unknown): string => {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value) ?? "null";
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableSerialize).join(",")}]`;
  }

  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();

  return `{${keys
    .map((key) => `${JSON.stringify(key)}:${stableSerialize(record[key])}`)
    .join(",")}}`;
};

/** FNV-1a。衝突耐性より短さと速さを優先する用途。 */
const hashString = (value: string): string => {
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
export const styleDataApply = <T,>(
  createCss: (attributes: T, scopeSelector: string) => string,
  blockSelector: string,
  options: StyleDataApplyOptions<T> = {},
): StyleDataApplyController => {
  const processedElements = new WeakSet<Element>();
  const attributeName = options.attributeName ?? "data-attributes";
  const classPrefix = options.classPrefix ?? "itmar-style-";

  const applyToElement = (el: Element) => {
    if (processedElements.has(el)) return;

    const attrData = el.getAttribute(attributeName);
    if (!attrData) return;

    try {
      const attributes = JSON.parse(attrData) as T;
      const styleKey = hashString(
        `${blockSelector}:${classPrefix}:${stableSerialize(attributes)}`,
      );
      const scopeClass = `${classPrefix}${styleKey}`;
      const scopeSelector = `.${scopeClass}`;
      const cssText = createCss(attributes, scopeSelector).trim();

      const target =
        options.getTarget?.(el) ??
        resolveTarget(
          el,
          options.selector ?? ".itmar-wrap",
          options.target ?? "auto",
        );

      if (!target) return;

      target.classList.add(scopeClass);
      options.decorateTarget?.(target, attributes);

      const existingStyle = document.head.querySelector(
        `style[data-itmar-style="${styleKey}"]`,
      );

      if (cssText && !existingStyle) {
        const styleElement = document.createElement("style");
        styleElement.dataset.itmarStyle = styleKey;
        styleElement.textContent = cssText;
        document.head.appendChild(styleElement);
      }

      processedElements.add(el);
    } catch (error) {
      console.error("Style data injection failed:", error, el);
    }
  };

  const refresh = (root: ParentNode = document) => {
    if (root instanceof Element && root.matches(blockSelector)) {
      applyToElement(root);
    }

    root.querySelectorAll(blockSelector).forEach(applyToElement);
  };

  const observer =
    options.observe === false
      ? null
      : new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
              if (node instanceof Element) refresh(node);
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

/** 純粋CSS生成関数。オブジェクト・配列・スカラーをCSS文字列へ畳み込む。 */
export const cssValueToString = (value: unknown): string => {
  if (value == null || value === false) return "";

  if (Array.isArray(value)) {
    return value.map(cssValueToString).join("");
  }

  if (typeof value === "object") {
    return Object.entries(value)
      .filter(([, cssValue]) => cssValue != null)
      .map(([property, cssValue]) => {
        const cssProperty = property.replace(
          /[A-Z]/g,
          (char) => `-${char.toLowerCase()}`,
        );
        return `${cssProperty}:${cssValue};`;
      })
      .join("");
  }

  return String(value);
};
