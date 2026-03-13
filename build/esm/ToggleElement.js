import { createElement } from '@wordpress/element';

/**
 * クリックで開閉状態を切り替えるラッパーコンポーネント
 */
function ToggleElement({ openFlg, onToggle, className = "", style, children, }) {
    const toggleOpen = () => {
        // onToggle が存在する場合のみ実行
        if (onToggle) {
            onToggle(!openFlg);
        }
    };
    return (createElement("div", { className: `${className} ${openFlg ? "open" : ""}`.trim(), style: style, onClick: toggleOpen, role: "button" // アクセシビリティへの配慮
        , tabIndex: 0, onKeyDown: (e) => {
            if (e.key === "Enter")
                toggleOpen();
        } }, children));
}

export { ToggleElement as default };
//# sourceMappingURL=ToggleElement.js.map
