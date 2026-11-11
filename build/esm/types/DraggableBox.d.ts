import { RefObject } from "@wordpress/element";
interface PositionString {
    x: string;
    y: string;
}
export declare const useDraggingMove: (isMovable: boolean, blockRef: RefObject<HTMLElement>, // ReactのRef型を指定
position: PositionString, onPositionChange: (pos: PositionString) => void) => void;
interface DraggableBoxProps {
    attributes: {
        x: string;
        y: string;
    };
    onPositionChange: (newPos: {
        x: string;
        y: string;
    }) => void;
    /** ラベルの末尾に付ける表記。例: "(Mobile)" / "(DeskTop)" */
    labelSuffix?: string;
}
export default function DraggableBox({ attributes, onPositionChange, labelSuffix, }: DraggableBoxProps): import("react/jsx-runtime").JSX.Element;
export {};
