import { objectSpread2 as _objectSpread2, taggedTemplateLiteral as _taggedTemplateLiteral } from './_virtual/_rollupPluginBabelHelpers.js';
import { __ } from '@wordpress/i18n';
import { css } from 'styled-components';
import { PanelBody, ToggleControl, RadioControl, RangeControl } from '@wordpress/components';

var _templateObject;
var anime_comp = attributes => {
  return css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n    &.fadeTrigger {\n      opacity: 0;\n    }\n    &.", " {\n      animation-name: ", ";\n      animation-delay: ", "s;\n      animation-duration: ", "s;\n      animation-fill-mode: forwards;\n      opacity: 0;\n    }\n  "])), attributes.pattern, attributes.pattern, attributes.delay, attributes.duration);
};
function AnimationBlock(props) {
  var {
    is_anime,
    anime_prm
  } = props.attributes;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PanelBody, {
    title: __("Animation Setting", "block-collections"),
    initialOpen: true
  }, /*#__PURE__*/React.createElement(ToggleControl, {
    label: __("Is Animation", "block-collections"),
    checked: is_anime,
    onChange: newVal => {
      props.onChange({
        is_anime: newVal
      });
    }
  }), is_anime && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "itmar_link_type"
  }, /*#__PURE__*/React.createElement(RadioControl, {
    label: __("Animation Pattern", "block-collections"),
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
        anime_prm: _objectSpread2(_objectSpread2({}, anime_prm), {}, {
          pattern: changeOption
        })
      });
    }
  })), /*#__PURE__*/React.createElement(RangeControl, {
    value: anime_prm.duration,
    label: __("Animation duration time", "block-collections"),
    max: 5,
    min: 0,
    onChange: val => {
      props.onChange({
        anime_prm: _objectSpread2(_objectSpread2({}, anime_prm), {}, {
          duration: val
        })
      });
    },
    step: 0.1,
    withInputField: true
  }), /*#__PURE__*/React.createElement(RangeControl, {
    value: anime_prm.delay,
    label: __("Animation delay time", "block-collections"),
    max: 3,
    min: 0,
    onChange: val => {
      props.onChange({
        anime_prm: _objectSpread2(_objectSpread2({}, anime_prm), {}, {
          delay: val
        })
      });
    },
    step: 0.1,
    withInputField: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "itmar_link_type"
  }, /*#__PURE__*/React.createElement(RadioControl, {
    label: __("Animation Trigger", "block-collections"),
    selected: anime_prm.trigger,
    options: [{
      label: __("Page Opend", "block-collections"),
      value: "opend"
    }, {
      label: __("Enter Visible", "block-collections"),
      value: "visible"
    }],
    onChange: changeOption => {
      props.onChange({
        anime_prm: _objectSpread2(_objectSpread2({}, anime_prm), {}, {
          trigger: changeOption
        })
      });
    }
  })))));
}

export { anime_comp, AnimationBlock as default };
//# sourceMappingURL=AnimationBlock.js.map
