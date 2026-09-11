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

import { ShadowElm } from "./shadowCss";
import type {
  ShadowState,
  ShadowResult,
  CornerDirection,
  ShadowErrorReason,
} from "./shadowCss";

/**
 * 影のスタイル算出は @wordpress 非依存の ./shadowCss へ移した。
 * ビュースクリプトが `ShadowElm` を参照する際に、このファイル
 * （@wordpress/block-editor 依存）を引き込まないようにするため。
 * 後方互換のためここから再エクスポートする。
 */
export { ShadowElm };
export type { ShadowState, ShadowResult, CornerDirection, ShadowErrorReason };

/** 影を算出できなかったときに編集画面へ通知する。算出ロジック側は純粋に保つ。 */
const notifyShadowError = (reason: ShadowErrorReason): void => {
  let message: string;

  if (reason === "gradient-newmor") {
    message = __(
      "Neumorphism cannot be set when the background color is a gradient.",
      "itmar_guest_contact_block",
    );
  } else if (reason === "gradient-claymor") {
    message = __(
      "claymorphism cannot be set when the background color is a gradient.",
      "itmar_guest_contact_block",
    );
  } else {
    message = __(
      "Failed to interpret the base color.",
      "itmar_guest_contact_block",
    );
  }

  (dispatch("core/notices") as any).createNotice("error", message, {
    type: "snackbar",
    isDismissible: true,
  });
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
    const shadowElm = ShadowElm(shadowState, notifyShadowError);
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
