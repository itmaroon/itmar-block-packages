import { extends as _extends, objectSpread2 as _objectSpread2 } from './_virtual/_rollupPluginBabelHelpers.js';
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { PanelBody, ToolbarGroup, ToolbarItem, Button, PanelRow, ToggleControl, TextControl, Modal, RadioControl, ComboboxControl, __experimentalUnitControl, Icon } from '@wordpress/components';
import { justifyLeft, justifyCenter, justifyRight, justifyStretch, justifySpaceBetween, group, stack, layout, stretchWide, positionCenter } from '@wordpress/icons';
import GridControls from './GridControls.js';

//横並びのアイコン
var flex = /*#__PURE__*/React.createElement(Icon, {
  icon: stack,
  className: "rotate-icon"
});
//上よせアイコン
var upper = /*#__PURE__*/React.createElement(Icon, {
  icon: justifyLeft,
  className: "rotate-icon"
});
//中央よせのアイコン
var middle = /*#__PURE__*/React.createElement(Icon, {
  icon: justifyCenter,
  className: "rotate-icon"
});
//下よせのアイコン
var lower = /*#__PURE__*/React.createElement(Icon, {
  icon: justifyRight,
  className: "rotate-icon"
});
//上下一杯に伸ばすアイコン
var vert_between = /*#__PURE__*/React.createElement(Icon, {
  icon: justifyStretch,
  className: "rotate-icon"
});
//上下均等に伸ばすアイコン
var vert_around = /*#__PURE__*/React.createElement(Icon, {
  icon: justifySpaceBetween,
  className: "rotate-icon"
});
function BlockPlace(props) {
  var _sel_pos$flex, _sel_pos$flex4, _sel_pos$flex7, _sel_pos$posValue, _sel_pos$posValue2, _sel_pos$posValue3, _sel_pos$posValue4, _sel_pos$posValue5, _sel_pos$posValue6, _sel_pos$posValue7, _sel_pos$posValue8;
  var {
    attributes,
    clientId,
    blockRef,
    isMobile,
    isSubmenu,
    isParallax
  } = props;
  var {
    positionType,
    isPosCenter,
    default_val,
    mobile_val
  } = attributes;

  //モバイルかデスクトップか
  var sel_pos = isMobile ? mobile_val : default_val;

  //配置アイコンの選択

  var start_icon = sel_pos.direction === "vertical" ? upper : justifyLeft;
  var center_icon = sel_pos.direction === "vertical" ? middle : justifyCenter;
  var end_icon = sel_pos.direction === "vertical" ? lower : justifyRight;
  var start_cross = sel_pos.direction === "vertical" ? justifyLeft : upper;
  var center_cross = sel_pos.direction === "vertical" ? justifyCenter : middle;
  var end_cross = sel_pos.direction === "vertical" ? justifyRight : lower;
  var stretch = sel_pos.direction === "vertical" ? justifyStretch : vert_between;
  var between_icon = sel_pos.direction === "vertical" ? vert_between : justifyStretch;
  var around_icon = sel_pos.direction === "vertical" ? vert_around : justifySpaceBetween;
  //ツールチップの選択
  var start_tip = sel_pos.direction === "vertical" ? __("upper alignment", "block-collections") : __("left alignment", "block-collections");
  var end_tip = sel_pos.direction === "vertical" ? __("lower alignment", "block-collections") : __("right alignment", "block-collections");
  var cross_start_tip = sel_pos.direction === "vertical" ? __("left alignment", "block-collections") : __("upper alignment", "block-collections");
  var cross_end_tip = sel_pos.direction === "vertical" ? __("right alignment", "block-collections") : __("lower alignment", "block-collections");
  var [isContainer, setIsContainer] = useState(false);
  var [isFlexItem, setIsFlexItem] = useState(false);
  var [direction, setDirection] = useState("row");
  useEffect(() => {
    if (blockRef.current) {
      var element = blockRef.current;
      var parentElement = element.parentElement;
      var grandparentElement = parentElement === null || parentElement === void 0 ? void 0 : parentElement.parentElement;
      var computedStyle = getComputedStyle(grandparentElement);
      //親要素がFlex又はGridコンテナか
      if (computedStyle.display === "flex" || computedStyle.display === "inline-flex" || computedStyle.display === "grid" || computedStyle.display === "inline-grid") {
        setIsContainer(true);
      }
      //flexの時その方向
      if (computedStyle.display === "flex" || computedStyle.display === "inline-flex") {
        setIsFlexItem(true);
        if (computedStyle.flexDirection === "row" || computedStyle.flexDirection === "row-reverse") {
          setDirection("row");
        } else {
          setDirection("column");
        }
      }
    }
  }, []);

  //GridModalを開く
  var [isGridModalOpen, setIsGridModalOpen] = useState(false);
  var openGridModal = () => setIsGridModalOpen(true);
  var closeGridModal = () => setIsGridModalOpen(false);

  // 翻訳が必要な文字列を直接指定
  __("Block Max Width(Mobile)", "block-collections");
  __("Block Width(Mobile)", "block-collections");
  __("Block Max Width(DeskTop)", "block-collections");
  __("Block Width(DeskTop)", "block-collections");
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PanelBody, {
    title: __("Block placement", "block-collections"),
    initialOpen: false,
    className: "itmar_group_direction"
  }, isMobile ? /*#__PURE__*/React.createElement("p", null, __("InnerBlock direction(Mobile)", "block-collections")) : /*#__PURE__*/React.createElement("p", null, __("InnerBlock direction(DeskTop)", "block-collections")), /*#__PURE__*/React.createElement(ToolbarGroup, null, /*#__PURE__*/React.createElement(ToolbarItem, null, itemProps => /*#__PURE__*/React.createElement(Button, _extends({}, itemProps, {
    isPressed: sel_pos.direction === "block",
    onClick: () => props.onDirectionChange("block"),
    icon: group,
    label: __("block", "block-collections")
  }))), /*#__PURE__*/React.createElement(ToolbarItem, null, itemProps => /*#__PURE__*/React.createElement(Button, _extends({}, itemProps, {
    isPressed: sel_pos.direction === "vertical",
    onClick: () => props.onDirectionChange("vertical"),
    icon: stack,
    label: __("virtical", "block-collections")
  }))), /*#__PURE__*/React.createElement(ToolbarItem, null, itemProps => /*#__PURE__*/React.createElement(Button, _extends({}, itemProps, {
    isPressed: sel_pos.direction === "horizen",
    onClick: () => props.onDirectionChange("horizen"),
    icon: flex,
    label: __("horizen", "block-collections")
  }))), /*#__PURE__*/React.createElement(ToolbarItem, null, itemProps => /*#__PURE__*/React.createElement(Button, _extends({}, itemProps, {
    isPressed: sel_pos.direction === "grid",
    onClick: () => props.onDirectionChange("grid"),
    icon: layout,
    label: __("grid", "block-collections")
  }))), (sel_pos.direction === "horizen" || sel_pos.direction === "vertical") && /*#__PURE__*/React.createElement(PanelRow, {
    className: "position_row"
  }, /*#__PURE__*/React.createElement(ToggleControl, {
    label: __("reverse", "block-collections"),
    checked: sel_pos.reverse,
    onChange: checked => props.onReverseChange(checked)
  }), /*#__PURE__*/React.createElement(ToggleControl, {
    label: __("wrap", "block-collections"),
    checked: sel_pos.wrap,
    onChange: checked => props.onWrapChange(checked)
  }))), sel_pos.direction !== "block" && sel_pos.direction !== "grid" && /*#__PURE__*/React.createElement(React.Fragment, null, isMobile ? /*#__PURE__*/React.createElement("p", null, __("InnerBlock Main Axis(Mobile)", "block-collections")) : /*#__PURE__*/React.createElement("p", null, __("InnerBlock Main Axis(DeskTop)", "block-collections")), /*#__PURE__*/React.createElement(ToolbarGroup, null, /*#__PURE__*/React.createElement(ToolbarItem, null, itemProps => /*#__PURE__*/React.createElement(Button, _extends({}, itemProps, {
    isPressed: sel_pos.inner_align === "flex-start",
    onClick: () => props.onFlexChange("flex-start", "inner_align") //親コンポーネントに通知
    ,
    icon: start_icon,
    label: start_tip
  }))), /*#__PURE__*/React.createElement(ToolbarItem, null, itemProps => /*#__PURE__*/React.createElement(Button, _extends({}, itemProps, {
    isPressed: sel_pos.inner_align === "center",
    onClick: () => props.onFlexChange("center", "inner_align") //親コンポーネントに通知
    ,
    icon: center_icon,
    label: __("center alignment", "block-collections")
  }))), /*#__PURE__*/React.createElement(ToolbarItem, null, itemProps => /*#__PURE__*/React.createElement(Button, _extends({}, itemProps, {
    isPressed: sel_pos.inner_align === "flex-end",
    onClick: () => props.onFlexChange("flex-end", "inner_align") //親コンポーネントに通知
    ,
    icon: end_icon,
    label: end_tip
  }))), /*#__PURE__*/React.createElement(ToolbarItem, null, itemProps => /*#__PURE__*/React.createElement(Button, _extends({}, itemProps, {
    isPressed: sel_pos.inner_align === "space-between",
    onClick: () => props.onFlexChange("space-between", "inner_align") //親コンポーネントに通知
    ,
    icon: between_icon,
    label: __("stretch", "block-collections")
  }))), /*#__PURE__*/React.createElement(ToolbarItem, null, itemProps => /*#__PURE__*/React.createElement(Button, _extends({}, itemProps, {
    isPressed: sel_pos.inner_align === "space-around",
    onClick: () => props.onFlexChange("space-around", "inner_align") //親コンポーネントに通知
    ,
    icon: around_icon,
    label: __("around stretch", "block-collections")
  }))))), !isSubmenu && (isMobile ? /*#__PURE__*/React.createElement("p", null, __("InnerBlock Cross Axis(Mobile)", "block-collections")) : /*#__PURE__*/React.createElement("p", null, __("InnerBlock Cross Axis(DeskTop)", "block-collections"))), !isSubmenu && /*#__PURE__*/React.createElement(ToolbarGroup, null, /*#__PURE__*/React.createElement(ToolbarItem, null, itemProps => /*#__PURE__*/React.createElement(Button, _extends({}, itemProps, {
    isPressed: sel_pos.inner_items === "flex-start",
    onClick: () => props.onFlexChange("flex-start", "inner_items") //親コンポーネントに通知
    ,
    icon: start_cross,
    label: cross_start_tip
  }))), /*#__PURE__*/React.createElement(ToolbarItem, null, itemProps => /*#__PURE__*/React.createElement(Button, _extends({}, itemProps, {
    isPressed: sel_pos.inner_items === "center",
    onClick: () => props.onFlexChange("center", "inner_items") //親コンポーネントに通知
    ,
    icon: center_cross,
    label: __("center alignment", "block-collections")
  }))), /*#__PURE__*/React.createElement(ToolbarItem, null, itemProps => /*#__PURE__*/React.createElement(Button, _extends({}, itemProps, {
    isPressed: sel_pos.inner_items === "flex-end",
    onClick: () => props.onFlexChange("flex-end", "inner_items") //親コンポーネントに通知
    ,
    icon: end_cross,
    label: cross_end_tip
  }))), /*#__PURE__*/React.createElement(ToolbarItem, null, itemProps => /*#__PURE__*/React.createElement(Button, _extends({}, itemProps, {
    isPressed: sel_pos.inner_items === "stretch",
    onClick: () => props.onFlexChange("stretch", "inner_items") //親コンポーネントに通知
    ,
    icon: stretch,
    label: __("beteen stretch", "block-collections")
  })))), isContainer && /*#__PURE__*/React.createElement(React.Fragment, null, isMobile ? /*#__PURE__*/React.createElement("p", null, __("Alignment in container(Mobile)", "block-collections")) : /*#__PURE__*/React.createElement("p", null, __("Alignment in container(DeskTop)", "block-collections")), /*#__PURE__*/React.createElement(ToolbarGroup, null, /*#__PURE__*/React.createElement(ToolbarItem, null, itemProps => /*#__PURE__*/React.createElement(Button, _extends({}, itemProps, {
    isPressed: direction === "row" ? sel_pos.outer_vertical === "self-start" : sel_pos.outer_align === "left",
    onClick: direction === "row" ? () => props.onVerticalChange("self-start") : () => props.onAlignChange("left"),
    icon: direction === "row" ? upper : justifyLeft,
    label: direction === "row" ? __("upper alignment", "block-collections") : __("left alignment", "block-collections")
  }))), /*#__PURE__*/React.createElement(ToolbarItem, null, itemProps => /*#__PURE__*/React.createElement(Button, _extends({}, itemProps, {
    isPressed: direction === "row" ? sel_pos.outer_vertical === "center" : sel_pos.outer_align === "center",
    onClick: direction === "row" ? () => props.onVerticalChange("center") : () => props.onAlignChange("center"),
    icon: direction === "row" ? middle : justifyCenter,
    label: __("center alignment", "block-collections")
  }))), /*#__PURE__*/React.createElement(ToolbarItem, null, itemProps => /*#__PURE__*/React.createElement(Button, _extends({}, itemProps, {
    isPressed: direction === "row" ? sel_pos.outer_vertical === "self-end" : sel_pos.outer_align === "right",
    onClick: direction === "row" ? () => props.onVerticalChange("self-end") : () => props.onAlignChange("right"),
    icon: direction === "row" ? lower : justifyRight,
    label: direction === "row" ? __("lower alignment", "block-collections") : __("right alignment", "block-collections")
  }))), /*#__PURE__*/React.createElement(ToolbarItem, null, itemProps => /*#__PURE__*/React.createElement(Button, _extends({}, itemProps, {
    isPressed: sel_pos.outer_vertical === "stretch",
    onClick: direction === "row" ? () => props.onVerticalChange("stretch") : () => props.onAlignChange("stretch"),
    icon: direction === "row" ? vert_between : justifyStretch,
    label: __("stretch", "block-collections")
  }))))), /*#__PURE__*/React.createElement(BlockWidth, {
    attributes: attributes,
    isMobile: isMobile,
    isSubmenu: isSubmenu,
    onWidthChange: (key, widthVal) => props.onWidthChange(key, widthVal),
    onFreeWidthChange: (key, freeVal) => props.onFreeWidthChange(key, freeVal)
  }), isFlexItem && /*#__PURE__*/React.createElement(PanelRow, {
    className: "position_row"
  }, /*#__PURE__*/React.createElement(TextControl, {
    label: __("grow", "block-collections"),
    labelPosition: "left",
    value: (_sel_pos$flex = sel_pos.flex) === null || _sel_pos$flex === void 0 ? void 0 : _sel_pos$flex.grow,
    onChange: newValue => {
      var _sel_pos$flex2, _sel_pos$flex3;
      var flexObj = {
        grow: newValue,
        shrink: (_sel_pos$flex2 = sel_pos.flex) === null || _sel_pos$flex2 === void 0 ? void 0 : _sel_pos$flex2.shrink,
        basis: (_sel_pos$flex3 = sel_pos.flex) === null || _sel_pos$flex3 === void 0 ? void 0 : _sel_pos$flex3.basis
      };
      props.onFlexItemChange(flexObj);
    }
  }), /*#__PURE__*/React.createElement(TextControl, {
    label: __("shrink", "block-collections"),
    labelPosition: "left",
    value: (_sel_pos$flex4 = sel_pos.flex) === null || _sel_pos$flex4 === void 0 ? void 0 : _sel_pos$flex4.shrink,
    onChange: newValue => {
      var _sel_pos$flex5, _sel_pos$flex6;
      var flexObj = {
        grow: (_sel_pos$flex5 = sel_pos.flex) === null || _sel_pos$flex5 === void 0 ? void 0 : _sel_pos$flex5.grow,
        shrink: newValue,
        basis: (_sel_pos$flex6 = sel_pos.flex) === null || _sel_pos$flex6 === void 0 ? void 0 : _sel_pos$flex6.basis
      };
      props.onFlexItemChange(flexObj);
    }
  }), /*#__PURE__*/React.createElement(TextControl, {
    label: __("basis", "block-collections"),
    labelPosition: "left",
    value: (_sel_pos$flex7 = sel_pos.flex) === null || _sel_pos$flex7 === void 0 ? void 0 : _sel_pos$flex7.basis,
    onChange: newValue => {
      var _sel_pos$flex8, _sel_pos$flex9;
      var flexObj = {
        grow: (_sel_pos$flex8 = sel_pos.flex) === null || _sel_pos$flex8 === void 0 ? void 0 : _sel_pos$flex8.grow,
        shrink: (_sel_pos$flex9 = sel_pos.flex) === null || _sel_pos$flex9 === void 0 ? void 0 : _sel_pos$flex9.shrink,
        basis: newValue
      };
      props.onFlexItemChange(flexObj);
    }
  })), /*#__PURE__*/React.createElement(BlockHeight, {
    attributes: attributes,
    isMobile: isMobile,
    onHeightChange: heightVal => props.onHeightChange(heightVal),
    onFreeHeightChange: freeVal => props.onFreeHeightChange(freeVal)
  }), sel_pos.direction === "grid" && /*#__PURE__*/React.createElement(React.Fragment, null, isMobile ? /*#__PURE__*/React.createElement("p", null, __("Grid Info settings(Mobile)", "block-collections")) : /*#__PURE__*/React.createElement("p", null, __("Grid Info settings(DeskTop)", "block-collections")), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: openGridModal
  }, __("Open Setting Modal", "block-collections")), isGridModalOpen && /*#__PURE__*/React.createElement(Modal, {
    title: "Grid Info settings",
    onRequestClose: closeGridModal
  }, /*#__PURE__*/React.createElement(GridControls, {
    attributes: sel_pos.grid_info,
    clientId: clientId,
    onChange: newValue => {
      props.onGridChange(newValue);
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "itmar_title_type"
  }, /*#__PURE__*/React.createElement(RadioControl, {
    label: __("Position Type", "block-collections"),
    selected: positionType,
    options: [{
      label: __("Static", "block-collections"),
      value: "staic"
    }, {
      label: __("Relative", "block-collections"),
      value: "relative"
    }, {
      label: __("Absolute", "block-collections"),
      value: "absolute"
    }, {
      label: __("Fix", "block-collections"),
      value: "fixed"
    }, {
      label: __("Sticky", "block-collections"),
      value: "sticky"
    }],
    onChange: newVal => {
      props.onPositionChange(newVal);
    }
  })), positionType === "absolute" && !isParallax && /*#__PURE__*/React.createElement(ToggleControl, {
    label: __("Center Vertically and Horizontally", "block-collections"),
    checked: isPosCenter,
    onChange: newVal => {
      props.onIsPosCenterChange(newVal);
    }
  }), (positionType === "absolute" && !isPosCenter || positionType === "fixed" || positionType === "sticky") && /*#__PURE__*/React.createElement(React.Fragment, null, isMobile ? /*#__PURE__*/React.createElement("p", null, __("Block Position(Mobile)", "block-collections")) : /*#__PURE__*/React.createElement("p", null, __("Block Position(DeskTop)", "block-collections")), /*#__PURE__*/React.createElement(PanelBody, {
    title: __("Vertical", "block-collections"),
    initialOpen: true
  }, !((_sel_pos$posValue = sel_pos.posValue) !== null && _sel_pos$posValue !== void 0 && _sel_pos$posValue.isVertCenter) && /*#__PURE__*/React.createElement(PanelRow, {
    className: "position_row"
  }, /*#__PURE__*/React.createElement(ComboboxControl, {
    options: [{
      value: "top",
      label: "Top"
    }, {
      value: "bottom",
      label: "Bottom"
    }],
    value: ((_sel_pos$posValue2 = sel_pos.posValue) === null || _sel_pos$posValue2 === void 0 ? void 0 : _sel_pos$posValue2.vertBase) || "top",
    onChange: newValue => {
      var newValObj = _objectSpread2(_objectSpread2({}, sel_pos.posValue || {}), {}, {
        vertBase: newValue
      });
      props.onPosValueChange(newValObj);
    }
  }), /*#__PURE__*/React.createElement(__experimentalUnitControl, {
    dragDirection: "e",
    onChange: newValue => {
      var newValObj = _objectSpread2(_objectSpread2({}, sel_pos.posValue || {}), {}, {
        vertValue: newValue
      });
      props.onPosValueChange(newValObj);
    },
    value: ((_sel_pos$posValue3 = sel_pos.posValue) === null || _sel_pos$posValue3 === void 0 ? void 0 : _sel_pos$posValue3.vertValue) || "3em"
  })), !isParallax && /*#__PURE__*/React.createElement(ToggleControl, {
    label: __("Is Center", "block-collections"),
    checked: (_sel_pos$posValue4 = sel_pos.posValue) === null || _sel_pos$posValue4 === void 0 ? void 0 : _sel_pos$posValue4.isVertCenter,
    onChange: newValue => {
      var newValObj = _objectSpread2(_objectSpread2({}, sel_pos.posValue || {}), {}, {
        isVertCenter: newValue
      });
      props.onPosValueChange(newValObj);
    }
  })), /*#__PURE__*/React.createElement(PanelBody, {
    title: __("Horizon", "block-collections"),
    initialOpen: true
  }, !((_sel_pos$posValue5 = sel_pos.posValue) !== null && _sel_pos$posValue5 !== void 0 && _sel_pos$posValue5.isHorCenter) && /*#__PURE__*/React.createElement(PanelRow, {
    className: "position_row"
  }, /*#__PURE__*/React.createElement(ComboboxControl, {
    options: [{
      value: "left",
      label: "Left"
    }, {
      value: "right",
      label: "Right"
    }],
    value: ((_sel_pos$posValue6 = sel_pos.posValue) === null || _sel_pos$posValue6 === void 0 ? void 0 : _sel_pos$posValue6.horBase) || "left",
    onChange: newValue => {
      var newValObj = _objectSpread2(_objectSpread2({}, sel_pos.posValue || {}), {}, {
        horBase: newValue
      });
      props.onPosValueChange(newValObj);
    }
  }), /*#__PURE__*/React.createElement(__experimentalUnitControl, {
    dragDirection: "e",
    onChange: newValue => {
      var newValObj = _objectSpread2(_objectSpread2({}, sel_pos.posValue || {}), {}, {
        horValue: newValue
      });
      props.onPosValueChange(newValObj);
    },
    value: ((_sel_pos$posValue7 = sel_pos.posValue) === null || _sel_pos$posValue7 === void 0 ? void 0 : _sel_pos$posValue7.horValue) || "3em"
  })), !isParallax && /*#__PURE__*/React.createElement(ToggleControl, {
    label: __("Is Center", "block-collections"),
    checked: (_sel_pos$posValue8 = sel_pos.posValue) === null || _sel_pos$posValue8 === void 0 ? void 0 : _sel_pos$posValue8.isHorCenter,
    onChange: newValue => {
      var newValObj = _objectSpread2(_objectSpread2({}, sel_pos.posValue || {}), {}, {
        isHorCenter: newValue
      });
      props.onPosValueChange(newValObj);
    }
  })))));
}
function BlockWidth(props) {
  var {
    attributes,
    isMobile,
    flexDirection,
    isSubmenu
  } = props;
  var {
    default_val,
    mobile_val
  } = attributes;

  //モバイルかデスクトップか
  var sel_pos = isMobile ? mobile_val : default_val;

  // 翻訳が必要な文字列を直接指定
  var blockMaxWidthMobile = __("Block Max Width(Mobile)", "block-collections");
  var blockWidthMobile = __("Block Width(Mobile)", "block-collections");
  var blockMaxWidthDesktop = __("Block Max Width(DeskTop)", "block-collections");
  var blockWidthDesktop = __("Block Width(DeskTop)", "block-collections");

  // ラベル
  var widthLabel = isMobile ? blockWidthMobile : blockWidthDesktop;
  var maxWidthLabel = isMobile ? blockMaxWidthMobile : blockMaxWidthDesktop;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", null, widthLabel), /*#__PURE__*/React.createElement(ToolbarGroup, null, /*#__PURE__*/React.createElement(ToolbarItem, null, itemProps => /*#__PURE__*/React.createElement(Button, _extends({}, itemProps, {
    isPressed: sel_pos.width_val === "full",
    onClick: () => props.onWidthChange("width_val", "full"),
    text: "full"
  }))), /*#__PURE__*/React.createElement(ToolbarItem, null, itemProps => /*#__PURE__*/React.createElement(Button, _extends({}, itemProps, {
    isPressed: sel_pos.width_val === "fit",
    onClick: () => props.onWidthChange("width_val", "fit"),
    text: "fit"
  }))), /*#__PURE__*/React.createElement(ToolbarItem, null, itemProps => /*#__PURE__*/React.createElement(Button, _extends({}, itemProps, {
    isPressed: sel_pos.width_val === "wideSize",
    onClick: () => props.onWidthChange("width_val", "wideSize"),
    icon: stretchWide,
    label: __("Wide Size", "block-collections")
  }))), /*#__PURE__*/React.createElement(ToolbarItem, null, itemProps => /*#__PURE__*/React.createElement(Button, _extends({}, itemProps, {
    isPressed: sel_pos.width_val === "contentSize",
    onClick: () => props.onWidthChange("width_val", "contentSize"),
    icon: positionCenter,
    label: __("Content Size", "block-collections")
  }))), /*#__PURE__*/React.createElement(ToolbarItem, null, itemProps => /*#__PURE__*/React.createElement(Button, _extends({}, itemProps, {
    isPressed: sel_pos.width_val === "free",
    onClick: () => props.onWidthChange("width_val", "free"),
    text: "free"
  })))), sel_pos.width_val === "free" && /*#__PURE__*/React.createElement(__experimentalUnitControl, {
    dragDirection: "e",
    onChange: newValue => props.onFreeWidthChange("free_width", newValue),
    value: sel_pos.free_width
  }), /*#__PURE__*/React.createElement("p", null, maxWidthLabel), /*#__PURE__*/React.createElement(ToolbarGroup, null, /*#__PURE__*/React.createElement(ToolbarItem, null, itemProps => /*#__PURE__*/React.createElement(Button, _extends({}, itemProps, {
    isPressed: sel_pos.max_width === "full",
    onClick: () => props.onWidthChange("max_width", "full"),
    text: "full"
  }))), /*#__PURE__*/React.createElement(ToolbarItem, null, itemProps => /*#__PURE__*/React.createElement(Button, _extends({}, itemProps, {
    isPressed: sel_pos.max_width === "fit",
    onClick: () => props.onWidthChange("max_width", "fit"),
    text: "fit"
  }))), /*#__PURE__*/React.createElement(ToolbarItem, null, itemProps => /*#__PURE__*/React.createElement(Button, _extends({}, itemProps, {
    isPressed: sel_pos.max_width === "wideSize",
    onClick: () => props.onWidthChange("max_width", "wideSize"),
    icon: stretchWide,
    label: __("Wide Size", "block-collections")
  }))), /*#__PURE__*/React.createElement(ToolbarItem, null, itemProps => /*#__PURE__*/React.createElement(Button, _extends({}, itemProps, {
    isPressed: sel_pos.max_width === "contentSize",
    onClick: () => props.onWidthChange("max_width", "contentSize"),
    icon: positionCenter,
    label: __("Content Size", "block-collections")
  }))), /*#__PURE__*/React.createElement(ToolbarItem, null, itemProps => /*#__PURE__*/React.createElement(Button, _extends({}, itemProps, {
    isPressed: sel_pos.max_width === "free",
    onClick: () => props.onWidthChange("max_width", "free"),
    text: "free"
  })))), sel_pos.max_width === "free" && /*#__PURE__*/React.createElement(__experimentalUnitControl, {
    dragDirection: "e",
    onChange: newValue => props.onFreeWidthChange("max_free_width", newValue),
    value: sel_pos.max_free_width
  }));
}
function BlockHeight(props) {
  var {
    attributes,
    isMobile
  } = props;
  var {
    default_val,
    mobile_val
  } = attributes;

  //モバイルかデスクトップか
  var sel_pos = isMobile ? mobile_val : default_val;
  return /*#__PURE__*/React.createElement(React.Fragment, null, isMobile ? /*#__PURE__*/React.createElement("p", null, __("Block Height(Mobile)", "block-collections")) : /*#__PURE__*/React.createElement("p", null, __("Block Height(DeskTop)", "block-collections")), /*#__PURE__*/React.createElement(ToolbarGroup, null, /*#__PURE__*/React.createElement(ToolbarItem, null, itemProps => /*#__PURE__*/React.createElement(Button, _extends({}, itemProps, {
    isPressed: sel_pos.height_val === "full",
    onClick: () => props.onHeightChange("full"),
    text: "full"
  }))), /*#__PURE__*/React.createElement(ToolbarItem, null, itemProps => /*#__PURE__*/React.createElement(Button, _extends({}, itemProps, {
    isPressed: sel_pos.height_val === "fit",
    onClick: () => props.onHeightChange("fit"),
    text: "fit"
  }))), /*#__PURE__*/React.createElement(ToolbarItem, null, itemProps => /*#__PURE__*/React.createElement(Button, _extends({}, itemProps, {
    isPressed: sel_pos.height_val === "free",
    onClick: () => props.onHeightChange("free"),
    text: "free"
  }))), /*#__PURE__*/React.createElement(ToolbarItem, null, itemProps => /*#__PURE__*/React.createElement(Button, _extends({}, itemProps, {
    isPressed: sel_pos.height_val === "auto",
    onClick: () => props.onHeightChange("auto"),
    text: "auto"
  })))), sel_pos.height_val === "free" && /*#__PURE__*/React.createElement(__experimentalUnitControl, {
    dragDirection: "e",
    onChange: newValue => props.onFreeHeightChange(newValue),
    value: sel_pos.free_height
  }));
}

export { BlockHeight, BlockWidth, BlockPlace as default };
//# sourceMappingURL=BlockPlace.js.map
