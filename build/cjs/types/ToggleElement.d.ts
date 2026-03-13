import React, { ReactNode } from "react";
interface ToggleElementProps {
    openFlg: boolean;
    onToggle?: (isOpen: boolean) => void;
    className?: string;
    style?: React.CSSProperties;
    children?: ReactNode;
}
/**
 * クリックで開閉状態を切り替えるラッパーコンポーネント
 */
export default function ToggleElement({ openFlg, onToggle, className, style, children, }: ToggleElementProps): JSX.Element;
export {};
