'use strict';

// sideの最初の文字を大文字にする関数
const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
// objectかどうか判定する関数
const isObject = (value) => {
    return value !== null && typeof value === "object" && !Array.isArray(value);
};
const radius_prm = (radius) => {
    // radius が存在しない場合は空文字を返す
    if (!radius)
        return "";
    const ret_radius_prm = Object.keys(radius).length === 1 && radius.value
        ? radius.value
        : `${radius.topLeft || ""} ${radius.topRight || ""} ${radius.bottomRight || ""} ${radius.bottomLeft || ""}`;
    return ret_radius_prm.trim(); // 余計な空白を削除して返す
};
const space_prm = (space) => {
    // spaceが存在しない、または空の場合は空文字を返す
    if (!space)
        return "";
    // 各値が undefined の場合に備えてデフォルト値（"0" など）を置くのが安全です
    const { top = "0", right = "0", bottom = "0", left = "0" } = space;
    return `${top} ${right} ${bottom} ${left}`;
};
const position_prm = (pos, type) => {
    // 値がオブジェクト（詳細設定）の場合
    if (isObject(pos)) {
        const p = pos; // 型を確定させる
        const resetVertBase = p.vertBase === "top" ? "bottom" : "top";
        const resetHorBase = p.horBase === "left" ? "right" : "left";
        const centerVert = "50%";
        const centerHor = "50%";
        const centerTrans = p.isVertCenter && p.isHorCenter
            ? "transform: translate(-50%, -50%);"
            : p.isVertCenter
                ? "transform: translateY(-50%);"
                : p.isHorCenter
                    ? "transform: translateX(-50%);"
                    : "";
        const isValidType = type === "absolute" || type === "fixed" || type === "sticky";
        if (isValidType) {
            return `
        ${p.vertBase}: ${p.isVertCenter ? centerVert : p.vertValue}; 
        ${p.horBase}: ${p.isHorCenter ? centerHor : p.horValue};
        ${centerTrans}
        ${resetVertBase}: auto;
        ${resetHorBase}: auto;
        ${type === "fixed" || type === "sticky"
                ? "margin-block-start:0;z-index: 50;"
                : "z-index: auto;"}
      `;
        }
        return "";
        // オブジェクトではないが値がある場合（簡易的な中央揃えフラグなど）
    }
    else if (pos) {
        return "top:50%;left: 50%;transform: translate(-50%, -50%);";
    }
    return null;
};
//ブロック幅を返す
const max_width_prm = (width, free_val) => {
    const ret_width_prm = width === "wideSize"
        ? "max-width: var(--wp--style--global--wide-size);"
        : width === "contentSize"
            ? "max-width: var(--wp--style--global--content-size);"
            : width === "free"
                ? `max-width: ${free_val};`
                : width === "full"
                    ? "max-width: 100%;"
                    : "max-width: fit-content;";
    return ret_width_prm;
};
const width_prm = (width, free_val) => {
    const ret_width_prm = width === "wideSize"
        ? " width: var(--wp--style--global--wide-size);"
        : width === "contentSize"
            ? " width: var(--wp--style--global--content-size);"
            : width === "free"
                ? ` width: ${free_val}; `
                : width === "full"
                    ? " width: 100%;"
                    : width === "fit"
                        ? " width: fit-content;"
                        : " width: auto;";
    return ret_width_prm;
};
const height_prm = (height, free_val) => {
    const ret_height_prm = height === "fit"
        ? " height: fit-content;"
        : height === "full"
            ? ` height: 100%; `
            : height === "free"
                ? ` height: ${free_val}; `
                : "height: auto;";
    return ret_height_prm;
};
//配置を返す
const align_prm = (align, camelFLg = false) => {
    //css用
    const ret_align_prm = align === "center"
        ? "margin-left: auto; margin-right: auto;"
        : align === "right"
            ? "margin-left: auto; margin-right: 0;"
            : "margin-right: auto; margin-left: 0;";
    //インナースタイル用
    const camel_align_prm = align === "center"
        ? { marginLeft: "auto", marginRight: "auto" }
        : align === "right"
            ? { marginLeft: "auto" }
            : {};
    return camelFLg ? camel_align_prm : ret_align_prm;
};
//スタイルオブジェクト変換関数
const convertToScss = (styleObject) => {
    let scss = "";
    for (const prop in styleObject) {
        if (styleObject.hasOwnProperty(prop)) {
            const scssProp = prop.replace(/([A-Z])/g, "-$1").toLowerCase();
            scss += `${scssProp}: ${styleObject[prop]};\n`;
        }
    }
    return scss;
};
/**
 * ボーダー設定オブジェクトをCSSプロパティオブジェクトに変換する
 */
