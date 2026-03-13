/**
 * Masonry グリッドを初期化する共通関数
 *
 * @param {HTMLElement} gridEl - `.itmar-masonry-grid` のコンテナ要素
 * @param {Array<{ url: string, alt?: string }>} images - 描画する画像リスト
 * @param {Object} options
 * @param {number} options.columns - カラム数
 * @param {boolean} [options.renderItems=true]
 *   true: この関数内で gridEl をクリアして <figure><img> を追加する
 *   false: 既にある .itmar-masonry-item をそのまま使い、幅だけ更新する
 *
 * @returns {any|null} Masonry インスタンス（なければ null）
 */
declare global {
    interface Window {
        Masonry: any;
        imagesLoaded: any;
    }
    interface HTMLElement {
        __masonryInstance?: any;
    }
}
interface MasonryImage {
    url: string;
    alt?: string;
}
interface MasonryOptions {
    columns?: number;
    renderItems?: boolean;
}
/**
 * Masonry レイアウトを初期化・更新する
 */
export default function MasonryControl(gridEl: HTMLElement | null, images?: MasonryImage[], { columns, renderItems }?: MasonryOptions): any;
export {};
