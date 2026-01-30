'use strict';

// sideの最初の文字を大文字にする関数
var capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
// objectかどうか判定する関数
var isObject = value => {
  return value !== null && typeof value === "object" && !Array.isArray(value);
};

//角丸のパラメータを返す
var radius_prm = radius => {
  var ret_radius_prm = radius && Object.keys(radius).length === 1 ? radius.value : "".concat(radius && radius.topLeft || "", " ").concat(radius && radius.topRight || "", " ").concat(radius && radius.bottomRight || "", " ").concat(radius && radius.bottomLeft || "");
  return ret_radius_prm;
};
//スペースのパラメータを返す
var space_prm = space => {
  var ret_space_prm = space ? "".concat(space.top, " ").concat(space.right, " ").concat(space.bottom, " ").concat(space.left) : "";
  return ret_space_prm;
};
//positionのオブジェクトを返します
var position_prm = (pos, type) => {
  //値でポジションを設定
  if (isObject(pos)) {
    var resetVertBase = pos.vertBase === "top" ? "bottom" : "top";
    var resetHorBase = pos.horBase === "left" ? "right" : "left";
    var centerVert = "50%";
    var centerHor = "50%";
    var centerTrans = pos.isVertCenter && pos.isHorCenter ? "transform: translate(-50%, -50%);" : pos.isVertCenter ? "transform: translateY(-50%);" : pos.isHorCenter ? "transform: translateX(-50%);" : "";
    var ret_pos_prm = pos && (type === "absolute" || type === "fixed" || type === "sticky") ? "\n    ".concat(pos.vertBase, ": ").concat(pos.isVertCenter ? centerVert : pos.vertValue, "; \n    ").concat(pos.horBase, ": ").concat(pos.isHorCenter ? centerHor : pos.horValue, ";\n    ").concat(centerTrans, "\n    ").concat(resetVertBase, ": auto;\n    ").concat(resetHorBase, ": auto;\n    ").concat(type === "fixed" || type === "sticky" ? "margin-block-start:0;z-index: 50;" : "z-index: auto;", "\n  ") : "";
    return ret_pos_prm;
    //縦横中央揃え
  } else if (pos) {
    var _ret_pos_prm = "top:50%;left: 50%;transform: translate(-50%, -50%);";
    return _ret_pos_prm;
  }
  return null;
};
//ブロック幅を返す
var max_width_prm = (width, free_val) => {
  var ret_width_prm = width === "wideSize" ? "max-width: var(--wp--style--global--wide-size);" : width === "contentSize" ? "max-width: var(--wp--style--global--content-size);" : width === "free" ? "max-width: ".concat(free_val, ";") : width === "full" ? "max-width: 100%;" : "max-width: fit-content;";
  return ret_width_prm;
};
var width_prm = (width, free_val) => {
  var ret_width_prm = width === "wideSize" ? " width: var(--wp--style--global--wide-size);" : width === "contentSize" ? " width: var(--wp--style--global--content-size);" : width === "free" ? " width: ".concat(free_val, "; ") : width === "full" ? " width: 100%;" : width === "fit" ? " width: fit-content;" : " width: auto;";
  return ret_width_prm;
};
var height_prm = (height, free_val) => {
  var ret_height_prm = height === "fit" ? " height: fit-content;" : height === "full" ? " height: 100%; " : height === "free" ? " height: ".concat(free_val, "; ") : "height: auto;";
  return ret_height_prm;
};
//配置を返す
var align_prm = function align_prm(align) {
  var camelFLg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  //css用
  var ret_align_prm = align === "center" ? "margin-left: auto; margin-right: auto;" : align === "right" ? "margin-left: auto; margin-right: 0;" : "margin-right: auto; margin-left: 0;";
  //インナースタイル用
  var camel_align_prm = align === "center" ? {
    marginLeft: "auto",
    marginRight: "auto"
  } : align === "right" ? {
    marginLeft: "auto"
  } : {};
  return camelFLg ? camel_align_prm : ret_align_prm;
};

//スタイルオブジェクト変換関数
var convertToScss = styleObject => {
  var scss = "";
  for (var prop in styleObject) {
    if (styleObject.hasOwnProperty(prop)) {
      var scssProp = prop.replace(/([A-Z])/g, "-$1").toLowerCase();
      scss += "".concat(scssProp, ": ").concat(styleObject[prop], ";\n");
    }
  }
  return scss;
};
var borderProperty = borderObj => {
  if (borderObj) {
    //borderObjがundefinedでない
    var keys = ["top", "bottom", "left", "right"];
    var ret_prop = null;
    var doesKeyExist = keys.some(key => key in borderObj);
    if (doesKeyExist) {
      //'top', 'bottom', 'left', 'right'が別設定
      var cssObj = {};
      for (var side in borderObj) {
        var sideData = borderObj[side];
        var startsWithZero = String(sideData.width || "").match(/^0/);
        if (startsWithZero) {
          //widthが０ならCSS設定しない
          continue;
        }
        var border_style = sideData.style || "solid";
        var camelCaseSide = "border".concat(capitalizeFirstLetter(side));
        cssObj[camelCaseSide] = "".concat(sideData.width, " ").concat(border_style, " ").concat(sideData.color);
      }
      ret_prop = cssObj;
      return ret_prop;
    } else {
      //同一のボーダー
      var _startsWithZero = String(borderObj.width || "").match(/^0/);
      if (_startsWithZero) {
        //widthが０ならnullを返す
        return null;
      }
      var _border_style = borderObj.style || "solid";
      ret_prop = {
        border: "".concat(borderObj.width, " ").concat(_border_style, " ").concat(borderObj.color)
      };
      return ret_prop;
    }
  } else {
    return null;
  }
};

//角丸の設定
var radiusProperty = radiusObj => {
  var ret_prop = radiusObj && Object.keys(radiusObj).length === 1 ? radiusObj.value : "".concat(radiusObj && radiusObj.topLeft || "", " ").concat(radiusObj && radiusObj.topRight || "", " ").concat(radiusObj && radiusObj.bottomRight || "", " ").concat(radiusObj && radiusObj.bottomLeft || "");
  var ret_val = {
    borderRadius: ret_prop
  };
  return ret_val;
};

//マージンの設定
var marginProperty = marginObj => {
  var ret_prop = "".concat(marginObj.top, " ").concat(marginObj.right, " ").concat(marginObj.bottom, " ").concat(marginObj.left);
  var ret_val = {
    margin: ret_prop
  };
  return ret_val;
};
//パディングの設定
function paddingProperty(paddingObj) {
  var ret_prop = "".concat(paddingObj.top, " ").concat(paddingObj.right, " ").concat(paddingObj.bottom, " ").concat(paddingObj.left);
  var ret_val = {
    padding: ret_prop
  };
  return ret_val;
}

exports.align_prm = align_prm;
exports.borderProperty = borderProperty;
exports.convertToScss = convertToScss;
exports.height_prm = height_prm;
exports.marginProperty = marginProperty;
exports.max_width_prm = max_width_prm;
exports.paddingProperty = paddingProperty;
exports.position_prm = position_prm;
exports.radiusProperty = radiusProperty;
exports.radius_prm = radius_prm;
exports.space_prm = space_prm;
exports.width_prm = width_prm;
//# sourceMappingURL=cssPropertes.js.map
