'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _rollupPluginBabelHelpers = require('./_virtual/_rollupPluginBabelHelpers.js');
var components = require('@wordpress/components');
var Select = require('react-select');
var i18n = require('@wordpress/i18n');

var TypographyControls = _ref => {
  var {
    title,
    fontStyle,
    initialOpen,
    isMobile,
    onChange: _onChange2
  } = _ref;
  var {
    default_fontSize,
    mobile_fontSize,
    fontSize,
    fontFamily,
    fontWeight,
    isItalic
  } = fontStyle;
  var fontFamilyOptions = [{
    value: "Arial, sans-serif",
    label: "Arial",
    fontFamily: "Arial, sans-serif"
  }, {
    value: "Courier New, monospace",
    label: "Courier New",
    fontFamily: "Courier New, monospace"
  }, {
    value: "Georgia, serif",
    label: "Georgia",
    fontFamily: "Georgia, serif"
  }, {
    label: "Noto Sans JP",
    value: "Noto Sans JP, sans-serif",
    fontFamily: "Noto Sans JP, sans-serif"
  }, {
    label: "Texturina",
    value: "Texturina, serif",
    fontFamily: "Texturina, serif"
  }];
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
  var customStyles = {
    option: (provided, state) => _rollupPluginBabelHelpers.objectSpread2(_rollupPluginBabelHelpers.objectSpread2({}, provided), {}, {
      fontFamily: state.data.fontFamily
    })
  };
  var FontSelect = _ref2 => {
    var {
      label,
      value,
      onChange: _onChange
    } = _ref2;
    return /*#__PURE__*/React.createElement(React.Fragment, null, label && /*#__PURE__*/React.createElement("label", {
      className: "components-base-control__label"
    }, label), /*#__PURE__*/React.createElement(Select, {
      options: fontFamilyOptions,
      value: fontFamilyOptions.find(option => option.value === value),
      onChange: newValue => {
        _onChange(newValue.value);
      },
      styles: customStyles
    }));
  };
  return /*#__PURE__*/React.createElement(components.PanelBody, {
    title: title,
    initialOpen: initialOpen
  }, /*#__PURE__*/React.createElement(components.__experimentalUnitControl, {
    dragDirection: "e",
    onChange: newValue => {
      newValue = newValue != "" ? newValue : "0px";
      var set_size = !isMobile ? {
        default_fontSize: newValue
      } : {
        mobile_fontSize: newValue
      };
      var newStyle = _rollupPluginBabelHelpers.objectSpread2(_rollupPluginBabelHelpers.objectSpread2({}, fontStyle), set_size);
      _onChange2(newStyle);
    },
    label: !isMobile ? i18n.__("Size(desk top)", "block-collections") : i18n.__("Size(mobile)", "block-collections"),
    value: !isMobile ? default_fontSize : mobile_fontSize,
    units: units
  }), /*#__PURE__*/React.createElement(FontSelect, {
    label: i18n.__("font family", "block-collections"),
    value: fontFamily,
    onChange: newValue => {
      var newStyle = _rollupPluginBabelHelpers.objectSpread2(_rollupPluginBabelHelpers.objectSpread2({}, fontStyle), {}, {
        fontFamily: newValue
      });
      _onChange2(newStyle);
    }
  }), /*#__PURE__*/React.createElement("label", {
    className: "components-base-control__label"
  }, i18n.__("font weight", "block-collections")), /*#__PURE__*/React.createElement(components.PanelRow, {
    className: "itmar_weight_row"
  }, /*#__PURE__*/React.createElement(components.RadioControl, {
    selected: fontWeight,
    options: [{
      label: "LIGHT",
      value: "300"
    }, {
      label: "REGULAR",
      value: "400"
    }, {
      label: "MEDIUM",
      value: "500"
    }, {
      label: "S-BOLD",
      value: "600"
    }, {
      label: "BOLD",
      value: "700"
    }, {
      label: "BLACK",
      value: "900"
    }],
    onChange: newValue => {
      var newStyle = _rollupPluginBabelHelpers.objectSpread2(_rollupPluginBabelHelpers.objectSpread2({}, fontStyle), {}, {
        fontWeight: newValue
      });
      _onChange2(newStyle);
    }
  })), /*#__PURE__*/React.createElement("label", {
    className: "components-base-control__label"
  }, i18n.__("Italic display", "block-collections")), /*#__PURE__*/React.createElement(components.ToggleControl, {
    checked: isItalic,
    onChange: newValue => {
      var newStyle = _rollupPluginBabelHelpers.objectSpread2(_rollupPluginBabelHelpers.objectSpread2({}, fontStyle), {}, {
        isItalic: newValue
      });
      _onChange2(newStyle);
    }
  }));
};

exports.default = TypographyControls;
//# sourceMappingURL=TypographyControls.js.map
