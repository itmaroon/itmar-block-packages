import { jsx, Fragment, jsxs } from 'react/jsx-runtime';
import { __ } from '@wordpress/i18n';
import { PanelBody, PanelRow, __experimentalUnitControl, Button } from '@wordpress/components';
import { useRef, useEffect } from '@wordpress/element';

const useDraggingMove = (isMovable, blockRef, // ReactのRef型を指定
position, onPositionChange) => {
    const elmposition = useRef({ x: 0, y: 0 });
    const isDragging = useRef(false);
    const mousePosition = useRef({ x: 0, y: 0 });
    useEffect(() => {
        const element = blockRef.current;
        if (!element)
            return;
        if (!isMovable) {
            if (element) {
                element.classList.remove("itmar_isDraggable"); //移動カーソル表示クラス削除
            }
            return; // 移動許可がある場合のみ、後続のロジックを実行
        }
        //positionの変化に合わせて現在位置を変更
        const pos_value_x = position.x.match(/(-?\d+)([%a-zA-Z]+)/);
        const pos_value_y = position.y.match(/(-?\d+)([%a-zA-Z]+)/);
        if (pos_value_x && pos_value_y) {
            elmposition.current = {
                x: parseInt(pos_value_x[1], 10),
                y: parseInt(pos_value_y[1], 10),
            };
        }
        //イベントハンドラ
        const handleMouseDown = (event) => {
            // 移動カーソル表示クラス名を追加します。
            element.classList.add("itmar_isDraggable");
            //ドラッグの開始フラグオン
            isDragging.current = true;
            //ドラッグ開始の絶対位置
            mousePosition.current = { x: event.clientX, y: event.clientY };
        };
        const handleMouseMove = (event) => {
            if (!isDragging.current)
                return; //ドラッグ中でなければ処理を中止
            const dx = event.clientX - mousePosition.current.x;
            const dy = event.clientY - mousePosition.current.y;
            //ドラッグ後の位置を保存
            const newPosition = {
                x: elmposition.current.x + dx,
                y: elmposition.current.y + dy,
            };
            elmposition.current = newPosition;
            mousePosition.current = { x: event.clientX, y: event.clientY }; //マウス位置の保存
            //ドラッグによるブロックの一時的移動
            element.style.transform = `translate(${elmposition.current.x}px, ${elmposition.current.y}px)`;
        };
        const handleMouseUp = () => {
            if (!isDragging.current)
                return;
            isDragging.current = false;
            element.style.transform = ""; // null ではなく空文字が推奨
            //呼出しもとに要素の位置を返す
            onPositionChange({
                x: `${elmposition.current.x}px`,
                y: `${elmposition.current.y}px`,
            });
        };
        const handleMouseLeave = () => {
            isDragging.current = false;
        };
        if (element) {
            // クラス名を追加します。
            element.classList.add("itmar_isDraggable");
        }
        // イベントハンドラを追加します。
        element.addEventListener("mousedown", handleMouseDown);
        element.addEventListener("mousemove", handleMouseMove);
        element.addEventListener("mouseup", handleMouseUp);
        element.addEventListener("mouseleave", handleMouseLeave);
        // イベントリスナーを削除するクリーンアップ関数を返します。
        return () => {
            element.removeEventListener("mousedown", handleMouseDown);
            element.removeEventListener("mousemove", handleMouseMove);
            element.removeEventListener("mouseup", handleMouseUp);
            element.removeEventListener("mouseleave", handleMouseLeave);
            element.style.transform = "";
        };
    }, [isMovable, blockRef, position, onPositionChange]); // 依存配列に isMovable を含めます
};
function DraggableBox({ attributes, onPositionChange, }) {
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
    return (jsx(Fragment, { children: jsxs(PanelBody, { title: __("Position Setting", "block-collections"), initialOpen: true, children: [jsxs(PanelRow, { className: "distance_row", children: [jsx(__experimentalUnitControl, { dragDirection: "e", onChange: (value) => chagePosition(value, "x"), label: __("Vertical", "block-collections"), value: position?.x || 0 }), jsx(__experimentalUnitControl, { dragDirection: "e", onChange: (value) => chagePosition(value, "y"), label: __("Horizen", "block-collections"), value: position?.y || 0 })] }), jsx(PanelRow, { className: "reset_row", children: jsx(Button, { variant: "secondary", onClick: () => resetPos(), children: __("Reset", "block-collections") }) })] }) }));
}

export { DraggableBox as default, useDraggingMove };
//# sourceMappingURL=DraggableBox.js.map
