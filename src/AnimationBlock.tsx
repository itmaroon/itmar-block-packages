import { __ } from "@wordpress/i18n";
import { css, keyframes } from "styled-components";
import { createElement, Fragment } from "@wordpress/element";

import {
  PanelBody,
  ToggleControl,
  RadioControl,
  RangeControl,
} from "@wordpress/components";

// 1. まず属性の型を定義します（将来的に別ファイルに切り出すと便利です）
interface AnimeAttributes {
  pattern?: string;
  delay?: number | string;
  duration?: number | string;
  [key: string]: any; // 他の属性が含まれていてもエラーにならないようにする「インデックスシグネチャ」
}

export const anime_comp = (attributes: AnimeAttributes) => {
  return css`
    &.fadeTrigger {
      opacity: 0;
    }
    &.${attributes.pattern} {
      animation-name: ${attributes.pattern};
      animation-delay: ${attributes.delay}s;
      animation-duration: ${attributes.duration}s;
      animation-fill-mode: forwards;
      opacity: 0;
    }
  `;
};

// 1. attributesの中身（anime_prm）の型を定義
interface AnimePrm {
  pattern: string;
  duration: number;
  delay: number;
  trigger: string;
}

// 2. コンポーネント全体のPropsの型を定義
interface AnimationBlockProps {
  attributes: {
    is_anime: boolean;
    anime_prm: AnimePrm;
  };
  // WordPressのsetAttributesに相当する、親から渡される変更関数
  onChange: (newAttributes: Partial<AnimationBlockProps["attributes"]>) => void;
}

export default function AnimationBlock(props: AnimationBlockProps) {
  const { is_anime, anime_prm } = props.attributes;

  return (
    <>
      <PanelBody
        title={__("Animation Setting", "block-collections")}
        initialOpen={true}
      >
        <ToggleControl
          label={__("Is Animation", "block-collections")}
          checked={is_anime}
          onChange={(newVal) => {
            props.onChange({ is_anime: newVal });
          }}
        />
        {is_anime && (
          <>
            <div className="itmar_link_type">
              <RadioControl
                label={__("Animation Pattern", "block-collections")}
                selected={anime_prm.pattern}
                options={[
                  { label: "flipDown", value: "flipDown" },
                  { label: "fadeUp", value: "fadeUp" },
                  { label: "fadeLeft", value: "fadeLeft" },
                  { label: "fadeRight", value: "fadeRight" },
                ]}
                onChange={(changeOption) => {
                  props.onChange({
                    anime_prm: { ...anime_prm, pattern: changeOption },
                  });
                }}
              />
            </div>

            <RangeControl
              value={anime_prm.duration}
              label={__("Animation duration time", "block-collections")}
              max={5}
              min={0}
              onChange={(val?: number) => {
                // val が undefined の場合は 0（または適切なデフォルト値）を採用する
                const safeValue = val ?? 0;
                props.onChange({
                  anime_prm: { ...anime_prm, duration: safeValue },
                });
              }}
              step={0.1}
              withInputField={true}
            />

            <RangeControl
              value={anime_prm.delay}
              label={__("Animation delay time", "block-collections")}
              max={3}
              min={0}
              onChange={(val?: number) => {
                // val が undefined の場合は 0（または適切なデフォルト値）を採用する
                const safeValue = val ?? 0;
                props.onChange({
                  anime_prm: { ...anime_prm, delay: safeValue },
                });
              }}
              step={0.1}
              withInputField={true}
            />

            <div className="itmar_link_type">
              <RadioControl
                label={__("Animation Trigger", "block-collections")}
                selected={anime_prm.trigger}
                options={[
                  {
                    label: __("Page Opend", "block-collections"),
                    value: "opend",
                  },
                  {
                    label: __("Enter Visible", "block-collections"),
                    value: "visible",
                  },
                ]}
                onChange={(changeOption) => {
                  props.onChange({
                    anime_prm: { ...anime_prm, trigger: changeOption },
                  });
                }}
              />
            </div>
          </>
        )}
      </PanelBody>
    </>
  );
}
