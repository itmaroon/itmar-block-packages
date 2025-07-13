// sideの最初の文字を大文字にする関数
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
// objectかどうか判定する関数
const isObject = (value) => {
  return value !== null && typeof value === "object" && !Array.isArray(value);
};

//角丸のパラメータを返す
export const radius_prm = (radius) => {
  const ret_radius_prm =
    radius && Object.keys(radius).length === 1
      ? radius.value
      : `${(radius && radius.topLeft) || ""} ${
          (radius && radius.topRight) || ""
        } ${(radius && radius.bottomRight) || ""} ${
          (radius && radius.bottomLeft) || ""
        }`;
  return ret_radius_prm;
};
//スペースのパラメータを返す
export const space_prm = (space) => {
  const ret_space_prm = space
    ? `${space.top} ${space.right} ${space.bottom} ${space.left}`
    : "";
  return ret_space_prm;
};
//positionのオブジェクトを返します
export const position_prm = (pos, type) => {
  //値でポジションを設定
  if (isObject(pos)) {
    const resetVertBase = pos.vertBase === "top" ? "bottom" : "top";
    const resetHorBase = pos.horBase === "left" ? "right" : "left";
    const centerVert = "50%";
    const centerHor = "50%";
    const centerTrans =
      pos.isVertCenter && pos.isHorCenter
        ? "transform: translate(-50%, -50%);"
        : pos.isVertCenter
        ? "transform: translateY(-50%);"
        : pos.isHorCenter
        ? "transform: translateX(-50%);"
        : "";
    const ret_pos_prm =
      pos && (type === "absolute" || type === "fixed" || type === "sticky")
        ? `
    ${pos.vertBase}: ${pos.isVertCenter ? centerVert : pos.vertValue}; 
    ${pos.horBase}: ${pos.isHorCenter ? centerHor : pos.horValue};
    ${centerTrans}
    ${resetVertBase}: auto;
    ${resetHorBase}: auto;
    ${
      type === "fixed" || type === "sticky"
        ? "margin-block-start:0;z-index: 50;"
        : "z-index: auto;"
    }
  `
        : "";
    return ret_pos_prm;
    //縦横中央揃え
  } else if (pos) {
    const ret_pos_prm = "top:50%;left: 50%;transform: translate(-50%, -50%);";
    return ret_pos_prm;
  }
  return null;
};
//ブロック幅を返す
export const max_width_prm = (width, free_val) => {
  const ret_width_prm =
    width === "wideSize"
      ? "max-width: var(--wp--style--global--wide-size);"
      : width === "contentSize"
      ? "max-width: var(--wp--style--global--content-size);"
      : width === "free"
      ? `max-width: ${free_val};`
      : width === "full"
      ? "max-width: 100%;"
      : "max-width: fit-content;";
  return ret_width_prm;
};

export const width_prm = (width, free_val) => {
  const ret_width_prm =
    width === "wideSize"
      ? " width: var(--wp--style--global--wide-size);"
      : width === "contentSize"
      ? " width: var(--wp--style--global--content-size);"
      : width === "free"
      ? ` width: ${free_val}; `
      : width === "full"
      ? " width: 100%;"
      : width === "fit"
      ? " width: fit-content;"
      : " width: auto;";
  return ret_width_prm;
};

export const height_prm = (height, free_val) => {
  const ret_height_prm =
    height === "fit"
      ? " height: fit-content;"
      : height === "full"
      ? ` height: 100%; `
      : height === "free"
      ? ` height: ${free_val}; `
      : "height: auto;";
  return ret_height_prm;
};
//配置を返す
export const align_prm = (align, camelFLg = false) => {
  //css用
  const ret_align_prm =
    align === "center"
      ? "margin-left: auto; margin-right: auto;"
      : align === "right"
      ? "margin-left: auto; margin-right: 0;"
      : "margin-right: auto; margin-left: 0;";
  //インナースタイル用
  const camel_align_prm =
    align === "center"
      ? { marginLeft: "auto", marginRight: "auto" }
      : align === "right"
      ? { marginLeft: "auto" }
      : {};

  return camelFLg ? camel_align_prm : ret_align_prm;
};

//スタイルオブジェクト変換関数
export const convertToScss = (styleObject) => {
  let scss = "";
  for (const prop in styleObject) {
    if (styleObject.hasOwnProperty(prop)) {
      const scssProp = prop.replace(/([A-Z])/g, "-$1").toLowerCase();
      scss += `${scssProp}: ${styleObject[prop]};\n`;
    }
  }
  return scss;
};

export const borderProperty = (borderObj) => {
  if (borderObj) {
    //borderObjがundefinedでない
    let keys = ["top", "bottom", "left", "right"];
    let ret_prop = null;
    let doesKeyExist = keys.some((key) => key in borderObj);
    if (doesKeyExist) {
      //'top', 'bottom', 'left', 'right'が別設定
      let cssObj = {};
      for (let side in borderObj) {
        const sideData = borderObj[side];
        const startsWithZero = String(sideData.width || "").match(/^0/);
        if (startsWithZero) {
          //widthが０ならCSS設定しない
          continue;
        }
        const border_style = sideData.style || "solid";
        let camelCaseSide = `border${capitalizeFirstLetter(side)}`;
        cssObj[
          camelCaseSide
        ] = `${sideData.width} ${border_style} ${sideData.color}`;
      }
      ret_prop = cssObj;
      return ret_prop;
    } else {
      //同一のボーダー
      const startsWithZero = String(borderObj.width || "").match(/^0/);
      if (startsWithZero) {
        //widthが０ならnullを返す
        return null;
      }
      const border_style = borderObj.style || "solid";
      ret_prop = {
        border: `${borderObj.width} ${border_style} ${borderObj.color}`,
      };

      return ret_prop;
    }
  } else {
    return null;
  }
};

//角丸の設定
export const radiusProperty = (radiusObj) => {
  const ret_prop =
    radiusObj && Object.keys(radiusObj).length === 1
      ? radiusObj.value
      : `${(radiusObj && radiusObj.topLeft) || ""} ${
          (radiusObj && radiusObj.topRight) || ""
        } ${(radiusObj && radiusObj.bottomRight) || ""} ${
          (radiusObj && radiusObj.bottomLeft) || ""
        }`;
  const ret_val = { borderRadius: ret_prop };
  return ret_val;
};

//マージンの設定
export const marginProperty = (marginObj) => {
  const ret_prop = `${marginObj.top} ${marginObj.right} ${marginObj.bottom} ${marginObj.left}`;

  const ret_val = { margin: ret_prop };
  return ret_val;
};
//パディングの設定
export function paddingProperty(paddingObj) {
  const ret_prop = `${paddingObj.top} ${paddingObj.right} ${paddingObj.bottom} ${paddingObj.left}`;

  const ret_val = { padding: ret_prop };
  return ret_val;
}
