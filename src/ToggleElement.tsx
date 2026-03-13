import { createElement, Fragment } from "@wordpress/element";
import React, { ReactNode } from "react";

// 1. Props の型定義
interface ToggleElementProps {
  openFlg: boolean;
  onToggle?: (isOpen: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode; // Reactコンポーネントやテキストを受け取れる型
}

/**
 * クリックで開閉状態を切り替えるラッパーコンポーネント
 */
export default function ToggleElement({
  openFlg,
  onToggle,
  className = "",
  style,
  children,
}: ToggleElementProps) {
  const toggleOpen = () => {
    // onToggle が存在する場合のみ実行
    if (onToggle) {
      onToggle(!openFlg);
    }
  };

  return (
    <div
      className={`${className} ${openFlg ? "open" : ""}`.trim()}
      style={style}
      onClick={toggleOpen}
      role="button" // アクセシビリティへの配慮
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") toggleOpen();
      }} // キーボード操作対応
    >
      {children}
    </div>
  );
}
