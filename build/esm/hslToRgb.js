const createRGB = (inputStr) => {
    //１６進数変換の関数
    const componentToHex = (c) => {
        const hex = parseInt(String(c), 10).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };
    // デフォルト値（白）
    if (!inputStr)
        return ["ff", "ff", "ff"];
    let rgb;
    // #000000 形式の場合
    if (/^#[0-9a-fA-F]{6}$/.test(inputStr)) {
        rgb = [inputStr.slice(1, 3), inputStr.slice(3, 5), inputStr.slice(5, 7)];
    }
    // rgb(0,0,0) 形式の場合
    else {
        const match = inputStr.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (match) {
            rgb = [
                componentToHex(match[1]),
                componentToHex(match[2]),
                componentToHex(match[3]),
            ];
        }
        else {
            // サポートされていない形式の場合は白を返す
            rgb = ["ff", "ff", "ff"];
        }
    }
    return rgb;
};
/**
 * HSLを16進数カラーコード（#RRGGBB）に変換
 */
function hslToRgb16(hue, saturation, lightness) {
    const h = Number(hue);
    const s = Number(saturation);
    const l = Number(lightness);
    if (h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100) {
        let red = 0, green = 0, blue = 0;
        const hNorm = h / 360;
        const sNorm = s / 100;
        const lNorm = l / 100;
        if (sNorm === 0) {
            red = green = blue = lNorm;
        }
        else {
            const hueToRgb = (p, q, t) => {
                if (t < 0)
                    t += 1;
                if (t > 1)
                    t -= 1;
                if (t < 1 / 6)
                    return p + (q - p) * 6 * t;
                if (t < 1 / 2)
                    return q;
                if (t < 2 / 3)
                    return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
            const p = 2 * lNorm - q;
            red = hueToRgb(p, q, hNorm + 1 / 3);
            green = hueToRgb(p, q, hNorm);
            blue = hueToRgb(p, q, hNorm - 1 / 3);
        }
        const toHex = (c) => Math.round(c * 255)
            .toString(16)
            .padStart(2, "0");
        return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
    }
    return false;
}
/**
 * 16進数カラーコードをHSLオブジェクトに変換
 */
function rgb16ToHsl(strRgb16) {
    const rgb = createRGB(strRgb16); // 先ほど定義した [string, string, string] を返す関数
    const [rHex, gHex, bHex] = rgb;
    const hexPattern = /^[0-9a-f]{2}$/i;
    if (hexPattern.test(rHex) && hexPattern.test(gHex) && hexPattern.test(bHex)) {
        let h = 0, s = 0;
        const r = parseInt(rHex, 16) / 255;
        const g = parseInt(gHex, 16) / 255;
        const b = parseInt(bHex, 16) / 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const l = (max + min) / 2;
        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            if (max === r)
                h = (g - b) / d + (g < b ? 6 : 0);
            else if (max === g)
                h = (b - r) / d + 2;
            else
                h = (r - g) / d + 4;
            h /= 6;
        }
        return {
            hue: Math.round(h * 360),
            saturation: Math.round(s * 100),
            lightness: Math.round(l * 100),
        };
    }
    return false;
}
/**
 * 16進数カラーコードをRGBオブジェクトに変換
 */
function HexToRGB(strRgb16) {
    const [rHex, gHex, bHex] = createRGB(strRgb16);
    const hexPattern = /^[0-9a-f]{2}$/i;
    if (hexPattern.test(rHex) && hexPattern.test(gHex) && hexPattern.test(bHex)) {
        return {
            red: parseInt(rHex, 16),
            green: parseInt(gHex, 16),
            blue: parseInt(bHex, 16),
        };
    }
    return false;
}

export { HexToRGB, hslToRgb16, rgb16ToHsl };
//# sourceMappingURL=hslToRgb.js.map
