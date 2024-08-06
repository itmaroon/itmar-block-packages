import { __ } from "@wordpress/i18n";

import {
  TextControl,
  PanelRow,
  RadioControl,
  ComboboxControl,
  __experimentalUnitControl as UnitControl,
} from "@wordpress/components";

import { PanelColorSettings } from "@wordpress/block-editor";

const helpLink = createElement(
  "a",
  { href: "https://fontawesome.com/search", target: "_blank" },
  "FontAwesome"
);

const helpTextCode = createElement(
  "span",
  {},
  helpLink,
  __(
    "Select the icon from and enter Unicode (the upper right four digits of the selection dialog). ",
    "block-collections"
  )
);

const helpTextFamily = createElement(
  "span",
  {},
  helpLink,
  __(
    "Please select the first class name shown in the HTML code field of the selection dialog. ",
    "block-collections"
  )
);

const units = [
  { value: "px", label: "px" },
  { value: "em", label: "em" },
  { value: "rem", label: "rem" },
];

const family_option = [
  { value: "Font Awesome 6 Free", label: "SOLID" },
  { value: "Font Awesome 6 Brands", label: "BRANDS" },
];

export default ({ iconStyle, setPosition, onChange }) => {
  const {
    icon_name,
    icon_pos,
    icon_size,
    icon_color,
    icon_space,
    icon_family,
  } = iconStyle;

  return (
    <>
      <TextControl
        label={__("icon name", "block-collections")}
        help={helpTextCode}
        labelPosition="top"
        value={icon_name}
        isPressEnterToChange
        onChange={(newValue) => {
          const newStyle = { ...iconStyle, icon_name: newValue };
          onChange(newStyle);
        }}
      />

      <ComboboxControl
        label={__("Icon Family", "block-collections")}
        help={helpTextFamily}
        options={family_option}
        value={icon_family ? icon_family : "Font Awesome 6 Free"}
        onChange={(newValue) => {
          const newStyle = { ...iconStyle, icon_family: newValue };
          onChange(newStyle);
        }}
      />

      <PanelRow className="sizing_row">
        <UnitControl
          dragDirection="e"
          onChange={(newValue) => {
            const newStyle = { ...iconStyle, icon_size: newValue };
            onChange(newStyle);
          }}
          label={__("Size", "block-collections")}
          value={icon_size}
          units={units}
        />
        {setPosition && (
          <UnitControl
            dragDirection="e"
            onChange={(newValue) => {
              const newStyle = { ...iconStyle, icon_space: newValue };
              onChange(newStyle);
            }}
            label={__("spacing to end", "block-collections")}
            value={icon_space}
            units={units}
          />
        )}
      </PanelRow>

      <PanelColorSettings
        title={__("Color settings", "itmar_location")}
        initialOpen={false}
        colorSettings={[
          {
            value: icon_color,
            onChange: (newValue) => {
              const newStyle = { ...iconStyle, icon_color: newValue };
              onChange(newStyle);
            },
            label: __("Icon color", "itmar_location"),
          },
        ]}
      />
      {setPosition && (
        <>
          <label className="components-base-control__label">
            {__("Arrangement", "block-collections")}
          </label>
          <PanelRow className="itmar_position_row">
            <RadioControl
              selected={icon_pos}
              options={[
                { label: __("left", "block-collections"), value: "left" },
                { label: __("right", "block-collections"), value: "right" },
              ]}
              onChange={(newValue) => {
                const newStyle = { ...iconStyle, icon_pos: newValue };
                onChange(newStyle);
              }}
            />
          </PanelRow>
        </>
      )}
    </>
  );
};
