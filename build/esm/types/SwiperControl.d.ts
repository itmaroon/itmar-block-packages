import Swiper from "swiper";
interface SwiperObject {
    swiper_id: string;
    relate_id: string | null;
    is_thumbnail: boolean;
    instance: Swiper;
}
/**
 * スライダーブロックの初期化メイン関数
 */
export declare function slideBlockSwiperInit(swiperElement: HTMLElement | string): SwiperObject | null;
export {};
