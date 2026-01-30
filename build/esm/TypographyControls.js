import { objectSpread2 as _objectSpread2 } from './_virtual/_rollupPluginBabelHelpers.js';
import { PanelBody, __experimentalUnitControl, PanelRow, RadioControl, ToggleControl } from '@wordpress/components';
import Select from 'react-select';
import { __ } from '@wordpress/i18n';

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
    option: (provided, state) => _objectSpread2(_objectSpread2({}, provided), {}, {
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
  return /*#__PURE__*/React.createElement(PanelBody, {
    title: title,
    initialOpen: initialOpen
  }, /*#__PURE__*/React.createElement(__experimentalUnitControl, {
    dragDirection: "e",
    onChange: newValue => {
      newValue = newValue != "" ? newValue : "0px";
      var set_size = !isMobile ? {
        default_fontSize: newValue
      } : {
        mobile_fontSize: newValue
      };
      var newStyle = _objectSpread2(_objectSpread2({}, fontStyle), set_size);
      _onChange2(newStyle);
    },
    label: !isMobile ? __("Size(desk top)", "block-collections") : __("Size(mobile)", "block-collections"),
    value: !isMobile ? default_fontSize : mobile_fontSize,
    units: units
  }), /*#__PURE__*/React.createElement(FontSelect, {
    label: __("font family", "block-collections"),
    value: fontFamily,
    onChange: newValue => {
      var newStyle = _objectSpread2(_objectSpread2({}, fontStyle), {}, {
        fontFamily: newValue
      });
      _onChange2(newStyle);
    }
  }), /*#__PURE__*/React.createElement("label", {
    className: "components-base-control__label"
  }, __("font weight", "block-collections")), /*#__PURE__*/React.createElement(PanelRow, {
    className: "itmar_weight_row"
  }, /*#__PURE__*/React.createElement(RadioControl, {
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
      var newStyle = _objectSpread2(_objectSpread2({}, fontStyle), {}, {
        fontWeight: newValue
      });
      _onChange2(newStyle);
    }
  })), /*#__PURE__*/React.createElement("label", {
    className: "components-base-control__label"
  }, __("Italic display", "block-collections")), /*#__PURE__*/React.createElement(ToggleControl, {
    checked: isItalic,
    onChange: newValue => {
      var newStyle = _objectSpread2(_objectSpread2({}, fontStyle), {}, {
        isItalic: newValue
      });
      _onChange2(newStyle);
    }
  }));
};

export { TypographyControls as default };
//# sourceMappingURL=TypographyControls.js.map
