'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var i18n = require('@wordpress/i18n');
var element = require('@wordpress/element');
var components = require('@wordpress/components');
var icons = require('@wordpress/icons');
var GridControls = require('./GridControls.js');

//横並びのアイコン
const flex = jsxRuntime.jsx(components.Icon, { icon: icons.stack, className: "rotate-icon" });
//上よせアイコン
const upper = jsxRuntime.jsx(components.Icon, { icon: icons.justifyLeft, className: "rotate-icon" });
//中央よせのアイコン
const middle = jsxRuntime.jsx(components.Icon, { icon: icons.justifyCenter, className: "rotate-icon" });
//下よせのアイコン
const lower = jsxRuntime.jsx(components.Icon, { icon: icons.justifyRight, className: "rotate-icon" });
//上下一杯に伸ばすアイコン
const vert_between = jsxRuntime.jsx(components.Icon, { icon: icons.justifyStretch, className: "rotate-icon" });
//上下均等に伸ばすアイコン
const vert_around = jsxRuntime.jsx(components.Icon, { icon: icons.justifySpaceBetween, className: "rotate-icon" });
function BlockPlace(props) {
    const { attributes, clientId, blockRef, isMobile, isSubmenu, isParallax } = props;
    const { positionType, isPosCenter, default_val, mobile_val } = attributes;
    //モバイルかデスクトップか
    const sel_pos = isMobile ? mobile_val : default_val;
    //配置アイコンの選択
    const start_icon = sel_pos.direction === "vertical" ? upper : icons.justifyLeft;
    const center_icon = sel_pos.direction === "vertical" ? middle : icons.justifyCenter;
    const end_icon = sel_pos.direction === "vertical" ? lower : icons.justifyRight;
    const start_cross = sel_pos.direction === "vertical" ? icons.justifyLeft : upper;
    const center_cross = sel_pos.direction === "vertical" ? icons.justifyCenter : middle;
    const end_cross = sel_pos.direction === "vertical" ? icons.justifyRight : lower;
    const stretch = sel_pos.direction === "vertical" ? icons.justifyStretch : vert_between;
    const between_icon = sel_pos.direction === "vertical" ? vert_between : icons.justifyStretch;
    const around_icon = sel_pos.direction === "vertical" ? vert_around : icons.justifySpaceBetween;
    //ツールチップの選択
    const start_tip = sel_pos.direction === "vertical"
        ? i18n.__("upper alignment", "block-collections")
        : i18n.__("left alignment", "block-collections");
    const end_tip = sel_pos.direction === "vertical"
        ? i18n.__("lower alignment", "block-collections")
        : i18n.__("right alignment", "block-collections");
    const cross_start_tip = sel_pos.direction === "vertical"
        ? i18n.__("left alignment", "block-collections")
        : i18n.__("upper alignment", "block-collections");
    const cross_end_tip = sel_pos.direction === "vertical"
        ? i18n.__("right alignment", "block-collections")
        : i18n.__("lower alignment", "block-collections");
    const [isContainer, setIsContainer] = element.useState(false);
    const [isFlexItem, setIsFlexItem] = element.useState(false);
    const [direction, setDirection] = element.useState("row");
    element.useEffect(() => {
        if (blockRef.current) {
            const element = blockRef.current;
            if (element &&
                element.parentElement &&
                element.parentElement.parentElement) {
                const grandparentElement = element.parentElement.parentElement;
                const computedStyle = getComputedStyle(grandparentElement);
                //親要素がFlex又はGridコンテナか
                if (computedStyle.display === "flex" ||
                    computedStyle.display === "inline-flex" ||
                    computedStyle.display === "grid" ||
                    computedStyle.display === "inline-grid") {
                    setIsContainer(true);
                }
                //flexの時その方向
                if (computedStyle.display === "flex" ||
                    computedStyle.display === "inline-flex") {
                    setIsFlexItem(true);
                    if (computedStyle.flexDirection === "row" ||
                        computedStyle.flexDirection === "row-reverse") {
                        setDirection("row");
                    }
                    else {
                        setDirection("column");
                    }
                }
            }
        }
    }, []);
    //GridModalを開く
    const [isGridModalOpen, setIsGridModalOpen] = element.useState(false);
    const openGridModal = () => setIsGridModalOpen(true);
    const closeGridModal = () => setIsGridModalOpen(false);
    // 翻訳が必要な文字列を直接指定
    i18n.__("Block Max Width(Mobile)", "block-collections");
    i18n.__("Block Width(Mobile)", "block-collections");
    i18n.__("Block Max Width(DeskTop)", "block-collections");
    i18n.__("Block Width(DeskTop)", "block-collections");
    return (jsxRuntime.jsx(jsxRuntime.Fragment, { children: jsxRuntime.jsxs(components.PanelBody, { title: i18n.__("Block placement", "block-collections"), initialOpen: false, className: "itmar_group_direction", children: [isMobile ? (jsxRuntime.jsx("p", { children: i18n.__("InnerBlock direction(Mobile)", "block-collections") })) : (jsxRuntime.jsx("p", { children: i18n.__("InnerBlock direction(DeskTop)", "block-collections") })), jsxRuntime.jsxs(components.ToolbarGroup, { children: [jsxRuntime.jsx(components.ToolbarItem, { children: (itemProps) => (jsxRuntime.jsx(components.Button, { ...itemProps, isPressed: sel_pos.direction === "block", onClick: () => props.onDirectionChange("block"), icon: icons.group, label: i18n.__("block", "block-collections") })) }), jsxRuntime.jsx(components.ToolbarItem, { children: (itemProps) => (jsxRuntime.jsx(components.Button, { ...itemProps, isPressed: sel_pos.direction === "vertical", onClick: () => props.onDirectionChange("vertical"), icon: icons.stack, label: i18n.__("virtical", "block-collections") })) }), jsxRuntime.jsx(components.ToolbarItem, { children: (itemProps) => (jsxRuntime.jsx(components.Button, { ...itemProps, isPressed: sel_pos.direction === "horizen", onClick: () => props.onDirectionChange("horizen"), icon: flex, label: i18n.__("horizen", "block-collections") })) }), jsxRuntime.jsx(components.ToolbarItem, { children: (itemProps) => (jsxRuntime.jsx(components.Button, { ...itemProps, isPressed: sel_pos.direction === "grid", onClick: () => props.onDirectionChange("grid"), icon: icons.layout, label: i18n.__("grid", "block-collections") })) }), (sel_pos.direction === "horizen" ||
                            sel_pos.direction === "vertical") && (jsxRuntime.jsxs(components.PanelRow, { className: "position_row", children: [jsxRuntime.jsx(components.ToggleControl, { label: i18n.__("reverse", "block-collections"), checked: sel_pos.reverse, onChange: (checked) => props.onReverseChange(checked) }), jsxRuntime.jsx(components.ToggleControl, { label: i18n.__("wrap", "block-collections"), checked: sel_pos.wrap, onChange: (checked) => props.onWrapChange(checked) })] }))] }), sel_pos.direction !== "block" && sel_pos.direction !== "grid" && (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [isMobile ? (jsxRuntime.jsx("p", { children: i18n.__("InnerBlock Main Axis(Mobile)", "block-collections") })) : (jsxRuntime.jsx("p", { children: i18n.__("InnerBlock Main Axis(DeskTop)", "block-collections") })), jsxRuntime.jsxs(components.ToolbarGroup, { children: [jsxRuntime.jsx(components.ToolbarItem, { children: (itemProps) => (jsxRuntime.jsx(components.Button, { ...itemProps, isPressed: sel_pos.inner_align === "flex-start", onClick: () => props.onFlexChange("flex-start", "inner_align"), icon: start_icon, label: start_tip })) }), jsxRuntime.jsx(components.ToolbarItem, { children: (itemProps) => (jsxRuntime.jsx(components.Button, { ...itemProps, isPressed: sel_pos.inner_align === "center", onClick: () => props.onFlexChange("center", "inner_align"), icon: center_icon, label: i18n.__("center alignment", "block-collections") })) }), jsxRuntime.jsx(components.ToolbarItem, { children: (itemProps) => (jsxRuntime.jsx(components.Button, { ...itemProps, isPressed: sel_pos.inner_align === "flex-end", onClick: () => props.onFlexChange("flex-end", "inner_align"), icon: end_icon, label: end_tip })) }), jsxRuntime.jsx(components.ToolbarItem, { children: (itemProps) => (jsxRuntime.jsx(components.Button, { ...itemProps, isPressed: sel_pos.inner_align === "space-between", onClick: () => props.onFlexChange("space-between", "inner_align"), icon: between_icon, label: i18n.__("stretch", "block-collections") })) }), jsxRuntime.jsx(components.ToolbarItem, { children: (itemProps) => (jsxRuntime.jsx(components.Button, { ...itemProps, isPressed: sel_pos.inner_align === "space-around", onClick: () => props.onFlexChange("space-around", "inner_align"), icon: around_icon, label: i18n.__("around stretch", "block-collections") })) })] })] })), !isSubmenu &&
                    (isMobile ? (jsxRuntime.jsx("p", { children: i18n.__("InnerBlock Cross Axis(Mobile)", "block-collections") })) : (jsxRuntime.jsx("p", { children: i18n.__("InnerBlock Cross Axis(DeskTop)", "block-collections") }))), !isSubmenu && (jsxRuntime.jsxs(components.ToolbarGroup, { children: [jsxRuntime.jsx(components.ToolbarItem, { children: (itemProps) => (jsxRuntime.jsx(components.Button, { ...itemProps, isPressed: sel_pos.inner_items === "flex-start", onClick: () => props.onFlexChange("flex-start", "inner_items"), icon: start_cross, label: cross_start_tip })) }), jsxRuntime.jsx(components.ToolbarItem, { children: (itemProps) => (jsxRuntime.jsx(components.Button, { ...itemProps, isPressed: sel_pos.inner_items === "center", onClick: () => props.onFlexChange("center", "inner_items"), icon: center_cross, label: i18n.__("center alignment", "block-collections") })) }), jsxRuntime.jsx(components.ToolbarItem, { children: (itemProps) => (jsxRuntime.jsx(components.Button, { ...itemProps, isPressed: sel_pos.inner_items === "flex-end", onClick: () => props.onFlexChange("flex-end", "inner_items"), icon: end_cross, label: cross_end_tip })) }), jsxRuntime.jsx(components.ToolbarItem, { children: (itemProps) => (jsxRuntime.jsx(components.Button, { ...itemProps, isPressed: sel_pos.inner_items === "stretch", onClick: () => props.onFlexChange("stretch", "inner_items"), icon: stretch, label: i18n.__("beteen stretch", "block-collections") })) })] })), isContainer && (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [isMobile ? (jsxRuntime.jsx("p", { children: i18n.__("Alignment in container(Mobile)", "block-collections") })) : (jsxRuntime.jsx("p", { children: i18n.__("Alignment in container(DeskTop)", "block-collections") })), jsxRuntime.jsxs(components.ToolbarGroup, { children: [jsxRuntime.jsx(components.ToolbarItem, { children: (itemProps) => (jsxRuntime.jsx(components.Button, { ...itemProps, isPressed: direction === "row"
                                            ? sel_pos.outer_vertical === "self-start"
                                            : sel_pos.outer_align === "left", onClick: direction === "row"
                                            ? () => props.onVerticalChange("self-start")
                                            : () => props.onAlignChange("left"), icon: direction === "row" ? upper : icons.justifyLeft, label: direction === "row"
                                            ? i18n.__("upper alignment", "block-collections")
                                            : i18n.__("left alignment", "block-collections") })) }), jsxRuntime.jsx(components.ToolbarItem, { children: (itemProps) => (jsxRuntime.jsx(components.Button, { ...itemProps, isPressed: direction === "row"
                                            ? sel_pos.outer_vertical === "center"
                                            : sel_pos.outer_align === "center", onClick: direction === "row"
                                            ? () => props.onVerticalChange("center")
                                            : () => props.onAlignChange("center"), icon: direction === "row" ? middle : icons.justifyCenter, label: i18n.__("center alignment", "block-collections") })) }), jsxRuntime.jsx(components.ToolbarItem, { children: (itemProps) => (jsxRuntime.jsx(components.Button, { ...itemProps, isPressed: direction === "row"
                                            ? sel_pos.outer_vertical === "self-end"
                                            : sel_pos.outer_align === "right", onClick: direction === "row"
                                            ? () => props.onVerticalChange("self-end")
                                            : () => props.onAlignChange("right"), icon: direction === "row" ? lower : icons.justifyRight, label: direction === "row"
                                            ? i18n.__("lower alignment", "block-collections")
                                            : i18n.__("right alignment", "block-collections") })) }), jsxRuntime.jsx(components.ToolbarItem, { children: (itemProps) => (jsxRuntime.jsx(components.Button, { ...itemProps, isPressed: sel_pos.outer_vertical === "stretch", onClick: direction === "row"
                                            ? () => props.onVerticalChange("stretch")
                                            : () => props.onAlignChange("stretch"), icon: direction === "row" ? vert_between : icons.justifyStretch, label: i18n.__("stretch", "block-collections") })) })] })] })), jsxRuntime.jsx(BlockWidth, { attributes: attributes, isMobile: isMobile, isSubmenu: isSubmenu, onWidthChange: (key, widthVal) => props.onWidthChange(key, widthVal), onFreeWidthChange: (key, freeVal) => props.onFreeWidthChange(key, freeVal) }), isFlexItem && (jsxRuntime.jsxs(components.PanelRow, { className: "position_row", children: [jsxRuntime.jsx(components.TextControl, { label: i18n.__("grow", "block-collections"), value: sel_pos.flex?.grow, onChange: (newValue) => {
                                const flexObj = {
                                    grow: newValue,
                                    shrink: sel_pos.flex?.shrink,
                                    basis: sel_pos.flex?.basis,
                                };
                                props.onFlexItemChange(flexObj);
                            } }), jsxRuntime.jsx(components.TextControl, { label: i18n.__("shrink", "block-collections"), value: sel_pos.flex?.shrink, onChange: (newValue) => {
                                const flexObj = {
                                    grow: sel_pos.flex?.grow,
                                    shrink: newValue,
                                    basis: sel_pos.flex?.basis,
                                };
                                props.onFlexItemChange(flexObj);
                            } }), jsxRuntime.jsx(components.TextControl, { label: i18n.__("basis", "block-collections"), value: sel_pos.flex?.basis, onChange: (newValue) => {
                                const flexObj = {
                                    grow: sel_pos.flex?.grow,
                                    shrink: sel_pos.flex?.shrink,
                                    basis: newValue,
                                };
                                props.onFlexItemChange(flexObj);
                            } })] })), jsxRuntime.jsx(BlockHeight, { attributes: attributes, isMobile: isMobile, onHeightChange: (heightVal) => props.onHeightChange(heightVal), onFreeHeightChange: (freeVal) => props.onFreeHeightChange(freeVal) }), sel_pos.direction === "grid" && (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [isMobile ? (jsxRuntime.jsx("p", { children: i18n.__("Grid Info settings(Mobile)", "block-collections") })) : (jsxRuntime.jsx("p", { children: i18n.__("Grid Info settings(DeskTop)", "block-collections") })), jsxRuntime.jsx(components.Button, { variant: "primary", onClick: openGridModal, children: i18n.__("Open Setting Modal", "block-collections") }), isGridModalOpen && (jsxRuntime.jsx(components.Modal, { title: "Grid Info settings", onRequestClose: closeGridModal, children: jsxRuntime.jsx(GridControls.default, { attributes: sel_pos.grid_info, clientId: clientId, onChange: (newValue) => {
                                    props.onGridChange(newValue);
                                } }) }))] })), jsxRuntime.jsx("div", { className: "itmar_title_type", children: jsxRuntime.jsx(components.RadioControl, { label: i18n.__("Position Type", "block-collections"), selected: positionType, options: [
                            { label: i18n.__("Static", "block-collections"), value: "staic" },
                            {
                                label: i18n.__("Relative", "block-collections"),
                                value: "relative",
                            },
                            {
                                label: i18n.__("Absolute", "block-collections"),
                                value: "absolute",
                            },
                            { label: i18n.__("Fix", "block-collections"), value: "fixed" },
                            { label: i18n.__("Sticky", "block-collections"), value: "sticky" },
                        ], onChange: (newVal) => {
                            props.onPositionChange(newVal);
                        } }) }), positionType === "absolute" && !isParallax && (jsxRuntime.jsx(components.ToggleControl, { label: i18n.__("Center Vertically and Horizontally", "block-collections"), checked: isPosCenter, onChange: (newVal) => {
                        props.onIsPosCenterChange(newVal);
                    } })), ((positionType === "absolute" && !isPosCenter) ||
                    positionType === "fixed" ||
                    positionType === "sticky") && (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [isMobile ? (jsxRuntime.jsx("p", { children: i18n.__("Block Position(Mobile)", "block-collections") })) : (jsxRuntime.jsx("p", { children: i18n.__("Block Position(DeskTop)", "block-collections") })), jsxRuntime.jsxs(components.PanelBody, { title: i18n.__("Vertical", "block-collections"), initialOpen: true, children: [!sel_pos.posValue?.isVertCenter && (jsxRuntime.jsxs(components.PanelRow, { className: "position_row", children: [jsxRuntime.jsx(components.ComboboxControl, { options: [
                                                { value: "top", label: "Top" },
                                                { value: "bottom", label: "Bottom" },
                                            ], value: sel_pos.posValue?.vertBase || "top", onChange: (newValue) => {
                                                const newValObj = {
                                                    ...(sel_pos.posValue || {}),
                                                    vertBase: newValue,
                                                };
                                                props.onPosValueChange(newValObj);
                                            } }), jsxRuntime.jsx(components.__experimentalUnitControl, { dragDirection: "e", onChange: (newValue) => {
                                                const newValObj = {
                                                    ...(sel_pos.posValue || {}),
                                                    vertValue: newValue,
                                                };
                                                props.onPosValueChange(newValObj);
                                            }, value: sel_pos.posValue?.vertValue || "3em" })] })), !isParallax && (jsxRuntime.jsx(components.ToggleControl, { label: i18n.__("Is Center", "block-collections"), checked: sel_pos.posValue?.isVertCenter, onChange: (newValue) => {
                                        const newValObj = {
                                            ...(sel_pos.posValue || {}),
                                            isVertCenter: newValue,
                                        };
                                        props.onPosValueChange(newValObj);
                                    } }))] }), jsxRuntime.jsxs(components.PanelBody, { title: i18n.__("Horizon", "block-collections"), initialOpen: true, children: [!sel_pos.posValue?.isHorCenter && (jsxRuntime.jsxs(components.PanelRow, { className: "position_row", children: [jsxRuntime.jsx(components.ComboboxControl, { options: [
                                                { value: "left", label: "Left" },
                                                { value: "right", label: "Right" },
                                            ], value: sel_pos.posValue?.horBase || "left", onChange: (newValue) => {
                                                const newValObj = {
                                                    ...(sel_pos.posValue || {}),
                                                    horBase: newValue,
                                                };
                                                props.onPosValueChange(newValObj);
                                            } }), jsxRuntime.jsx(components.__experimentalUnitControl, { dragDirection: "e", onChange: (newValue) => {
                                                const newValObj = {
                                                    ...(sel_pos.posValue || {}),
                                                    horValue: newValue,
                                                };
                                                props.onPosValueChange(newValObj);
                                            }, value: sel_pos.posValue?.horValue || "3em" })] })), !isParallax && (jsxRuntime.jsx(components.ToggleControl, { label: i18n.__("Is Center", "block-collections"), checked: sel_pos.posValue?.isHorCenter, onChange: (newValue) => {
                                        const newValObj = {
                                            ...(sel_pos.posValue || {}),
                                            isHorCenter: newValue,
                                        };
                                        props.onPosValueChange(newValObj);
                                    } }))] })] }))] }) }));
}
function BlockWidth(props) {
    const { attributes, isMobile } = props;
    const { default_val, mobile_val } = attributes;
    //モバイルかデスクトップか
    const sel_pos = isMobile ? mobile_val : default_val;
    // 翻訳が必要な文字列を直接指定
    const blockMaxWidthMobile = i18n.__("Block Max Width(Mobile)", "block-collections");
    const blockWidthMobile = i18n.__("Block Width(Mobile)", "block-collections");
    const blockMaxWidthDesktop = i18n.__("Block Max Width(DeskTop)", "block-collections");
    const blockWidthDesktop = i18n.__("Block Width(DeskTop)", "block-collections");
    // ラベル
    const widthLabel = isMobile ? blockWidthMobile : blockWidthDesktop;
    const maxWidthLabel = isMobile ? blockMaxWidthMobile : blockMaxWidthDesktop;
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx("p", { children: widthLabel }), jsxRuntime.jsxs(components.ToolbarGroup, { children: [jsxRuntime.jsx(components.ToolbarItem, { children: (itemProps) => (jsxRuntime.jsx(components.Button, { ...itemProps, isPressed: sel_pos.width_val === "full", onClick: () => props.onWidthChange("width_val", "full"), text: "full" })) }), jsxRuntime.jsx(components.ToolbarItem, { children: (itemProps) => (jsxRuntime.jsx(components.Button, { ...itemProps, isPressed: sel_pos.width_val === "fit", onClick: () => props.onWidthChange("width_val", "fit"), text: "fit" })) }), jsxRuntime.jsx(components.ToolbarItem, { children: (itemProps) => (jsxRuntime.jsx(components.Button, { ...itemProps, isPressed: sel_pos.width_val === "wideSize", onClick: () => props.onWidthChange("width_val", "wideSize"), icon: icons.stretchWide, label: i18n.__("Wide Size", "block-collections") })) }), jsxRuntime.jsx(components.ToolbarItem, { children: (itemProps) => (jsxRuntime.jsx(components.Button, { ...itemProps, isPressed: sel_pos.width_val === "contentSize", onClick: () => props.onWidthChange("width_val", "contentSize"), icon: icons.positionCenter, label: i18n.__("Content Size", "block-collections") })) }), jsxRuntime.jsx(components.ToolbarItem, { children: (itemProps) => (jsxRuntime.jsx(components.Button, { ...itemProps, isPressed: sel_pos.width_val === "free", onClick: () => props.onWidthChange("width_val", "free"), text: "free" })) })] }), sel_pos.width_val === "free" && (jsxRuntime.jsx(components.__experimentalUnitControl, { dragDirection: "e", onChange: (newValue) => props.onFreeWidthChange("free_width", newValue ?? ""), value: sel_pos.free_width })), jsxRuntime.jsx("p", { children: maxWidthLabel }), jsxRuntime.jsxs(components.ToolbarGroup, { children: [jsxRuntime.jsx(components.ToolbarItem, { children: (itemProps) => (jsxRuntime.jsx(components.Button, { ...itemProps, isPressed: sel_pos.max_width === "full", onClick: () => props.onWidthChange("max_width", "full"), text: "full" })) }), jsxRuntime.jsx(components.ToolbarItem, { children: (itemProps) => (jsxRuntime.jsx(components.Button, { ...itemProps, isPressed: sel_pos.max_width === "fit", onClick: () => props.onWidthChange("max_width", "fit"), text: "fit" })) }), jsxRuntime.jsx(components.ToolbarItem, { children: (itemProps) => (jsxRuntime.jsx(components.Button, { ...itemProps, isPressed: sel_pos.max_width === "wideSize", onClick: () => props.onWidthChange("max_width", "wideSize"), icon: icons.stretchWide, label: i18n.__("Wide Size", "block-collections") })) }), jsxRuntime.jsx(components.ToolbarItem, { children: (itemProps) => (jsxRuntime.jsx(components.Button, { ...itemProps, isPressed: sel_pos.max_width === "contentSize", onClick: () => props.onWidthChange("max_width", "contentSize"), icon: icons.positionCenter, label: i18n.__("Content Size", "block-collections") })) }), jsxRuntime.jsx(components.ToolbarItem, { children: (itemProps) => (jsxRuntime.jsx(components.Button, { ...itemProps, isPressed: sel_pos.max_width === "free", onClick: () => props.onWidthChange("max_width", "free"), text: "free" })) })] }), sel_pos.max_width === "free" && (jsxRuntime.jsx(components.__experimentalUnitControl, { dragDirection: "e", onChange: (newValue) => props.onFreeWidthChange("max_free_width", newValue ?? ""), value: sel_pos.max_free_width }))] }));
}
function BlockHeight(props) {
    const { attributes, isMobile } = props;
    const { default_val, mobile_val } = attributes;
    //モバイルかデスクトップか
    const sel_pos = isMobile ? mobile_val : default_val;
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [isMobile ? (jsxRuntime.jsx("p", { children: i18n.__("Block Height(Mobile)", "block-collections") })) : (jsxRuntime.jsx("p", { children: i18n.__("Block Height(DeskTop)", "block-collections") })), jsxRuntime.jsxs(components.ToolbarGroup, { children: [jsxRuntime.jsx(components.ToolbarItem, { children: (itemProps) => (jsxRuntime.jsx(components.Button, { ...itemProps, isPressed: sel_pos.height_val === "full", onClick: () => props.onHeightChange("full"), text: "full" })) }), jsxRuntime.jsx(components.ToolbarItem, { children: (itemProps) => (jsxRuntime.jsx(components.Button, { ...itemProps, isPressed: sel_pos.height_val === "fit", onClick: () => props.onHeightChange("fit"), text: "fit" })) }), jsxRuntime.jsx(components.ToolbarItem, { children: (itemProps) => (jsxRuntime.jsx(components.Button, { ...itemProps, isPressed: sel_pos.height_val === "free", onClick: () => props.onHeightChange("free"), text: "free" })) }), jsxRuntime.jsx(components.ToolbarItem, { children: (itemProps) => (jsxRuntime.jsx(components.Button, { ...itemProps, isPressed: sel_pos.height_val === "auto", onClick: () => props.onHeightChange("auto"), text: "auto" })) })] }), sel_pos.height_val === "free" && (jsxRuntime.jsx(components.__experimentalUnitControl, { dragDirection: "e", onChange: (newValue) => props.onFreeHeightChange(newValue ?? ""), value: sel_pos.free_height }))] }));
}

exports.BlockHeight = BlockHeight;
exports.BlockWidth = BlockWidth;
exports.default = BlockPlace;
//# sourceMappingURL=BlockPlace.js.map
