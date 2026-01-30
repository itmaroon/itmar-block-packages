import { objectSpread2 as _objectSpread2 } from './_virtual/_rollupPluginBabelHelpers.js';
import { __ } from '@wordpress/i18n';
import { __experimentalPanelColorGradientSettings } from '@wordpress/block-editor';
import { PanelBody, RadioControl, RangeControl, PanelRow, ToggleControl } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { dispatch } from '@wordpress/data';
import { rgb16ToHsl, hslToRgb16, HexToRGB } from './hslToRgb.js';

//方向と距離
var dirctionDigit = (direction, distance) => {
  var destTopLeft, destTopRight, destBottomLeft, destBottomRight;
  switch (direction) {
    case "top_left":
      destTopLeft = distance;
      destTopRight = distance;
      destBottomLeft = distance * -1;
      destBottomRight = distance * -1;
      break;
    case "top_right":
      destTopLeft = distance * -1;
      destTopRight = distance;
      destBottomLeft = distance;
      destBottomRight = distance * -1;
      break;
    case "bottom_left":
      destTopLeft = distance;
      destTopRight = distance * -1;
      destBottomLeft = distance * -1;
      destBottomRight = distance;
      break;
    case "bottom_right":
      destTopLeft = distance * -1;
      destTopRight = distance * -1;
      destBottomLeft = distance;
      destBottomRight = distance;
      break;
    case "right_bottom":
      destTopLeft = distance;
      destTopRight = distance * -1;
      destBottomLeft = distance * -1;
      destBottomRight = distance;
      break;
    case "top":
      destTopLeft = 0;
      destTopRight = 0;
      destBottomLeft = distance * -1;
      destBottomRight = distance;
      break;
  }
  return {
    topLeft: destTopLeft,
    topRight: destTopRight,
    bottomLeft: destBottomLeft,
    bottmRight: destBottomRight
  };
};

