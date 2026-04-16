import { RefObject } from "@wordpress/element";
import { GridAttributes } from "./GridControls";
interface BlockPlaceAttributes {
    positionType: string;
    isPosCenter: boolean;
    default_val: any;
    mobile_val: any;
    [key: string]: any;
}
interface BlockPlaceProps {
    attributes: BlockPlaceAttributes;
    clientId: string;
    blockRef: RefObject<HTMLElement>;
    isMobile: boolean;
    isSubmenu: boolean;
    isParallax: boolean;
    onDirectionChange: (dir: string) => void;
    onReverseChange: (checked: boolean) => void;
    onWrapChange: (checked: boolean) => void;
    onFlexChange: (strech: string, pos: string) => void;
    onVerticalChange: (pos: string) => void;
    onAlignChange: (pos: string) => void;
    onWidthChange: (key: string, widthVal: number | string) => void;
    onFreeWidthChange: (key: string, freeVal: number | string) => void;
    onFlexItemChange: (obj: object) => void;
    onPosValueChange: (obj: object) => void;
    onFreeHeightChange: (val: number | string) => void;
    onHeightChange: (val: string) => void;
    onIsPosCenterChange: (checked: boolean) => void;
    onPositionChange: (val: string) => void;
    onGridChange: (attr: Partial<GridAttributes>) => void;
}
export default function BlockPlace(props: BlockPlaceProps): import("react/jsx-runtime").JSX.Element;
interface BlockWidthProps {
    attributes: any;
    isMobile: boolean;
    isSubmenu: boolean;
    onWidthChange: (key: string, widthVal: string | number) => void;
    onFreeWidthChange: (key: string, freeVal: string | number) => void;
}
export declare function BlockWidth(props: BlockWidthProps): import("react/jsx-runtime").JSX.Element;
interface BlockHeightProps {
    attributes: any;
    isMobile: boolean;
    onHeightChange: (val: string) => void;
    onFreeHeightChange: (freeVal: string | number) => void;
}
export declare function BlockHeight(props: BlockHeightProps): import("react/jsx-runtime").JSX.Element;
export {};
