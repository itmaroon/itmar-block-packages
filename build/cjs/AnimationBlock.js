'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _rollupPluginBabelHelpers = require('./_virtual/_rollupPluginBabelHelpers.js');
var i18n = require('@wordpress/i18n');
var styledComponents = require('styled-components');
var components = require('@wordpress/components');

var _templateObject;
var anime_comp = attributes => {
  return styledComponents.css(_templateObject || (_templateObject = _rollupPluginBabelHelpers.taggedTemplateLiteral(["\n    &.fadeTrigger {\n      opacity: 0;\n    }\n    &.", " {\n      animation-name: ", ";\n      animation-delay: ", "s;\n      animation-duration: ", "s;\n      animation-fill-mode: forwards;\n      opacity: 0;\n    }\n  "])), attributes.pattern, attributes.pattern, attributes.delay, attributes.duration);
};
function AnimationBlock(props) {
  var {
    is_anime,
    anime_prm
  } = props.attributes;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(components.PanelBody, {
    title: i18n.__("Animation Setting", "block-collections"),
    initialOpen: true
  }, /*#__PURE__*/React.createElement(components.ToggleControl, {
    label: i18n.__("Is Animation", "block-collections"),
    checked: is_anime,
    onChange: newVal => {
      props.onChange({
        is_anime: newVal
      });
    }
  }), is_anime && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "itmar_link_type"
  }, /*#__PURE__*/React.createElement(components.RadioControl, {
    label: i18n.__("Animation Pattern", "block-collections"),
    selected: anime_prm.pattern,
    options: [{
      label: "flipDown",
      value: "flipDown"
    }, {
      label: "fadeUp",
      value: "fadeUp"
    }, {
      label: "fadeLeft",
      value: "fadeLeft"
    }, {
      label: "fadeRight",
      value: "fadeRight"
    }],
    onChange: changeOption => {
      props.onChange({
        anime_prm: _rollupPluginBabelHelpers.objectSpread2(_rollupPluginBabelHelpers.objectSpread2({}, anime_prm), {}, {
          pattern: changeOption
        })
      });
    }
  })), /*#__PURE__*/React.createElement(components.RangeControl, {
    value: anime_prm.duration,
    label: i18n.__("Animation duration time", "block-collections"),
    max: 5,
    min: 0,
    onChange: val => {
      props.onChange({
        anime_prm: _rollupPluginBabelHelpers.objectSpread2(_rollupPluginBabelHelpers.objectSpread2({}, anime_prm), {}, {
          duration: val
        })
      });
    },
    step: 0.1,
    withInputField: true
  }), /*#__PURE__*/React.createElement(components.RangeControl, {
    value: anime_prm.delay,
    label: i18n.__("Animation delay time", "block-collections"),
    max: 3,
    min: 0,
    onChange: val => {
      props.onChange({
        anime_prm: _rollupPluginBabelHelpers.objectSpread2(_rollupPluginBabelHelpers.objectSpread2({}, anime_prm), {}, {
          delay: val
        })
      });
    },
    step: 0.1,
    withInputField: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "itmar_link_type"
  }, /*#__PURE__*/React.createElement(components.RadioControl, {
    label: i18n.__("Animation Trigger", "block-collections"),
    selected: anime_prm.trigger,
    options: [{
      label: i18n.__("Page Opend", "block-collections"),
      value: "opend"
    }, {
      label: i18n.__("Enter Visible", "block-collections"),
      value: "visible"
    }],
    onChange: changeOption => {
      props.onChange({
        anime_prm: _rollupPluginBabelHelpers.objectSpread2(_rollupPluginBabelHelpers.objectSpread2({}, anime_prm), {}, {
          trigger: changeOption
        })
      });
    }
  })))));
}

exports.anime_comp = anime_comp;
exports.default = AnimationBlock;
//# sourceMappingURL=AnimationBlock.js.map
