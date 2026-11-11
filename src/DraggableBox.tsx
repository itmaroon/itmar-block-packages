import { createElement, Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

import {
  Button,
  PanelBody,
  PanelRow,
  __experimentalUnitControl as UnitControl,
} from "@wordpress/components";

import { useEffect, useRef, RefObject } from "@wordpress/element";

// 座標の型定義
interface Vector2D {
  x: number;
  y: number;
}

interface PositionString {
  x: string;
  y: string;
}

// "12.5px" "-3em" などを px の数値に直す（小数・負数・em/rem に対応。% など換算できない単位は 0 扱い）
const toPx = (value: string | undefined, element: HTMLElement): number => {
  const m = String(value ?? "").trim().match(/^(-?\d*\.?\d+)([%a-zA-Z]*)$/);
  if (!m) return 0;
  const num = parseFloat(m[1]);
  const unit = m[2];
  if (unit === "" || unit === "px") return num;
  if (unit === "em" || unit === "rem") {
    const base = unit === "em" ? element : document.documentElement;
    return num * (parseFloat(getComputedStyle(base).fontSize) || 16);
  }
  return 0;
};

// この距離(px)以上動かして初めてドラッグとみなす。クリックや内側ブロックの選択を邪魔しないため
const DRAG_THRESHOLD = 4;

export const useDraggingMove = (
  isMovable: boolean,
  blockRef: RefObject<HTMLElement>, // ReactのRef型を指定
  position: PositionString,
  onPositionChange: (pos: PositionString) => void,
) => {
  // 最新の値は ref で持つ。effect の依存に入れると再描画のたびにリスナーが張り替わり、
  // ドラッグ中に transform が消えたり開始位置が巻き戻ったりする
  const positionRef = useRef(position);
  const onChangeRef = useRef(onPositionChange);
  positionRef.current = position;
  onChangeRef.current = onPositionChange;

  useEffect(() => {
    const element = blockRef.current;
    if (!element) return;

    if (!isMovable) {
      element.classList.remove("itmar_isDraggable"); //移動カーソル表示クラス削除
      return;
    }
    element.classList.add("itmar_isDraggable");

    let pointerId: number | null = null;
    let started = false; // しきい値を超えてドラッグが始まったか
    let startPointer: Vector2D = { x: 0, y: 0 };
    let startOffset: Vector2D = { x: 0, y: 0 };
    let current: Vector2D = { x: 0, y: 0 };
    let prevUserSelect = "";

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || !event.isPrimary) return;
      // 入れ子の移動可能ブロックでは一番内側だけを動かす
      const hit = (event.target as Element | null)?.closest(".itmar_isDraggable");
      if (hit !== element) return;
      // フォーム部品の操作（入力・選択）はドラッグにしない
      if ((event.target as Element).closest("input, textarea, select")) return;

      pointerId = event.pointerId;
      started = false;
      startPointer = { x: event.clientX, y: event.clientY };
      startOffset = {
        x: toPx(positionRef.current?.x, element),
        y: toPx(positionRef.current?.y, element),
      };
      current = startOffset;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (pointerId === null || event.pointerId !== pointerId) return;
      const dx = event.clientX - startPointer.x;
      const dy = event.clientY - startPointer.y;
      if (!started) {
        if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
        started = true;
        // 以後のイベントを、ポインターが要素の外に出ても受け取る（速く動かしても途切れない）
        try {
          element.setPointerCapture(event.pointerId);
        } catch (e) {
          /* 取得できなくても動作は続ける */
        }
        prevUserSelect = element.style.userSelect;
        element.style.userSelect = "none"; // ドラッグ中に文字が選択されないように
      }
      event.preventDefault();
      current = { x: startOffset.x + dx, y: startOffset.y + dy };
      //ドラッグによるブロックの一時的移動
      element.style.transform = `translate(${current.x}px, ${current.y}px)`;
    };

    const finish = (event: PointerEvent, commit: boolean) => {
      if (pointerId === null || event.pointerId !== pointerId) return;
      pointerId = null;
      if (!started) return;
      started = false;
      try {
        element.releasePointerCapture(event.pointerId);
      } catch (e) {
        /* すでに解放済み */
      }
      element.style.userSelect = prevUserSelect;
      element.style.transform = "";
      if (commit) {
        //呼出しもとに要素の位置を返す
        onChangeRef.current({
          x: `${Math.round(current.x)}px`,
          y: `${Math.round(current.y)}px`,
        });
      }
    };
    const onPointerUp = (event: PointerEvent) => finish(event, true);
    const onPointerCancel = (event: PointerEvent) => finish(event, false);

    // ドラッグ直後に発火する click は止める（内側ブロックを誤って選択・操作しない）
    const onClickCapture = (event: MouseEvent) => {
      if (suppressClick) {
        suppressClick = false;
        event.stopPropagation();
        event.preventDefault();
      }
    };
    let suppressClick = false;
    const markSuppress = () => {
      suppressClick = true;
      setTimeout(() => (suppressClick = false), 0);
    };
    const onUpMark = (event: PointerEvent) => {
      if (started && event.pointerId === pointerId) markSuppress();
    };

    element.addEventListener("pointerdown", onPointerDown);
    element.addEventListener("pointermove", onPointerMove);
    element.addEventListener("pointerup", onUpMark, true); // finish より先に started を見る
    element.addEventListener("pointerup", onPointerUp);
    element.addEventListener("pointercancel", onPointerCancel);
    element.addEventListener("click", onClickCapture, true);

    return () => {
      element.removeEventListener("pointerdown", onPointerDown);
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerup", onUpMark, true);
      element.removeEventListener("pointerup", onPointerUp);
      element.removeEventListener("pointercancel", onPointerCancel);
      element.removeEventListener("click", onClickCapture, true);
      element.style.transform = "";
      element.style.userSelect = prevUserSelect;
    };
  }, [isMovable, blockRef]);
};

interface DraggableBoxProps {
  attributes: {
    x: string;
    y: string;
  };
  onPositionChange: (newPos: { x: string; y: string }) => void;
  /** ラベルの末尾に付ける表記。例: "(Mobile)" / "(DeskTop)" */
  labelSuffix?: string;
}
export default function DraggableBox({
  attributes,
  onPositionChange,
  labelSuffix = "",
}: DraggableBoxProps) {
  const position = attributes;

  //インスペクター内のコントロールからの移動操作
  const chagePosition = (value: string | undefined, cordinate: "x" | "y") => {
    if (value !== undefined) {
      const newPos = { ...position, [cordinate]: value };
      onPositionChange(newPos);
    }
  };

  const resetPos = () => {
    onPositionChange({ x: "0px", y: "0px" });
  };

  return (
    <>
      <PanelBody
        title={__("Position Setting", "block-collections")}
        initialOpen={true}
      >
        <PanelRow className="distance_row">
          <UnitControl
            dragDirection="e"
            onChange={(value) => chagePosition(value, "x")}
            label={`${__("Horizen", "block-collections")}${labelSuffix}`}
            value={position?.x || 0}
          />
          <UnitControl
            dragDirection="e"
            onChange={(value) => chagePosition(value, "y")}
            label={`${__("Vertical", "block-collections")}${labelSuffix}`}
            value={position?.y || 0}
          />
        </PanelRow>
        <PanelRow className="reset_row">
          <Button variant="secondary" onClick={() => resetPos()}>
            {__("Reset", "block-collections")}
          </Button>
        </PanelRow>
      </PanelBody>
    </>
  );
}
