'use strict';

var hslToRgb = require('./hslToRgb.js');

/**
 * 影（ノーマル / ニューモフィズム / クレイモーフィズム / グラスモーフィズム）の
 * スタイル算出。
 *
 * 【重要】このモジュールは @wordpress パッケージに依存しない。ビュースクリプトから
 * 参照されるため、依存を足すとエディタ用パッケージがフロントエンドへ配信される。
 *
 * 以前は ShadowStyle.tsx（インスペクターUI）に同居し、エラー時に
 * `dispatch("core/notices")` を直接呼んでいた。CSSの算出と編集画面への通知は
 * 関心が別なので、通知は `onError` コールバックへ委ねている。エディタ側は
 * ハンドラを渡し、フロントエンド側は渡さない。
 */
/**
 * 方向と距離に基づいて、各頂点の数値を算出する
 */
const dirctionDigit = (direction, distance) => {
    // 初期値（デフォルト）を設定しておくことで、switch 漏れを防ぐ
    let destTopLeft = 0;
    let destTopRight = 0;
    let destBottomLeft = 0;
    let destBottomRight = 0;
    switch (direction) {
        case "top_left":
            destTopLeft = distance;
            destTopRight = distance;
            destBottomLeft = distance * -1;
            destBottomRight = distance * -1;
            break;
        case "top_right":
            destTopLeft = distance * -1;
            destTopRight = distance;
            destBottomLeft = distance;
            destBottomRight = distance * -1;
            break;
        case "bottom_left":
            destTopLeft = distance;
            destTopRight = distance * -1;
            destBottomLeft = distance * -1;
            destBottomRight = distance;
            break;
        case "bottom_right":
            destTopLeft = distance * -1;
            destTopRight = distance * -1;
            destBottomLeft = distance;
            destBottomRight = distance;
            break;
        case "right_bottom":
            destTopLeft = distance;
            destTopRight = distance * -1;
            destBottomLeft = distance * -1;
            destBottomRight = distance;
            break;
        case "top":
            destTopLeft = 0;
            destTopRight = 0;
            destBottomLeft = distance * -1;
            destBottomRight = distance;
            break;
    }
    return {
        topLeft: destTopLeft,
        topRight: destTopRight,
        bottomLeft: destBottomLeft,
        bottomRight: destBottomRight,
    };
};
/**
 * グラデーションの色値は通常 'linear-gradient' または 'radial-gradient' で
 * 始まるので、これらのキーワードを探すことで判断する。
 */
function isGradient(colorValue) {
    if (typeof colorValue !== "string") {
        return false;
    }
    return (colorValue.includes("linear-gradient") ||
        colorValue.includes("radial-gradient"));
}
/**
 * 影のスタイルを算出する。算出できない場合は null。
 *
 * @param shadowState 影の設定
 * @param onError     算出できなかった理由の通知先（エディタ側のみ渡す）
 */
