'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _rollupPluginBabelHelpers = require('./_virtual/_rollupPluginBabelHelpers.js');
var i18n = require('@wordpress/i18n');
var components = require('@wordpress/components');
var blockEditor = require('@wordpress/block-editor');

var helpLink = createElement("a", {
  href: "https://fontawesome.com/search",
  target: "_blank"
}, "FontAwesome");
var helpTextCode = createElement("span", {}, helpLink, i18n.__("Select the icon from and enter Unicode (the upper right four digits of the selection dialog). ", "block-collections"));
var helpImageURL = createElement("span", {}, i18n.__("Enter the URL for the image.", "block-collections"));
var helpTextFamily = createElement("span", {}, i18n.__("Please select the first class name shown in the HTML code field of the selection dialog. ", "block-collections"));
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
  }, i18n.__("Icon Types", "block-collections")), /*#__PURE__*/React.createElement(components.PanelRow, {
    className: "itmar_position_row"
  }, /*#__PURE__*/React.createElement(components.RadioControl, {
    selected: icon_type,
    options: [{
      label: i18n.__("Awesome", "block-collections"),
      value: "awesome"
    }, {
      label: i18n.__("Image", "block-collections"),
      value: "image"
    }, {
      label: i18n.__("Avatar", "block-collections"),
      value: "avatar"
    }],
    onChange: newValue => {
      var newStyle = _rollupPluginBabelHelpers.objectSpread2(_rollupPluginBabelHelpers.objectSpread2({}, iconStyle), {}, {
        icon_type: newValue
      });
      _onChange(newStyle);
    }
  })), icon_type === "awesome" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(components.TextControl, {
    label: i18n.__("icon name", "block-collections"),
    help: helpTextCode,
    labelPosition: "top",
    value: icon_name,
    isPressEnterToChange: true,
    onChange: newValue => {
      var newStyle = _rollupPluginBabelHelpers.objectSpread2(_rollupPluginBabelHelpers.objectSpread2({}, iconStyle), {}, {
        icon_name: newValue
      });
      _onChange(newStyle);
    }
  }), /*#__PURE__*/React.createElement(components.ComboboxControl, {
    label: i18n.__("Icon Family", "block-collections"),
    help: helpTextFamily,
    options: family_option,
    value: icon_family ? icon_family : "Font Awesome 6 Free",
    onChange: newValue => {
      var newStyle = _rollupPluginBabelHelpers.objectSpread2(_rollupPluginBabelHelpers.objectSpread2({}, iconStyle), {}, {
        icon_family: newValue
      });
      _onChange(newStyle);
    }
  })), icon_type === "image" && /*#__PURE__*/React.createElement(components.TextControl, {
    label: i18n.__("icon url", "block-collections"),
    help: helpImageURL,
    labelPosition: "top",
    value: icon_url,
    isPressEnterToChange: true,
    onChange: newValue => {
      var newStyle = _rollupPluginBabelHelpers.objectSpread2(_rollupPluginBabelHelpers.objectSpread2({}, iconStyle), {}, {
        icon_url: newValue
      });
      _onChange(newStyle);
    }
  }), /*#__PURE__*/React.createElement(components.PanelRow, {
    className: "sizing_row"
  }, /*#__PURE__*/React.createElement(components.__experimentalUnitControl, {
    dragDirection: "e",
    onChange: newValue => {
      var newStyle = _rollupPluginBabelHelpers.objectSpread2(_rollupPluginBabelHelpers.objectSpread2({}, iconStyle), {}, {
        icon_size: newValue
      });
      _onChange(newStyle);
    },
    label: i18n.__("Size", "block-collections"),
    value: icon_size,
    units: units
  }), setPosition && /*#__PURE__*/React.createElement(components.__experimentalUnitControl, {
    dragDirection: "e",
    onChange: newValue => {
      var newStyle = _rollupPluginBabelHelpers.objectSpread2(_rollupPluginBabelHelpers.objectSpread2({}, iconStyle), {}, {
        icon_space: newValue
      });
      _onChange(newStyle);
    },
    label: i18n.__("spacing to end", "block-collections"),
    value: icon_space,
    units: units
  })), /*#__PURE__*/React.createElement(blockEditor.PanelColorSettings, {
    title: i18n.__("Color settings", "itmar_location"),
    initialOpen: false,
    colorSettings: [{
      value: icon_color,
      onChange: newValue => {
        var newStyle = _rollupPluginBabelHelpers.objectSpread2(_rollupPluginBabelHelpers.objectSpread2({}, iconStyle), {}, {
          icon_color: newValue
        });
        _onChange(newStyle);
      },
      label: i18n.__("Icon color", "itmar_location")
    }]
  }), setPosition && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
    className: "components-base-control__label"
  }, i18n.__("Arrangement", "block-collections")), /*#__PURE__*/React.createElement(components.PanelRow, {
    className: "itmar_position_row"
  }, /*#__PURE__*/React.createElement(components.RadioControl, {
    selected: icon_pos,
    options: [{
      label: i18n.__("left", "block-collections"),
      value: "left"
    }, {
      label: i18n.__("right", "block-collections"),
      value: "right"
    }],
    onChange: newValue => {
      var newStyle = _rollupPluginBabelHelpers.objectSpread2(_rollupPluginBabelHelpers.objectSpread2({}, iconStyle), {}, {
        icon_pos: newValue
      });
      _onChange(newStyle);
    }
  }))));
};

exports.default = IconSelectControl;
//# sourceMappingURL=IconSelectControl.js.map
