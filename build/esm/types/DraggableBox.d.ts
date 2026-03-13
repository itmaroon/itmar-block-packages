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
}
export default function DraggableBox({ attributes, onPositionChange, }: DraggableBoxProps): JSX.Element;
export {};
