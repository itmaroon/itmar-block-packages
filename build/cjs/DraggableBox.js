'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var i18n = require('@wordpress/i18n');
var components = require('@wordpress/components');
var element = require('@wordpress/element');

// "12.5px" "-3em" などを px の数値に直す（小数・負数・em/rem に対応。% など換算できない単位は 0 扱い）
const toPx = (value, element) => {
    const m = String(value ?? "").trim().match(/^(-?\d*\.?\d+)([%a-zA-Z]*)$/);
    if (!m)
        return 0;
    const num = parseFloat(m[1]);
    const unit = m[2];
    if (unit === "" || unit === "px")
        return num;
    if (unit === "em" || unit === "rem") {
        const base = unit === "em" ? element : document.documentElement;
        return num * (parseFloat(getComputedStyle(base).fontSize) || 16);
    }
    return 0;
};
// この距離(px)以上動かして初めてドラッグとみなす。クリックや内側ブロックの選択を邪魔しないため
const DRAG_THRESHOLD = 4;
const useDraggingMove = (isMovable, blockRef, // ReactのRef型を指定
position, onPositionChange) => {
    // 最新の値は ref で持つ。effect の依存に入れると再描画のたびにリスナーが張り替わり、
    // ドラッグ中に transform が消えたり開始位置が巻き戻ったりする
    const positionRef = element.useRef(position);
    const onChangeRef = element.useRef(onPositionChange);
    positionRef.current = position;
    onChangeRef.current = onPositionChange;
    element.useEffect(() => {
        const element = blockRef.current;
        if (!element)
            return;
        if (!isMovable) {
            element.classList.remove("itmar_isDraggable"); //移動カーソル表示クラス削除
            return;
        }
        element.classList.add("itmar_isDraggable");
        let pointerId = null;
        let started = false; // しきい値を超えてドラッグが始まったか
        let startPointer = { x: 0, y: 0 };
        let startOffset = { x: 0, y: 0 };
        let current = { x: 0, y: 0 };
        let prevUserSelect = "";
        const onPointerDown = (event) => {
            if (event.button !== 0 || !event.isPrimary)
                return;
            // 入れ子の移動可能ブロックでは一番内側だけを動かす
            const hit = event.target?.closest(".itmar_isDraggable");
            if (hit !== element)
                return;
            // フォーム部品の操作（入力・選択）はドラッグにしない
            if (event.target.closest("input, textarea, select"))
                return;
            pointerId = event.pointerId;
            started = false;
            startPointer = { x: event.clientX, y: event.clientY };
            startOffset = {
                x: toPx(positionRef.current?.x, element),
                y: toPx(positionRef.current?.y, element),
            };
            current = startOffset;
        };
        const onPointerMove = (event) => {
            if (pointerId === null || event.pointerId !== pointerId)
                return;
            const dx = event.clientX - startPointer.x;
            const dy = event.clientY - startPointer.y;
            if (!started) {
                if (Math.hypot(dx, dy) < DRAG_THRESHOLD)
                    return;
                started = true;
                // 以後のイベントを、ポインターが要素の外に出ても受け取る（速く動かしても途切れない）
                try {
                    element.setPointerCapture(event.pointerId);
                }
                catch (e) {
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
        const finish = (event, commit) => {
            if (pointerId === null || event.pointerId !== pointerId)
                return;
            pointerId = null;
            if (!started)
                return;
            started = false;
            try {
                element.releasePointerCapture(event.pointerId);
            }
            catch (e) {
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
        const onPointerUp = (event) => finish(event, true);
        const onPointerCancel = (event) => finish(event, false);
        // ドラッグ直後に発火する click は止める（内側ブロックを誤って選択・操作しない）
        const onClickCapture = (event) => {
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
        const onUpMark = (event) => {
            if (started && event.pointerId === pointerId)
                markSuppress();
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
function DraggableBox({ attributes, onPositionChange, labelSuffix = "", }) {
    const position = attributes;
    //インスペクター内のコントロールからの移動操作
    const chagePosition = (value, cordinate) => {
        if (value !== undefined) {
            const newPos = { ...position, [cordinate]: value };
            onPositionChange(newPos);
        }
    };
    const resetPos = () => {
        onPositionChange({ x: "0px", y: "0px" });
    };
    return (jsxRuntime.jsx(jsxRuntime.Fragment, { children: jsxRuntime.jsxs(components.PanelBody, { title: i18n.__("Position Setting", "block-collections"), initialOpen: true, children: [jsxRuntime.jsxs(components.PanelRow, { className: "distance_row", children: [jsxRuntime.jsx(components.__experimentalUnitControl, { dragDirection: "e", onChange: (value) => chagePosition(value, "x"), label: `${i18n.__("Horizen", "block-collections")}${labelSuffix}`, value: position?.x || 0 }), jsxRuntime.jsx(components.__experimentalUnitControl, { dragDirection: "e", onChange: (value) => chagePosition(value, "y"), label: `${i18n.__("Vertical", "block-collections")}${labelSuffix}`, value: position?.y || 0 })] }), jsxRuntime.jsx(components.PanelRow, { className: "reset_row", children: jsxRuntime.jsx(components.Button, { variant: "secondary", onClick: () => resetPos(), children: i18n.__("Reset", "block-collections") }) })] }) }));
}

exports.default = DraggableBox;
exports.useDraggingMove = useDraggingMove;
//# sourceMappingURL=DraggableBox.js.map
