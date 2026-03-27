import { createElement, Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { PanelColorSettings } from "@wordpress/block-editor";
import {
  PanelBody,
  PanelRow,
  ToggleControl,
  RangeControl,
  RadioControl,
} from "@wordpress/components";
import { useState, useEffect } from "@wordpress/element";
import { dispatch } from "@wordpress/data";
import { hslToRgb16, HexToRGB, rgb16ToHsl } from "./hslToRgb";

//方向と距離
// 1. 方向の型定義（リテラル型で制限）
type CornerDirection =
  | "top_left"
  | "top_right"
  | "bottom_left"
  | "bottom_right"
  | "right_bottom"
  | "top";

// 2. 戻り値のインターフェース
interface DirectionDigits {
  topLeft: number;
  topRight: number;
  bottomLeft: number;
  bottomRight: number;
}

/**
 * 方向と距離に基づいて、各頂点の数値を算出する
 */
const dirctionDigit = (
  direction: CornerDirection,
  distance: number,
): DirectionDigits => {
  // 初期値（デフォルト）を設定しておくことで、switch 漏れを防ぐ
  let destTopLeft = 0;
  let destTopRight = 0;
  let destBottomLeft = 0;
  let destBottomRight = 0;
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
    bottomRight: destBottomRight,
  };
};

// グラデーションの色値は通常'linear-gradient'または'radial-gradient'で始まるので、
// これらのキーワードを探すことでグラデーションかどうかを判断します。
function isGradient(
  colorValue: string | undefined | null,
): colorValue is string {
  // 1. 値が存在しない、または文字列でない場合は false
  if (typeof colorValue !== "string") {
    return false;
  }
  return (
    colorValue.includes("linear-gradient") ||
    colorValue.includes("radial-gradient")
  );
}

// 1. ShadowState の型定義
interface ShadowState {
  shadowType: "nomal" | "newmor" | "claymor" | "glassmor";
  spread: number;
  lateral: number;
  longitude: number;
  nomalBlur: number;
  shadowColor: string;
  blur: number;
  intensity: number;
  distance: number;
  newDirection: CornerDirection; // 以前定義した型
  clayDirection: CornerDirection;
  embos: "swell" | "dent";
  opacity: number;
  depth: number;
  bdBlur: number;
  expand: number;
  glassblur: number;
  glassopa: number;
  hasOutline: boolean;
  baseColor: string;
}

// 戻り値の型（Reactのstyle属性を持つオブジェクト）
interface ShadowResult {
  style: React.CSSProperties;
}

