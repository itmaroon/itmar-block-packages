interface HSL {
    hue: number;
    saturation: number;
    lightness: number;
}
interface RGB {
    red: number;
    green: number;
    blue: number;
}
/**
 * HSLを16進数カラーコード（#RRGGBB）に変換
 */
export declare function hslToRgb16(hue: number | string, saturation: number | string, lightness: number | string): string | false;
/**
 * 16進数カラーコードをHSLオブジェクトに変換
 */
export declare function rgb16ToHsl(strRgb16: string): HSL | false;
/**
 * 16進数カラーコードをRGBオブジェクトに変換
 */
export declare function HexToRGB(strRgb16: string): RGB | false;
export {};
