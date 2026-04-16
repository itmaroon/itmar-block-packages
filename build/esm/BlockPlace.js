import { jsx, Fragment, jsxs } from 'react/jsx-runtime';
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { Icon, PanelBody, ToolbarGroup, ToolbarItem, Button, PanelRow, ToggleControl, TextControl, Modal, RadioControl, ComboboxControl, __experimentalUnitControl } from '@wordpress/components';
import { stack, justifyLeft, justifyCenter, justifyRight, justifyStretch, justifySpaceBetween, group, layout, stretchWide, positionCenter } from '@wordpress/icons';
import GridControls from './GridControls.js';

//横並びのアイコン
const flex = jsx(Icon, { icon: stack, className: "rotate-icon" });
//上よせアイコン
const upper = jsx(Icon, { icon: justifyLeft, className: "rotate-icon" });
//中央よせのアイコン
const middle = jsx(Icon, { icon: justifyCenter, className: "rotate-icon" });
//下よせのアイコン
const lower = jsx(Icon, { icon: justifyRight, className: "rotate-icon" });
//上下一杯に伸ばすアイコン
const vert_between = jsx(Icon, { icon: justifyStretch, className: "rotate-icon" });
//上下均等に伸ばすアイコン
const vert_around = jsx(Icon, { icon: justifySpaceBetween, className: "rotate-icon" });
function BlockPlace(props) {
    const { attributes, clientId, blockRef, isMobile, isSubmenu, isParallax } = props;
    const { positionType, isPosCenter, default_val, mobile_val } = attributes;
    //モバイルかデスクトップか
    const sel_pos = isMobile ? mobile_val : default_val;
    //配置アイコンの選択
    const start_icon = sel_pos.direction === "vertical" ? upper : justifyLeft;
    const center_icon = sel_pos.direction === "vertical" ? middle : justifyCenter;
    const end_icon = sel_pos.direction === "vertical" ? lower : justifyRight;
    const start_cross = sel_pos.direction === "vertical" ? justifyLeft : upper;
    const center_cross = sel_pos.direction === "vertical" ? justifyCenter : middle;
    const end_cross = sel_pos.direction === "vertical" ? justifyRight : lower;
    const stretch = sel_pos.direction === "vertical" ? justifyStretch : vert_between;
    const between_icon = sel_pos.direction === "vertical" ? vert_between : justifyStretch;
    const around_icon = sel_pos.direction === "vertical" ? vert_around : justifySpaceBetween;
    //ツールチップの選択
    const start_tip = sel_pos.direction === "vertical"
        ? __("upper alignment", "block-collections")
        : __("left alignment", "block-collections");
    const end_tip = sel_pos.direction === "vertical"
        ? __("lower alignment", "block-collections")
        : __("right alignment", "block-collections");
    const cross_start_tip = sel_pos.direction === "vertical"
        ? __("left alignment", "block-collections")
        : __("upper alignment", "block-collections");
    const cross_end_tip = sel_pos.direction === "vertical"
        ? __("right alignment", "block-collections")
        : __("lower alignment", "block-collections");
    const [isContainer, setIsContainer] = useState(false);
    const [isFlexItem, setIsFlexItem] = useState(false);
    const [direction, setDirection] = useState("row");
    useEffect(() => {
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
    const [isGridModalOpen, setIsGridModalOpen] = useState(false);
    const openGridModal = () => setIsGridModalOpen(true);
    const closeGridModal = () => setIsGridModalOpen(false);
    // 翻訳が必要な文字列を直接指定
    __("Block Max Width(Mobile)", "block-collections");
    __("Block Width(Mobile)", "block-collections");
    __("Block Max Width(DeskTop)", "block-collections");
    __("Block Width(DeskTop)", "block-collections");
    return (jsx(Fragment, { children: jsxs(PanelBody, { title: __("Block placement", "block-collections"), initialOpen: false, className: "itmar_group_direction", children: [isMobile ? (jsx("p", { children: __("InnerBlock direction(Mobile)", "block-collections") })) : (jsx("p", { children: __("InnerBlock direction(DeskTop)", "block-collections") })), jsxs(ToolbarGroup, { children: [jsx(ToolbarItem, { children: (itemProps) => (jsx(Button, { ...itemProps, isPressed: sel_pos.direction === "block", onClick: () => props.onDirectionChange("block"), icon: group, label: __("block", "block-collections") })) }), jsx(ToolbarItem, { children: (itemProps) => (jsx(Button, { ...itemProps, isPressed: sel_pos.direction === "vertical", onClick: () => props.onDirectionChange("vertical"), icon: stack, label: __("virtical", "block-collections") })) }), jsx(ToolbarItem, { children: (itemProps) => (jsx(Button, { ...itemProps, isPressed: sel_pos.direction === "horizen", onClick: () => props.onDirectionChange("horizen"), icon: flex, label: __("horizen", "block-collections") })) }), jsx(ToolbarItem, { children: (itemProps) => (jsx(Button, { ...itemProps, isPressed: sel_pos.direction === "grid", onClick: () => props.onDirectionChange("grid"), icon: layout, label: __("grid", "block-collections") })) }), (sel_pos.direction === "horizen" ||
                            sel_pos.direction === "vertical") && (jsxs(PanelRow, { className: "position_row", children: [jsx(ToggleControl, { label: __("reverse", "block-collections"), checked: sel_pos.reverse, onChange: (checked) => props.onReverseChange(checked) }), jsx(ToggleControl, { label: __("wrap", "block-collections"), checked: sel_pos.wrap, onChange: (checked) => props.onWrapChange(checked) })] }))] }), sel_pos.direction !== "block" && sel_pos.direction !== "grid" && (jsxs(Fragment, { children: [isMobile ? (jsx("p", { children: __("InnerBlock Main Axis(Mobile)", "block-collections") })) : (jsx("p", { children: __("InnerBlock Main Axis(DeskTop)", "block-collections") })), jsxs(ToolbarGroup, { children: [jsx(ToolbarItem, { children: (itemProps) => (jsx(Button, { ...itemProps, isPressed: sel_pos.inner_align === "flex-start", onClick: () => props.onFlexChange("flex-start", "inner_align"), icon: start_icon, label: start_tip })) }), jsx(ToolbarItem, { children: (itemProps) => (jsx(Button, { ...itemProps, isPressed: sel_pos.inner_align === "center", onClick: () => props.onFlexChange("center", "inner_align"), icon: center_icon, label: __("center alignment", "block-collections") })) }), jsx(ToolbarItem, { children: (itemProps) => (jsx(Button, { ...itemProps, isPressed: sel_pos.inner_align === "flex-end", onClick: () => props.onFlexChange("flex-end", "inner_align"), icon: end_icon, label: end_tip })) }), jsx(ToolbarItem, { children: (itemProps) => (jsx(Button, { ...itemProps, isPressed: sel_pos.inner_align === "space-between", onClick: () => props.onFlexChange("space-between", "inner_align"), icon: between_icon, label: __("stretch", "block-collections") })) }), jsx(ToolbarItem, { children: (itemProps) => (jsx(Button, { ...itemProps, isPressed: sel_pos.inner_align === "space-around", onClick: () => props.onFlexChange("space-around", "inner_align"), icon: around_icon, label: __("around stretch", "block-collections") })) })] })] })), !isSubmenu &&
                    (isMobile ? (jsx("p", { children: __("InnerBlock Cross Axis(Mobile)", "block-collections") })) : (jsx("p", { children: __("InnerBlock Cross Axis(DeskTop)", "block-collections") }))), !isSubmenu && (jsxs(ToolbarGroup, { children: [jsx(ToolbarItem, { children: (itemProps) => (jsx(Button, { ...itemProps, isPressed: sel_pos.inner_items === "flex-start", onClick: () => props.onFlexChange("flex-start", "inner_items"), icon: start_cross, label: cross_start_tip })) }), jsx(ToolbarItem, { children: (itemProps) => (jsx(Button, { ...itemProps, isPressed: sel_pos.inner_items === "center", onClick: () => props.onFlexChange("center", "inner_items"), icon: center_cross, label: __("center alignment", "block-collections") })) }), jsx(ToolbarItem, { children: (itemProps) => (jsx(Button, { ...itemProps, isPressed: sel_pos.inner_items === "flex-end", onClick: () => props.onFlexChange("flex-end", "inner_items"), icon: end_cross, label: cross_end_tip })) }), jsx(ToolbarItem, { children: (itemProps) => (jsx(Button, { ...itemProps, isPressed: sel_pos.inner_items === "stretch", onClick: () => props.onFlexChange("stretch", "inner_items"), icon: stretch, label: __("beteen stretch", "block-collections") })) })] })), isContainer && (jsxs(Fragment, { children: [isMobile ? (jsx("p", { children: __("Alignment in container(Mobile)", "block-collections") })) : (jsx("p", { children: __("Alignment in container(DeskTop)", "block-collections") })), jsxs(ToolbarGroup, { children: [jsx(ToolbarItem, { children: (itemProps) => (jsx(Button, { ...itemProps, isPressed: direction === "row"
                                            ? sel_pos.outer_vertical === "self-start"
                                            : sel_pos.outer_align === "left", onClick: direction === "row"
                                            ? () => props.onVerticalChange("self-start")
                                            : () => props.onAlignChange("left"), icon: direction === "row" ? upper : justifyLeft, label: direction === "row"
                                            ? __("upper alignment", "block-collections")
                                            : __("left alignment", "block-collections") })) }), jsx(ToolbarItem, { children: (itemProps) => (jsx(Button, { ...itemProps, isPressed: direction === "row"
                                            ? sel_pos.outer_vertical === "center"
                                            : sel_pos.outer_align === "center", onClick: direction === "row"
                                            ? () => props.onVerticalChange("center")
                                            : () => props.onAlignChange("center"), icon: direction === "row" ? middle : justifyCenter, label: __("center alignment", "block-collections") })) }), jsx(ToolbarItem, { children: (itemProps) => (jsx(Button, { ...itemProps, isPressed: direction === "row"
                                            ? sel_pos.outer_vertical === "self-end"
                                            : sel_pos.outer_align === "right", onClick: direction === "row"
                                            ? () => props.onVerticalChange("self-end")
                                            : () => props.onAlignChange("right"), icon: direction === "row" ? lower : justifyRight, label: direction === "row"
                                            ? __("lower alignment", "block-collections")
                                            : __("right alignment", "block-collections") })) }), jsx(ToolbarItem, { children: (itemProps) => (jsx(Button, { ...itemProps, isPressed: sel_pos.outer_vertical === "stretch", onClick: direction === "row"
                                            ? () => props.onVerticalChange("stretch")
                                            : () => props.onAlignChange("stretch"), icon: direction === "row" ? vert_between : justifyStretch, label: __("stretch", "block-collections") })) })] })] })), jsx(BlockWidth, { attributes: attributes, isMobile: isMobile, isSubmenu: isSubmenu, onWidthChange: (key, widthVal) => props.onWidthChange(key, widthVal), onFreeWidthChange: (key, freeVal) => props.onFreeWidthChange(key, freeVal) }), isFlexItem && (jsxs(PanelRow, { className: "position_row", children: [jsx(TextControl, { label: __("grow", "block-collections"), value: sel_pos.flex?.grow, onChange: (newValue) => {
                                const flexObj = {
                                    grow: newValue,
                                    shrink: sel_pos.flex?.shrink,
                                    basis: sel_pos.flex?.basis,
                                };
                                props.onFlexItemChange(flexObj);
                            } }), jsx(TextControl, { label: __("shrink", "block-collections"), value: sel_pos.flex?.shrink, onChange: (newValue) => {
                                const flexObj = {
                                    grow: sel_pos.flex?.grow,
                                    shrink: newValue,
                                    basis: sel_pos.flex?.basis,
                                };
                                props.onFlexItemChange(flexObj);
                            } }), jsx(TextControl, { label: __("basis", "block-collections"), value: sel_pos.flex?.basis, onChange: (newValue) => {
                                const flexObj = {
                                    grow: sel_pos.flex?.grow,
                                    shrink: sel_pos.flex?.shrink,
                                    basis: newValue,
                                };
                                props.onFlexItemChange(flexObj);
                            } })] })), jsx(BlockHeight, { attributes: attributes, isMobile: isMobile, onHeightChange: (heightVal) => props.onHeightChange(heightVal), onFreeHeightChange: (freeVal) => props.onFreeHeightChange(freeVal) }), sel_pos.direction === "grid" && (jsxs(Fragment, { children: [isMobile ? (jsx("p", { children: __("Grid Info settings(Mobile)", "block-collections") })) : (jsx("p", { children: __("Grid Info settings(DeskTop)", "block-collections") })), jsx(Button, { variant: "primary", onClick: openGridModal, children: __("Open Setting Modal", "block-collections") }), isGridModalOpen && (jsx(Modal, { title: "Grid Info settings", onRequestClose: closeGridModal, children: jsx(GridControls, { attributes: sel_pos.grid_info, clientId: clientId, onChange: (newValue) => {
                                    props.onGridChange(newValue);
                                } }) }))] })), jsx("div", { className: "itmar_title_type", children: jsx(RadioControl, { label: __("Position Type", "block-collections"), selected: positionType, options: [
                            { label: __("Static", "block-collections"), value: "staic" },
                            {
                                label: __("Relative", "block-collections"),
                                value: "relative",
                            },
                            {
                                label: __("Absolute", "block-collections"),
                                value: "absolute",
                            },
                            { label: __("Fix", "block-collections"), value: "fixed" },
                            { label: __("Sticky", "block-collections"), value: "sticky" },
                        ], onChange: (newVal) => {
                            props.onPositionChange(newVal);
                        } }) }), positionType === "absolute" && !isParallax && (jsx(ToggleControl, { label: __("Center Vertically and Horizontally", "block-collections"), checked: isPosCenter, onChange: (newVal) => {
                        props.onIsPosCenterChange(newVal);
                    } })), ((positionType === "absolute" && !isPosCenter) ||
                    positionType === "fixed" ||
                    positionType === "sticky") && (jsxs(Fragment, { children: [isMobile ? (jsx("p", { children: __("Block Position(Mobile)", "block-collections") })) : (jsx("p", { children: __("Block Position(DeskTop)", "block-collections") })), jsxs(PanelBody, { title: __("Vertical", "block-collections"), initialOpen: true, children: [!sel_pos.posValue?.isVertCenter && (jsxs(PanelRow, { className: "position_row", children: [jsx(ComboboxControl, { options: [
                                                { value: "top", label: "Top" },
                                                { value: "bottom", label: "Bottom" },
                                            ], value: sel_pos.posValue?.vertBase || "top", onChange: (newValue) => {
                                                const newValObj = {
                                                    ...(sel_pos.posValue || {}),
                                                    vertBase: newValue,
                                                };
                                                props.onPosValueChange(newValObj);
                                            } }), jsx(__experimentalUnitControl, { dragDirection: "e", onChange: (newValue) => {
                                                const newValObj = {
                                                    ...(sel_pos.posValue || {}),
                                                    vertValue: newValue,
                                                };
                                                props.onPosValueChange(newValObj);
                                            }, value: sel_pos.posValue?.vertValue || "3em" })] })), !isParallax && (jsx(ToggleControl, { label: __("Is Center", "block-collections"), checked: sel_pos.posValue?.isVertCenter, onChange: (newValue) => {
                                        const newValObj = {
                                            ...(sel_pos.posValue || {}),
                                            isVertCenter: newValue,
                                        };
                                        props.onPosValueChange(newValObj);
                                    } }))] }), jsxs(PanelBody, { title: __("Horizon", "block-collections"), initialOpen: true, children: [!sel_pos.posValue?.isHorCenter && (jsxs(PanelRow, { className: "position_row", children: [jsx(ComboboxControl, { options: [
                                                { value: "left", label: "Left" },
                                                { value: "right", label: "Right" },
                                            ], value: sel_pos.posValue?.horBase || "left", onChange: (newValue) => {
                                                const newValObj = {
                                                    ...(sel_pos.posValue || {}),
                                                    horBase: newValue,
                                                };
                                                props.onPosValueChange(newValObj);
                                            } }), jsx(__experimentalUnitControl, { dragDirection: "e", onChange: (newValue) => {
                                                const newValObj = {
                                                    ...(sel_pos.posValue || {}),
                                                    horValue: newValue,
                                                };
                                                props.onPosValueChange(newValObj);
                                            }, value: sel_pos.posValue?.horValue || "3em" })] })), !isParallax && (jsx(ToggleControl, { label: __("Is Center", "block-collections"), checked: sel_pos.posValue?.isHorCenter, onChange: (newValue) => {
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
    const blockMaxWidthMobile = __("Block Max Width(Mobile)", "block-collections");
    const blockWidthMobile = __("Block Width(Mobile)", "block-collections");
    const blockMaxWidthDesktop = __("Block Max Width(DeskTop)", "block-collections");
    const blockWidthDesktop = __("Block Width(DeskTop)", "block-collections");
    // ラベル
    const widthLabel = isMobile ? blockWidthMobile : blockWidthDesktop;
    const maxWidthLabel = isMobile ? blockMaxWidthMobile : blockMaxWidthDesktop;
    return (jsxs(Fragment, { children: [jsx("p", { children: widthLabel }), jsxs(ToolbarGroup, { children: [jsx(ToolbarItem, { children: (itemProps) => (jsx(Button, { ...itemProps, isPressed: sel_pos.width_val === "full", onClick: () => props.onWidthChange("width_val", "full"), text: "full" })) }), jsx(ToolbarItem, { children: (itemProps) => (jsx(Button, { ...itemProps, isPressed: sel_pos.width_val === "fit", onClick: () => props.onWidthChange("width_val", "fit"), text: "fit" })) }), jsx(ToolbarItem, { children: (itemProps) => (jsx(Button, { ...itemProps, isPressed: sel_pos.width_val === "wideSize", onClick: () => props.onWidthChange("width_val", "wideSize"), icon: stretchWide, label: __("Wide Size", "block-collections") })) }), jsx(ToolbarItem, { children: (itemProps) => (jsx(Button, { ...itemProps, isPressed: sel_pos.width_val === "contentSize", onClick: () => props.onWidthChange("width_val", "contentSize"), icon: positionCenter, label: __("Content Size", "block-collections") })) }), jsx(ToolbarItem, { children: (itemProps) => (jsx(Button, { ...itemProps, isPressed: sel_pos.width_val === "free", onClick: () => props.onWidthChange("width_val", "free"), text: "free" })) })] }), sel_pos.width_val === "free" && (jsx(__experimentalUnitControl, { dragDirection: "e", onChange: (newValue) => props.onFreeWidthChange("free_width", newValue ?? ""), value: sel_pos.free_width })), jsx("p", { children: maxWidthLabel }), jsxs(ToolbarGroup, { children: [jsx(ToolbarItem, { children: (itemProps) => (jsx(Button, { ...itemProps, isPressed: sel_pos.max_width === "full", onClick: () => props.onWidthChange("max_width", "full"), text: "full" })) }), jsx(ToolbarItem, { children: (itemProps) => (jsx(Button, { ...itemProps, isPressed: sel_pos.max_width === "fit", onClick: () => props.onWidthChange("max_width", "fit"), text: "fit" })) }), jsx(ToolbarItem, { children: (itemProps) => (jsx(Button, { ...itemProps, isPressed: sel_pos.max_width === "wideSize", onClick: () => props.onWidthChange("max_width", "wideSize"), icon: stretchWide, label: __("Wide Size", "block-collections") })) }), jsx(ToolbarItem, { children: (itemProps) => (jsx(Button, { ...itemProps, isPressed: sel_pos.max_width === "contentSize", onClick: () => props.onWidthChange("max_width", "contentSize"), icon: positionCenter, label: __("Content Size", "block-collections") })) }), jsx(ToolbarItem, { children: (itemProps) => (jsx(Button, { ...itemProps, isPressed: sel_pos.max_width === "free", onClick: () => props.onWidthChange("max_width", "free"), text: "free" })) })] }), sel_pos.max_width === "free" && (jsx(__experimentalUnitControl, { dragDirection: "e", onChange: (newValue) => props.onFreeWidthChange("max_free_width", newValue ?? ""), value: sel_pos.max_free_width }))] }));
}
function BlockHeight(props) {
    const { attributes, isMobile } = props;
    const { default_val, mobile_val } = attributes;
    //モバイルかデスクトップか
    const sel_pos = isMobile ? mobile_val : default_val;
    return (jsxs(Fragment, { children: [isMobile ? (jsx("p", { children: __("Block Height(Mobile)", "block-collections") })) : (jsx("p", { children: __("Block Height(DeskTop)", "block-collections") })), jsxs(ToolbarGroup, { children: [jsx(ToolbarItem, { children: (itemProps) => (jsx(Button, { ...itemProps, isPressed: sel_pos.height_val === "full", onClick: () => props.onHeightChange("full"), text: "full" })) }), jsx(ToolbarItem, { children: (itemProps) => (jsx(Button, { ...itemProps, isPressed: sel_pos.height_val === "fit", onClick: () => props.onHeightChange("fit"), text: "fit" })) }), jsx(ToolbarItem, { children: (itemProps) => (jsx(Button, { ...itemProps, isPressed: sel_pos.height_val === "free", onClick: () => props.onHeightChange("free"), text: "free" })) }), jsx(ToolbarItem, { children: (itemProps) => (jsx(Button, { ...itemProps, isPressed: sel_pos.height_val === "auto", onClick: () => props.onHeightChange("auto"), text: "auto" })) })] }), sel_pos.height_val === "free" && (jsx(__experimentalUnitControl, { dragDirection: "e", onChange: (newValue) => props.onFreeHeightChange(newValue ?? ""), value: sel_pos.free_height }))] }));
}

export { BlockHeight, BlockWidth, BlockPlace as default };
//# sourceMappingURL=BlockPlace.js.map
