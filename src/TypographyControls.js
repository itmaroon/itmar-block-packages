import {
  PanelBody,
  PanelRow,
  RadioControl,
  ToggleControl,
  __experimentalUnitControl as UnitControl,
} from "@wordpress/components";

import Select from "react-select";
import { __ } from "@wordpress/i18n";

const TypographyControls = ({
  title,
  fontStyle,
  initialOpen,
  isMobile,
  onChange,
}) => {
  const {
    default_fontSize,
    mobile_fontSize,
    fontSize,
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

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      fontFamily: state.data.fontFamily,
    }),
  };

  const FontSelect = ({ label, value, onChange }) => (
    <>
      {label && (
        <label className="components-base-control__label">{label}</label>
      )}
      <Select
        options={fontFamilyOptions}
        value={fontFamilyOptions.find((option) => option.value === value)}
        onChange={(newValue) => {
          onChange(newValue.value);
        }}
        styles={customStyles}
      />
    </>
  );

  return (
    <PanelBody title={title} initialOpen={initialOpen}>
      <UnitControl
        dragDirection="e"
        onChange={(newValue) => {
          newValue = newValue != "" ? newValue : "0px";
          const set_size = !isMobile
            ? { default_fontSize: newValue }
            : { mobile_fontSize: newValue };
          const newStyle = { ...fontStyle, ...set_size };
          onChange(newStyle);
        }}
        label={
          !isMobile
            ? __("Size(desk top)", "block-collections")
            : __("Size(mobile)", "block-collections")
        }
        value={!isMobile ? default_fontSize : mobile_fontSize}
        units={units}
      />

      <FontSelect
        label={__("font family", "block-collections")}
        value={fontFamily}
        onChange={(newValue) => {
          const newStyle = { ...fontStyle, fontFamily: newValue };
          onChange(newStyle);
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

      <label className="components-base-control__label">
        {__("Italic display", "block-collections")}
      </label>
      <ToggleControl
        checked={isItalic}
        onChange={(newValue) => {
          const newStyle = { ...fontStyle, isItalic: newValue };
          onChange(newStyle);
        }}
      />
    </PanelBody>
  );
};
export default TypographyControls;