export const ShadowElm = (shadowState: ShadowState): ShadowResult | null => {
  //let baseColor;
  const {
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
    baseColor,
  } = shadowState;

  //ノーマル
  if (shadowType === "nomal") {
    //boxshadowの生成
    const ShadowStyle =
      embos === "dent"
        ? {
            style: {
              boxShadow: `${lateral}px ${longitude}px ${nomalBlur}px ${spread}px transparent, inset ${lateral}px ${longitude}px ${nomalBlur}px ${spread}px ${shadowColor}`,
            },
          }
        : {
            style: {
              boxShadow: `${lateral}px ${longitude}px ${nomalBlur}px ${spread}px ${shadowColor}, inset ${lateral}px ${longitude}px ${nomalBlur}px ${spread}px transparent`,
            },
          };
    //Shadowのスタイルを返す
    return ShadowStyle;
  }
  //ニューモフィズム
  // --- ニューモフィズム ---
  else if (shadowType === "newmor") {
    if (isGradient(baseColor)) {
      (dispatch("core/notices") as any).createNotice(
        "error",
        __(
          "Neumorphism cannot be set when the background color is a gradient.",
          "itmar_guest_contact_block",
        ),
        { type: "snackbar", isDismissible: true },
      );
      return null;
    }

    const hslValue = rgb16ToHsl(baseColor);
    if (!hslValue) return null; // カラー変換失敗時のガード

    const lightVal = Math.min(hslValue.lightness + intensity, 100);
    const darkVal = Math.max(hslValue.lightness - intensity, 0);

    const lightValue = hslToRgb16(hslValue.hue, hslValue.saturation, lightVal);
    const darkValue = hslToRgb16(hslValue.hue, hslValue.saturation, darkVal);
    const dircObj = dirctionDigit(newDirection, distance);

    const baseBoxShadow =
      embos === "swell"
        ? `${dircObj.topLeft}px ${dircObj.topRight}px ${blur}px ${darkValue}, ${dircObj.bottomLeft}px ${dircObj.bottomRight}px ${blur}px ${lightValue}, inset ${dircObj.topLeft}px ${dircObj.topRight}px ${blur}px transparent, inset ${dircObj.bottomLeft}px ${dircObj.bottomRight}px ${blur}px transparent`
        : `${dircObj.topLeft}px ${dircObj.topRight}px ${blur}px transparent, ${dircObj.bottomLeft}px ${dircObj.bottomRight}px ${blur}px transparent, inset ${dircObj.topLeft}px ${dircObj.topRight}px ${blur}px ${darkValue}, inset ${dircObj.bottomLeft}px ${dircObj.bottomRight}px ${blur}px ${lightValue}`;

    return {
      style: {
        border: "none",
        background: baseColor,
        boxShadow: baseBoxShadow,
      },
    };
  }

  // --- クレイモーフィズム ---
  else if (shadowType === "claymor") {
    if (isGradient(baseColor)) {
      (dispatch("core/notices") as any).createNotice(
        "error",
        __(
          "claymorphism cannot be set when the background color is a gradient.",
          "itmar_guest_contact_block",
        ),
        { type: "snackbar", isDismissible: true },
      );
      return null;
    }
    const rgbValue = HexToRGB(baseColor);
    if (!rgbValue) return null;

    const outsetObj = dirctionDigit(clayDirection, expand);
    const insetObj = dirctionDigit(clayDirection, depth);

    return {
      style: {
        background: `rgba(255, 255, 255, ${opacity})`,
        backdropFilter: `blur(${bdBlur}px)`,
        border: "none",
        boxShadow: `${outsetObj.topLeft}px ${outsetObj.bottomRight}px ${expand * 2}px 0px rgba(${rgbValue.red}, ${rgbValue.green}, ${rgbValue.blue}, 0.5), inset ${insetObj.topRight}px ${insetObj.bottomLeft}px 16px 0px rgba(${rgbValue.red}, ${rgbValue.green}, ${rgbValue.blue}, 0.6), inset 0px 11px 28px 0px rgb(255, 255, 255)`,
      },
    };
  }

  // --- グラスモーフィズム ---
  else if (shadowType === "glassmor") {
    const glassBoxShadow =
      embos === "swell"
        ? `0 8px 12px 0 rgba( 31, 38, 135, 0.37 ), inset 0 8px 12px 0 transparent`
        : `0 8px 12px 0 transparent, inset 0 8px 12px 0 rgba( 31, 38, 135, 0.37 )`;

    return {
      style: {
        backgroundColor: `rgba(255, 255, 255, ${glassopa})`,
        ...(hasOutline ? { border: `1px solid rgba(255, 255, 255, 0.4)` } : {}),
        borderRightColor: `rgba(255, 255, 255, 0.2)`,
        borderBottomColor: `rgba(255, 255, 255, 0.2)`,
        backdropFilter: `blur(${glassblur}px)`,
        boxShadow: glassBoxShadow,
      },
    };
  }

  return null;
};

