import { objectSpread2 as _objectSpread2 } from './_virtual/_rollupPluginBabelHelpers.js';
import { __ } from '@wordpress/i18n';
import { PanelRow, RadioControl, TextControl, ComboboxControl, __experimentalUnitControl } from '@wordpress/components';
import { PanelColorSettings } from '@wordpress/block-editor';

var helpLink = createElement("a", {
  href: "https://fontawesome.com/search",
  target: "_blank"
}, "FontAwesome");
var helpTextCode = createElement("span", {}, helpLink, __("Select the icon from and enter Unicode (the upper right four digits of the selection dialog). ", "block-collections"));
var helpImageURL = createElement("span", {}, __("Enter the URL for the image.", "block-collections"));
var helpTextFamily = createElement("span", {}, __("Please select the first class name shown in the HTML code field of the selection dialog. ", "block-collections"));
var units = [{
  value: "px",
  label: "px"
}, {
  value: "em",
  label: "em"
}, {
  value: "rem",
  label: "rem"
}];
var family_option = [{
  value: "Font Awesome 6 Free",
  label: "SOLID"
}, {
  value: "Font Awesome 6 Brands",
  label: "BRANDS"
}];
var IconSelectControl = _ref => {
  var {
    iconStyle,
    setPosition,
    onChange: _onChange
  } = _ref;
  var {
    icon_type,
    icon_url,
    icon_name,
    icon_pos,
    icon_size,
    icon_color,
    icon_space,
    icon_family
  } = iconStyle;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
    className: "components-base-control__label"
  }, __("Icon Types", "block-collections")), /*#__PURE__*/React.createElement(PanelRow, {
    className: "itmar_position_row"
  }, /*#__PURE__*/React.createElement(RadioControl, {
    selected: icon_type,
    options: [{
      label: __("Awesome", "block-collections"),
      value: "awesome"
    }, {
      label: __("Image", "block-collections"),
      value: "image"
    }, {
      label: __("Avatar", "block-collections"),
      value: "avatar"
    }],
    onChange: newValue => {
      var newStyle = _objectSpread2(_objectSpread2({}, iconStyle), {}, {
        icon_type: newValue
      });
      _onChange(newStyle);
    }
  })), icon_type === "awesome" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TextControl, {
    label: __("icon name", "block-collections"),
    help: helpTextCode,
    labelPosition: "top",
    value: icon_name,
    isPressEnterToChange: true,
    onChange: newValue => {
      var newStyle = _objectSpread2(_objectSpread2({}, iconStyle), {}, {
        icon_name: newValue
      });
      _onChange(newStyle);
    }
  }), /*#__PURE__*/React.createElement(ComboboxControl, {
    label: __("Icon Family", "block-collections"),
    help: helpTextFamily,
    options: family_option,
    value: icon_family ? icon_family : "Font Awesome 6 Free",
    onChange: newValue => {
      var newStyle = _objectSpread2(_objectSpread2({}, iconStyle), {}, {
        icon_family: newValue
      });
      _onChange(newStyle);
    }
  })), icon_type === "image" && /*#__PURE__*/React.createElement(TextControl, {
    label: __("icon url", "block-collections"),
    help: helpImageURL,
    labelPosition: "top",
    value: icon_url,
    isPressEnterToChange: true,
    onChange: newValue => {
      var newStyle = _objectSpread2(_objectSpread2({}, iconStyle), {}, {
        icon_url: newValue
      });
      _onChange(newStyle);
    }
  }), /*#__PURE__*/React.createElement(PanelRow, {
    className: "sizing_row"
  }, /*#__PURE__*/React.createElement(__experimentalUnitControl, {
    dragDirection: "e",
    onChange: newValue => {
      var newStyle = _objectSpread2(_objectSpread2({}, iconStyle), {}, {
        icon_size: newValue
      });
      _onChange(newStyle);
    },
    label: __("Size", "block-collections"),
    value: icon_size,
    units: units
  }), setPosition && /*#__PURE__*/React.createElement(__experimentalUnitControl, {
    dragDirection: "e",
    onChange: newValue => {
      var newStyle = _objectSpread2(_objectSpread2({}, iconStyle), {}, {
        icon_space: newValue
      });
      _onChange(newStyle);
    },
    label: __("spacing to end", "block-collections"),
    value: icon_space,
    units: units
  })), /*#__PURE__*/React.createElement(PanelColorSettings, {
    title: __("Color settings", "itmar_location"),
    initialOpen: false,
    colorSettings: [{
      value: icon_color,
      onChange: newValue => {
        var newStyle = _objectSpread2(_objectSpread2({}, iconStyle), {}, {
          icon_color: newValue
        });
        _onChange(newStyle);
      },
      label: __("Icon color", "itmar_location")
    }]
  }), setPosition && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
    className: "components-base-control__label"
  }, __("Arrangement", "block-collections")), /*#__PURE__*/React.createElement(PanelRow, {
    className: "itmar_position_row"
  }, /*#__PURE__*/React.createElement(RadioControl, {
    selected: icon_pos,
    options: [{
      label: __("left", "block-collections"),
      value: "left"
    }, {
      label: __("right", "block-collections"),
      value: "right"
    }],
    onChange: newValue => {
      var newStyle = _objectSpread2(_objectSpread2({}, iconStyle), {}, {
        icon_pos: newValue
      });
      _onChange(newStyle);
    }
  }))));
};

export { IconSelectControl as default };
//# sourceMappingURL=IconSelectControl.js.map
