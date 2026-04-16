import { RefObject } from "@wordpress/element";
export declare function useElementWidth(): {
    ref: RefObject<HTMLDivElement | null>;
    width: number;
};
export declare function useIsMobile(): any;
export declare function useIsIframeMobile(): any;
export declare function useElementBackgroundColor(blockRef: RefObject<HTMLElement>, style: React.CSSProperties): any;
export declare function useElementStyleObject(blockRef: RefObject<HTMLElement>, style: React.CSSProperties): any;
export declare function useDeepCompareEffect(callback: () => void | (() => void), // EffectCallback の中身を直接書く
dependencies: any[]): void;
export declare function useFontawesomeIframe(): void;
export declare function useBlockAttributeChanges(clientId: string, blockName: string, className: string, modFlg?: boolean, excludeAttributes?: Record<string, any>): any;
export declare function useDuplicateBlockRemove(clientId: string, blockNames: string[]): void;
export declare function useStyleIframe<T>(StyleComp: React.ComponentType<{
    attributes: T;
    children?: React.ReactNode;
}>, attributes: T): any;