// グラデーションの色値は通常'linear-gradient'または'radial-gradient'で始まるので、
// これらのキーワードを探すことでグラデーションかどうかを判断します。
function isGradient(colorValue) {
  return colorValue.includes("linear-gradient") || colorValue.includes("radial-gradient");
}
var ShadowElm = shadowState => {
  //let baseColor;
  var {
    shadowType,
    spread,
    lateral,
    longitude,
    nomalBlur,
    shadowColor,
    blur,
    intensity,
    distance,
    newDirection,
    clayDirection,
    embos,
    opacity,
    depth,
    bdBlur,
    expand,
    glassblur,
    glassopa,
    hasOutline,
    baseColor
  } = shadowState;

  //ノーマル
  if (shadowType === "nomal") {
    //boxshadowの生成
    var _ShadowStyle = embos === "dent" ? {
      style: {
        boxShadow: "".concat(lateral, "px ").concat(longitude, "px ").concat(nomalBlur, "px ").concat(spread, "px transparent, inset ").concat(lateral, "px ").concat(longitude, "px ").concat(nomalBlur, "px ").concat(spread, "px ").concat(shadowColor)
      }
    } : {
      style: {
        boxShadow: "".concat(lateral, "px ").concat(longitude, "px ").concat(nomalBlur, "px ").concat(spread, "px ").concat(shadowColor, ", inset ").concat(lateral, "px ").concat(longitude, "px ").concat(nomalBlur, "px ").concat(spread, "px transparent")
      }
    };
    //Shadowのスタイルを返す
    return _ShadowStyle;
  }
  //ニューモフィズム
  else if (shadowType === "newmor") {
    //背景がグラデーションのときはセットしない
    if (isGradient(baseColor)) {
      dispatch("core/notices").createNotice("error", __("Neumorphism cannot be set when the background color is a gradient. ", "itmar_guest_contact_block"), {
        type: "snackbar",
        isDismissible: true
      });
      return null;
    }
    //ボタン背景色のHSL値
    var hslValue = rgb16ToHsl(baseColor);
    //影の明るさを変更
    var lightVal = hslValue.lightness + intensity < 100 ? hslValue.lightness + intensity : 100;
    var darkVal = hslValue.lightness - intensity > 0 ? hslValue.lightness - intensity : 0;
    var lightValue = hslToRgb16(hslValue.hue, hslValue.saturation, lightVal);
    var darkValue = hslToRgb16(hslValue.hue, hslValue.saturation, darkVal);
    //boxshadowの生成
    //立体の方向
    var dircObj = dirctionDigit(newDirection, distance);
    var baseStyle = {
      style: {
        border: "none",
        background: baseColor
      }
    };
    var newmorStyle = embos === "swell" ? {
      style: _objectSpread2(_objectSpread2({}, baseStyle.style), {}, {
        boxShadow: "".concat(dircObj.topLeft, "px ").concat(dircObj.topRight, "px ").concat(blur, "px ").concat(darkValue, ", ").concat(dircObj.bottomLeft, "px ").concat(dircObj.bottmRight, "px ").concat(blur, "px ").concat(lightValue, ", inset ").concat(dircObj.topLeft, "px ").concat(dircObj.topRight, "px ").concat(blur, "px transparent, inset ").concat(dircObj.bottomLeft, "px ").concat(dircObj.bottmRight, "px ").concat(blur, "px transparent")
      })
    } : {
      style: _objectSpread2(_objectSpread2({}, baseStyle.style), {}, {
        boxShadow: "".concat(dircObj.topLeft, "px ").concat(dircObj.topRight, "px ").concat(blur, "px transparent, ").concat(dircObj.bottomLeft, "px ").concat(dircObj.bottmRight, "px ").concat(blur, "px transparent, inset ").concat(dircObj.topLeft, "px ").concat(dircObj.topRight, "px ").concat(blur, "px ").concat(darkValue, ", inset ").concat(dircObj.bottomLeft, "px ").concat(dircObj.bottmRight, "px ").concat(blur, "px ").concat(lightValue)
      })
    };

    //Shadowのスタイルを返す
    return newmorStyle;
  }

  //クレイモーフィズム
  else if (shadowType === "claymor") {
    //背景がグラデーションのときはセットしない
    if (isGradient(baseColor)) {
      dispatch("core/notices").createNotice("error", __("claymorphism cannot be set when the background color is a gradient. ", "itmar_guest_contact_block"), {
        type: "snackbar",
        isDismissible: true
      });
      return null;
    }
    var rgbValue = HexToRGB(baseColor);
    var outsetObj = dirctionDigit(clayDirection, expand);
    var insetObj = dirctionDigit(clayDirection, depth);
    var _baseStyle = {
      style: {
        background: "rgba(255, 255, 255, ".concat(opacity, ")"),
        backdropFilter: "blur(".concat(bdBlur, "px)"),
        border: "none"
      }
    };
    var claymorStyle = _objectSpread2(_objectSpread2({}, _baseStyle), {}, {
      style: _objectSpread2(_objectSpread2({}, _baseStyle.style), {}, {
        boxShadow: "".concat(outsetObj.topLeft, "px ").concat(outsetObj.bottmRight, "px ").concat(expand * 2, "px 0px rgba(").concat(rgbValue.red, ", ").concat(rgbValue.green, ", ").concat(rgbValue.blue, ", 0.5), inset ").concat(insetObj.topRight, "px ").concat(insetObj.bottomLeft, "px 16px 0px rgba(").concat(rgbValue.red, ", ").concat(rgbValue.green, ", ").concat(rgbValue.blue, ", 0.6), inset 0px 11px 28px 0px rgb(255, 255, 255)")
      })
    });
    //attributesに保存
    return claymorStyle;
  }

  //グラスモーフィズム
  else if (shadowType === "glassmor") {
    var _baseStyle2 = {
      style: _objectSpread2(_objectSpread2({
        backgroundColor: "rgba(255, 255, 255, ".concat(glassopa, ")")
      }, hasOutline ? {
        border: "1px solid rgba(255, 255, 255, 0.4)"
      } : {}), {}, {
        borderRightColor: "rgba(255, 255, 255, 0.2)",
        borderBottomColor: "rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur( ".concat(glassblur, "px )")
      })
    };
    var glassmorStyle = embos === "swell" ? _objectSpread2(_objectSpread2({}, _baseStyle2), {}, {
      style: _objectSpread2(_objectSpread2({}, _baseStyle2.style), {}, {
        boxShadow: "0 8px 12px 0 rgba( 31, 38, 135, 0.37 ), inset 0 8px 12px 0 transparent"
      })
    }) : _objectSpread2(_objectSpread2({}, _baseStyle2), {}, {
      style: _objectSpread2(_objectSpread2({}, _baseStyle2.style), {}, {
        boxShadow: "0 8px 12px 0 transparent, inset 0 8px 12px 0 rgba( 31, 38, 135, 0.37 )"
      })
    });

    //attributesに保存
    return glassmorStyle;
  }
};
var ShadowStyle = _ref => {
  var {
    shadowStyle,
    onChange
  } = _ref;
  var [shadowState, setShadowState] = useState(shadowStyle);
  var {
    shadowType,
    spread,
    lateral,
    longitude,
    nomalBlur,
    shadowColor,
    blur,
    intensity,
    distance,
    newDirection,
    clayDirection,
    embos,
    opacity,
    depth,
    bdBlur,
    expand,
    glassblur,
    glassopa,
    hasOutline
  } = shadowState;

  //シャドーのスタイル変更と背景色変更に伴う親コンポーネントの変更
  useEffect(() => {
    var shadowElm = ShadowElm(shadowState);
    if (shadowElm) onChange(shadowElm, shadowState);
  }, [shadowState]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PanelBody, {
    title: __("Shadow Type", "block-collections"),
    initialOpen: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "itmar_shadow_type"
  }, /*#__PURE__*/React.createElement(RadioControl, {
    selected: shadowType,
    options: [{
      label: __("Nomal", "block-collections"),
      value: "nomal"
    }, {
      label: __("Neumorphism", "block-collections"),
      value: "newmor"
    }, {
      label: __("Claymorphism", "block-collections"),
      value: "claymor"
    }, {
      label: __("Grassmophism", "block-collections"),
      value: "glassmor"
    }],
    onChange: changeOption => setShadowState(_objectSpread2(_objectSpread2({}, shadowState), {}, {
      shadowType: changeOption
    }))
  })), shadowType !== "claymor" && /*#__PURE__*/React.createElement("div", {
    className: "embos"
  }, /*#__PURE__*/React.createElement(RadioControl, {
    label: __("unevenness", "block-collections"),
    selected: embos,
    options: [{
      value: "swell"
    }, {
      value: "dent"
    }],
    onChange: changeOption => setShadowState(_objectSpread2(_objectSpread2({}, shadowState), {}, {
      embos: changeOption
    }))
  }))), shadowType === "nomal" && /*#__PURE__*/React.createElement(PanelBody, {
    title: __("Nomal settings", "block-collections"),
    initialOpen: false
  }, /*#__PURE__*/React.createElement(RangeControl, {
    value: spread,
    label: __("Spread", "block-collections"),
    max: 50,
    min: 0,
    onChange: val => setShadowState(_objectSpread2(_objectSpread2({}, shadowState), {}, {
      spread: val
    })),
    withInputField: false
  }), /*#__PURE__*/React.createElement(RangeControl, {
    value: lateral,
    label: __("Lateral direction", "block-collections"),
    max: 50,
    min: 0,
    onChange: val => setShadowState(_objectSpread2(_objectSpread2({}, shadowState), {}, {
      lateral: val
    })),
    withInputField: false
  }), /*#__PURE__*/React.createElement(RangeControl, {
    value: longitude,
    label: __("Longitudinal direction", "block-collections"),
    max: 50,
    min: 0,
    onChange: val => setShadowState(_objectSpread2(_objectSpread2({}, shadowState), {}, {
      longitude: val
    })),
    withInputField: false
  }), /*#__PURE__*/React.createElement(RangeControl, {
    value: nomalBlur,
    label: __("Blur", "block-collections"),
    max: 20,
    min: 0,
    onChange: val => setShadowState(_objectSpread2(_objectSpread2({}, shadowState), {}, {
      nomalBlur: val
    })),
    withInputField: false
  }), /*#__PURE__*/React.createElement(__experimentalPanelColorGradientSettings, {
    title: __("Shadow Color Setting", "block-collections"),
    settings: [{
      colorValue: shadowColor,
      label: __("Choose Shadow color", "block-collections"),
      onColorChange: newValue => setShadowState(_objectSpread2(_objectSpread2({}, shadowState), {}, {
        shadowColor: newValue
      }))
    }]
  })), shadowType === "newmor" && /*#__PURE__*/React.createElement(PanelBody, {
    title: __("Neumorphism settings", "block-collections"),
    initialOpen: false
  }, /*#__PURE__*/React.createElement(RangeControl, {
    value: distance,
    label: __("Distance", "block-collections"),
    max: 50,
    min: 0,
    onChange: val => setShadowState(_objectSpread2(_objectSpread2({}, shadowState), {}, {
      distance: val
    })),
    withInputField: false
  }), /*#__PURE__*/React.createElement(RangeControl, {
    value: intensity,
    label: __("Intensity", "block-collections"),
    max: 100,
    min: 0,
    onChange: val => setShadowState(_objectSpread2(_objectSpread2({}, shadowState), {}, {
      intensity: val
    })),
    withInputField: false
  }), /*#__PURE__*/React.createElement(RangeControl, {
    value: blur,
    label: __("Blur", "block-collections"),
    max: 20,
    min: 0,
    onChange: val => setShadowState(_objectSpread2(_objectSpread2({}, shadowState), {}, {
      blur: val
    })),
    withInputField: false
  }), /*#__PURE__*/React.createElement(PanelRow, null, /*#__PURE__*/React.createElement("div", {
    className: "light_direction"
  }, /*#__PURE__*/React.createElement(RadioControl, {
    selected: newDirection,
    options: [{
      value: "top_left"
    }, {
      value: "top_right"
    }, {
      value: "bottom_left"
    }, {
      value: "bottom_right"
    }],
    onChange: changeOption => setShadowState(_objectSpread2(_objectSpread2({}, shadowState), {}, {
      newDirection: changeOption
    }))
  })))), shadowType === "claymor" && /*#__PURE__*/React.createElement(PanelBody, {
    title: __("Claymorphism settings", "block-collections"),
    initialOpen: false
  }, /*#__PURE__*/React.createElement(RangeControl, {
    value: opacity,
    label: __("Opacity", "block-collections"),
    max: 1,
    min: 0,
    step: 0.1,
    onChange: val => setShadowState(_objectSpread2(_objectSpread2({}, shadowState), {}, {
      opacity: val
    })),
    withInputField: false
  }), /*#__PURE__*/React.createElement(RangeControl, {
    value: depth,
    label: "Depth",
    max: 20,
    min: 0,
    onChange: val => setShadowState(_objectSpread2(_objectSpread2({}, shadowState), {}, {
      depth: val
    })),
    withInputField: false
  }), /*#__PURE__*/React.createElement(RangeControl, {
    value: expand,
    label: "Expand",
    max: 50,
    min: 0,
    onChange: val => setShadowState(_objectSpread2(_objectSpread2({}, shadowState), {}, {
      expand: val
    })),
    withInputField: false
  }), /*#__PURE__*/React.createElement(RangeControl, {
    value: bdBlur,
    label: "Background Blur",
    max: 10,
    min: 0,
    onChange: val => setShadowState(_objectSpread2(_objectSpread2({}, shadowState), {}, {
      bdBlur: val
    })),
    withInputField: false
  }), /*#__PURE__*/React.createElement("div", {
    className: "light_direction claymor"
  }, /*#__PURE__*/React.createElement(RadioControl, {
    selected: clayDirection,
    options: [{
      value: "right_bottom"
    }, {
      value: "top_right"
    }, {
      value: "top"
    }],
    onChange: changeOption => setShadowState(_objectSpread2(_objectSpread2({}, shadowState), {}, {
      clayDirection: changeOption
    }))
  }))), shadowType === "glassmor" && /*#__PURE__*/React.createElement(PanelBody, {
    title: __("Grassmophism settings", "block-collections"),
    initialOpen: false
  }, /*#__PURE__*/React.createElement(RangeControl, {
    value: glassblur,
    label: __("Glass blur", "block-collections"),
    max: 20,
    min: 0,
    onChange: val => setShadowState(_objectSpread2(_objectSpread2({}, shadowState), {}, {
      glassblur: val
    })),
    withInputField: false
  }), /*#__PURE__*/React.createElement(RangeControl, {
    value: glassopa,
    label: __("Glass Opacity", "block-collections"),
    max: 1,
    min: 0,
    step: 0.1,
    onChange: val => setShadowState(_objectSpread2(_objectSpread2({}, shadowState), {}, {
      glassopa: val
    })),
    withInputField: false
  }), /*#__PURE__*/React.createElement("fieldset", null, /*#__PURE__*/React.createElement(ToggleControl, {
    label: __("Show outline", "block-collections"),
    checked: hasOutline,
    onChange: () => setShadowState(_objectSpread2(_objectSpread2({}, shadowState), {}, {
      hasOutline: !hasOutline
    }))
  }))));
};

export { ShadowElm, ShadowStyle as default };
//# sourceMappingURL=ShadowStyle.js.map