const borderProperty = (borderObj) => {
    if (!borderObj)
        return null;
    const sides = ["top", "bottom", "left", "right"];
    // 指定されたキーのいずれかが存在するかチェック
    const hasSideSettings = sides.some((side) => side in borderObj);
    if (hasSideSettings) {
        // 1. Record<string, string> と定義することで、動的なキー代入を許可します
        const cssObj = {};
        for (const side in borderObj) {
            const sideData = borderObj[side];
            // 幅が 0（0px, 0remなど）で始まる場合はスキップ
            if (String(sideData?.width || "").startsWith("0")) {
                continue;
            }
            const borderStyle = sideData?.style || "solid";
            // 2. キーを camelCase に変換（例: top -> borderTop）
            const camelCaseSide = `border${capitalizeFirstLetter(side)}`;
            cssObj[camelCaseSide] =
                `${sideData.width} ${borderStyle} ${sideData.color}`;
        }
        // すべての辺が幅0で cssObj が空になった場合は null を返す
        return Object.keys(cssObj).length > 0 ? cssObj : null;
    }
    else {
        // 同一のボーダー設定の場合
        if (String(borderObj.width || "").startsWith("0")) {
            return null;
        }
        const borderStyle = borderObj.style || "solid";
        return {
            border: `${borderObj.width} ${borderStyle} ${borderObj.color}`,
        };
    }
};
//角丸の設定
const radiusProperty = (radiusObj) => {
    if (!radiusObj)
        return {};
    const ret_prop = radiusObj && Object.keys(radiusObj).length === 1
        ? radiusObj.value
        : `${(radiusObj && radiusObj.topLeft) || ""} ${(radiusObj && radiusObj.topRight) || ""} ${(radiusObj && radiusObj.bottomRight) || ""} ${(radiusObj && radiusObj.bottomLeft) || ""}`;
    const ret_val = { borderRadius: ret_prop };
    return ret_val;
};
//マージンの設定
const marginProperty = (marginObj) => {
    if (!marginObj)
        return {};
    const ret_prop = `${marginObj.top} ${marginObj.right} ${marginObj.bottom} ${marginObj.left}`;
    const ret_val = { margin: ret_prop };
    return ret_val;
};
//パディングの設定
const paddingProperty = (paddingObj) => {
    if (!paddingObj)
        return {};
    const ret_prop = `${paddingObj.top} ${paddingObj.right} ${paddingObj.bottom} ${paddingObj.left}`;
    const ret_val = { padding: ret_prop };
    return ret_val;
};

exports.align_prm = align_prm;
exports.borderProperty = borderProperty;
exports.convertToScss = convertToScss;
exports.height_prm = height_prm;
exports.marginProperty = marginProperty;
exports.max_width_prm = max_width_prm;
exports.paddingProperty = paddingProperty;
exports.position_prm = position_prm;
exports.radiusProperty = radiusProperty;
exports.radius_prm = radius_prm;
exports.space_prm = space_prm;
exports.width_prm = width_prm;
//# sourceMappingURL=cssPropertes.js.map
