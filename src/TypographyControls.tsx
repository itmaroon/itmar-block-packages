import { createElement, Fragment } from "@wordpress/element";
import {
  PanelBody,
  PanelRow,
  RadioControl,
  ToggleControl,
  __experimentalUnitControl as UnitControl,
} from "@wordpress/components";

import Select from "react-select";
import { __ } from "@wordpress/i18n";

// 1. FontStyle の型定義
interface FontStyle {
  default_fontSize: string;
  mobile_fontSize: string;
  fontSize?: string; // 互換性のため
  fontFamily: string;
  fontWeight: string;
  isItalic: boolean;
}

// 2. Props の型定義
interface TypographyControlsProps {
  title: string;
  fontStyle: FontStyle;
  initialOpen?: boolean;
  isMobile: boolean;
  onChange: (newStyle: FontStyle) => void;
}

const TypographyControls = ({
  title,
  fontStyle,
  initialOpen = true,
  isMobile,
  onChange,
}: TypographyControlsProps) => {
  const {
    default_fontSize,
    mobile_fontSize,
    fontFamily,
    fontWeight,
    isItalic,
  } = fontStyle;

  const fontFamilyOptions = [
    {
      value: "Arial, sans-serif",
      label: "Arial",
      fontFamily: "Arial, sans-serif",
    },
    {
      value: "Courier New, monospace",
      label: "Courier New",
      fontFamily: "Courier New, monospace",
    },
    { value: "Georgia, serif", label: "Georgia", fontFamily: "Georgia, serif" },
    {
      label: "Noto Sans JP",
      value: "Noto Sans JP, sans-serif",
      fontFamily: "Noto Sans JP, sans-serif",
    },
    {
      label: "Texturina",
      value: "Texturina, serif",
      fontFamily: "Texturina, serif",
    },
  ];

  const units = [
    { value: "px", label: "px" },
    { value: "em", label: "em" },
    { value: "rem", label: "rem" },
  ];

  // react-select 用のスタイル定義
  const customStyles = {
    option: (provided: any, state: any) => ({
      ...provided,
      fontFamily: state.data.fontFamily,
    }),
  };

  // 内部コンポーネント FontSelect
  const FontSelect = ({
    label,
    value,
    onSelectChange,
  }: {
    label: string;
    value: string;
    onSelectChange: (val: string) => void;
  }) => (
    <>
      {label && (
        <label className="components-base-control__label">{label}</label>
      )}
      <Select
        options={fontFamilyOptions}
        value={fontFamilyOptions.find((option) => option.value === value)}
        onChange={(newValue: any) => {
          onSelectChange(newValue.value);
        }}
        styles={customStyles}
      />
    </>
  );

  return (
    <PanelBody title={title} initialOpen={initialOpen}>
      <UnitControl
        label={
          !isMobile
            ? __("Size(desktop)", "block-collections")
            : __("Size(mobile)", "block-collections")
        }
        value={!isMobile ? default_fontSize : mobile_fontSize}
        units={units}
        onChange={(newValue?: string) => {
          const safeValue =
            newValue !== undefined && newValue !== "" ? newValue : "0px";
          const set_size = !isMobile
            ? { default_fontSize: safeValue }
            : { mobile_fontSize: safeValue };
          onChange({ ...fontStyle, ...set_size });
        }}
      />

      <FontSelect
        label={__("font family", "block-collections")}
        value={fontFamily}
        onSelectChange={(newValue) => {
          onChange({ ...fontStyle, fontFamily: newValue });
        }}
      />

      <label className="components-base-control__label">
        {__("font weight", "block-collections")}
      </label>
      <PanelRow className="itmar_weight_row">
        <RadioControl
          selected={fontWeight}
          options={[
            { label: "LIGHT", value: "300" },
            { label: "REGULAR", value: "400" },
            { label: "MEDIUM", value: "500" },
            { label: "S-BOLD", value: "600" },
            { label: "BOLD", value: "700" },
            { label: "BLACK", value: "900" },
          ]}
          onChange={(newValue) => {
            const newStyle = { ...fontStyle, fontWeight: newValue };
            onChange(newStyle);
          }}
        />
      </PanelRow>

      <ToggleControl
        label={__("Italic display", "block-collections")}
        checked={isItalic}
        onChange={(newValue: boolean) => {
          onChange({ ...fontStyle, isItalic: newValue });
        }}
      />
    </PanelBody>
  );
};
export default TypographyControls;