const ShadowElm = (shadowState, onError) => {
    const { shadowType, spread, lateral, longitude, nomalBlur, shadowColor, blur, intensity, distance, newDirection, clayDirection, embos, opacity, depth, bdBlur, expand, glassblur, glassopa, hasOutline, baseColor, } = shadowState;
    //ノーマル
    if (shadowType === "nomal") {
        //boxshadowの生成
        const ShadowStyle = embos === "dent"
            ? {
                style: {
                    boxShadow: `${lateral}px ${longitude}px ${nomalBlur}px ${spread}px transparent, inset ${lateral}px ${longitude}px ${nomalBlur}px ${spread}px ${shadowColor}`,
                },
            }
            : {
                style: {
                    boxShadow: `${lateral}px ${longitude}px ${nomalBlur}px ${spread}px ${shadowColor}, inset ${lateral}px ${longitude}px ${nomalBlur}px ${spread}px transparent`,
                },
            };
        //Shadowのスタイルを返す
        return ShadowStyle;
    }
    // --- ニューモフィズム ---
    else if (shadowType === "newmor") {
        if (isGradient(baseColor)) {
            onError?.("gradient-newmor");
            return null;
        }
        const hslValue = hslToRgb.rgb16ToHsl(baseColor);
        if (!hslValue) {
            onError?.("color-parse");
            return null; // カラー変換失敗時のガード
        }
        const lightVal = Math.min(hslValue.lightness + intensity, 100);
        const darkVal = Math.max(hslValue.lightness - intensity, 0);
        const lightValue = hslToRgb.hslToRgb16(hslValue.hue, hslValue.saturation, lightVal);
        const darkValue = hslToRgb.hslToRgb16(hslValue.hue, hslValue.saturation, darkVal);
        const dircObj = dirctionDigit(newDirection, distance);
        const baseBoxShadow = embos === "swell"
            ? `${dircObj.topLeft}px ${dircObj.topRight}px ${blur}px ${darkValue}, ${dircObj.bottomLeft}px ${dircObj.bottomRight}px ${blur}px ${lightValue}, inset ${dircObj.topLeft}px ${dircObj.topRight}px ${blur}px transparent, inset ${dircObj.bottomLeft}px ${dircObj.bottomRight}px ${blur}px transparent`
            : `${dircObj.topLeft}px ${dircObj.topRight}px ${blur}px transparent, ${dircObj.bottomLeft}px ${dircObj.bottomRight}px ${blur}px transparent, inset ${dircObj.topLeft}px ${dircObj.topRight}px ${blur}px ${darkValue}, inset ${dircObj.bottomLeft}px ${dircObj.bottomRight}px ${blur}px ${lightValue}`;
        return {
            style: {
                border: "none",
                background: baseColor,
                boxShadow: baseBoxShadow,
            },
        };
    }
    // --- クレイモーフィズム ---
    else if (shadowType === "claymor") {
        if (isGradient(baseColor)) {
            onError?.("gradient-claymor");
            return null;
        }
        const rgbValue = hslToRgb.HexToRGB(baseColor);
        if (!rgbValue) {
            onError?.("color-parse");
            return null;
        }
        const outsetObj = dirctionDigit(clayDirection, expand);
        const insetObj = dirctionDigit(clayDirection, depth);
        return {
            style: {
                background: `rgba(255, 255, 255, ${opacity})`,
                backdropFilter: `blur(${bdBlur}px)`,
                border: "none",
                boxShadow: `${outsetObj.topLeft}px ${outsetObj.bottomRight}px ${expand * 2}px 0px rgba(${rgbValue.red}, ${rgbValue.green}, ${rgbValue.blue}, 0.5), inset ${insetObj.topRight}px ${insetObj.bottomLeft}px 16px 0px rgba(${rgbValue.red}, ${rgbValue.green}, ${rgbValue.blue}, 0.6), inset 0px 11px 28px 0px rgb(255, 255, 255)`,
            },
        };
    }
    // --- グラスモーフィズム ---
    else if (shadowType === "glassmor") {
        const glassBoxShadow = embos === "swell"
            ? `0 8px 12px 0 rgba( 31, 38, 135, 0.37 ), inset 0 8px 12px 0 transparent`
            : `0 8px 12px 0 transparent, inset 0 8px 12px 0 rgba( 31, 38, 135, 0.37 )`;
        return {
            style: {
                backgroundColor: `rgba(255, 255, 255, ${glassopa})`,
                ...(hasOutline ? { border: `1px solid rgba(255, 255, 255, 0.4)` } : {}),
                borderRightColor: `rgba(255, 255, 255, 0.2)`,
                borderBottomColor: `rgba(255, 255, 255, 0.2)`,
                backdropFilter: `blur(${glassblur}px)`,
                boxShadow: glassBoxShadow,
            },
        };
    }
    return null;
};

exports.ShadowElm = ShadowElm;
//# sourceMappingURL=shadowCss.js.map