interface ShadowStyleProps {
  shadowStyle: ShadowState;
  onChange: (elm: ShadowResult, state: ShadowState) => void;
}
const ShadowStyle = ({ shadowStyle, onChange }: ShadowStyleProps) => {
  const [shadowState, setShadowState] = useState<ShadowState>(shadowStyle);

  const {
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
  } = shadowState;

  //シャドーのスタイル変更と背景色変更に伴う親コンポーネントの変更
  useEffect(() => {
    const shadowElm = ShadowElm(shadowState);
    if (shadowElm) onChange(shadowElm, shadowState);
  }, [shadowState]);

  // ヘルパー: ステートの一部を更新
  const updateState = (partial: Partial<ShadowState>) => {
    setShadowState((prev) => ({ ...prev, ...partial }));
  };

  return (
    <>
      <PanelBody
        title={__("Shadow Type", "block-collections")}
        initialOpen={true}
      >
        <div className="itmar_shadow_type">
          <RadioControl
            selected={shadowType}
            options={[
              { label: __("Normal", "block-collections"), value: "nomal" },
              {
                label: __("Neumorphism", "block-collections"),
                value: "newmor",
              },
              {
                label: __("Claymorphism", "block-collections"),
                value: "claymor",
              },
              {
                label: __("Glassmorphism", "block-collections"),
                value: "glassmor",
              },
            ]}
            onChange={(val) =>
              updateState({ shadowType: val as ShadowState["shadowType"] })
            }
          />
        </div>
        {shadowType !== "claymor" && (
          <div className="embos">
            <RadioControl
              label={__("unevenness", "block-collections")}
              selected={embos}
              options={[
                { label: "Swell", value: "swell" },
                { label: "Dent", value: "dent" },
              ]}
              onChange={(val) =>
                updateState({ embos: val as ShadowState["embos"] })
              }
            />
          </div>
        )}
      </PanelBody>

      {/* --- Normal Settings --- */}
      {shadowType === "nomal" && (
        <PanelBody
          title={__("Normal settings", "block-collections")}
          initialOpen={false}
        >
          <RangeControl
            value={spread}
            label={__("Spread", "block-collections")}
            max={50}
            min={0}
            onChange={(val) => updateState({ spread: val ?? 0 })}
          />
          <RangeControl
            value={lateral}
            label={__("Lateral direction", "block-collections")}
            max={50}
            min={0}
            onChange={(val) => updateState({ lateral: val ?? 0 })}
          />
          <RangeControl
            value={longitude}
            label={__("Longitudinal direction", "block-collections")}
            max={50}
            min={0}
            onChange={(val) => updateState({ longitude: val ?? 0 })}
          />
          <RangeControl
            value={nomalBlur}
            label={__("Blur", "block-collections")}
            max={20}
            min={0}
            onChange={(val) => updateState({ nomalBlur: val ?? 0 })}
          />
          <PanelColorSettings
            title={__("Shadow Color Setting", "block-collections")}
            colorSettings={[
              {
                value: shadowColor,
                label: __("Choose Shadow color", "block-collections"),
                onChange: (val) => updateState({ shadowColor: val || "" }),
              },
            ]}
          />
        </PanelBody>
      )}

      {/* --- Neumorphism Settings --- */}
      {shadowType === "newmor" && (
        <PanelBody
          title={__("Neumorphism settings", "block-collections")}
          initialOpen={false}
        >
          <RangeControl
            value={distance}
            label={__("Distance", "block-collections")}
            max={50}
            min={0}
            onChange={(val) => updateState({ distance: val ?? 0 })}
          />
          <RangeControl
            value={intensity}
            label={__("Intensity", "block-collections")}
            max={100}
            min={0}
            onChange={(val) => updateState({ intensity: val ?? 0 })}
          />
          <RangeControl
            value={blur}
            label={__("Blur", "block-collections")}
            max={20}
            min={0}
            onChange={(val) => updateState({ blur: val ?? 0 })}
          />
          <PanelRow>
            <div className="light_direction">
              <RadioControl
                selected={newDirection}
                options={[
                  { label: "Top Left", value: "top_left" },
                  { label: "Top Right", value: "top_right" },
                  { label: "Bottom Left", value: "bottom_left" },
                  { label: "Bottom Right", value: "bottom_right" },
                ]}
                onChange={(val) =>
                  updateState({ newDirection: val as CornerDirection })
                }
              />
            </div>
          </PanelRow>
        </PanelBody>
      )}

      {/* --- Claymorphism Settings --- */}
      {shadowType === "claymor" && (
        <PanelBody
          title={__("Claymorphism settings", "block-collections")}
          initialOpen={false}
        >
          <RangeControl
            value={opacity}
            label={__("Opacity", "block-collections")}
            max={1}
            min={0}
            step={0.1}
            onChange={(val) => updateState({ opacity: val ?? 1 })}
          />
          <RangeControl
            value={depth}
            label="Depth"
            max={20}
            min={0}
            onChange={(val) => updateState({ depth: val ?? 0 })}
          />
          <RangeControl
            value={expand}
            label="Expand"
            max={50}
            min={0}
            onChange={(val) => updateState({ expand: val ?? 0 })}
          />
          <RangeControl
            value={bdBlur}
            label="Background Blur"
            max={10}
            min={0}
            onChange={(val) => updateState({ bdBlur: val ?? 0 })}
          />
          <div className="light_direction claymor">
            <RadioControl
              selected={clayDirection}
              options={[
                { label: "Right Bottom", value: "right_bottom" },
                { label: "Top Right", value: "top_right" },
                { label: "Top", value: "top" },
              ]}
              onChange={(val) =>
                updateState({ clayDirection: val as CornerDirection })
              }
            />
          </div>
        </PanelBody>
      )}

      {/* --- Glassmorphism Settings --- */}
      {shadowType === "glassmor" && (
        <PanelBody
          title={__("Grassmophism settings", "block-collections")}
          initialOpen={false}
        >
          <RangeControl
            value={glassblur}
            label={__("Glass blur", "block-collections")}
            max={20}
            min={0}
            onChange={(val) => updateState({ glassblur: val ?? 0 })}
          />
          <RangeControl
            value={glassopa}
            label={__("Glass Opacity", "block-collections")}
            max={1}
            min={0}
            step={0.1}
            onChange={(val) => updateState({ glassopa: val ?? 0.5 })}
          />
          <ToggleControl
            label={__("Show outline", "block-collections")}
            checked={hasOutline}
            onChange={(val) => updateState({ hasOutline: val })}
          />
        </PanelBody>
      )}
    </>
  );
};
export default ShadowStyle;
