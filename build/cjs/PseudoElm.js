'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _rollupPluginBabelHelpers = require('./_virtual/_rollupPluginBabelHelpers.js');
var i18n = require('@wordpress/i18n');
var styledComponents = require('styled-components');
var components = require('@wordpress/components');

var _templateObject;

// 矢印の向きに応じたスタイルを生成するヘルパー関数
var arrowDirectionStyles = direction => {
  switch (direction) {
    case "left":
      return "transform: translate(-50%, -50%) rotate(-135deg);";
    case "right":
      return "transform: translate(-50%, -50%) rotate(45deg);";
    case "upper":
      return "transform: translate(-50%, -50%) rotate(-45deg);";
    case "under":
      return "transform: translate(-50%, -50%) rotate(135deg);";
    default:
      return "transform: translate(-50%, -50%) rotate(45deg);";
    // default to 'down'
  }
};

// 矢印のスタイルを適用するコンポーネント
var Arrow = _ref => {
  var {
    direction = "down"
  } = _ref;
  return styledComponents.css(_templateObject || (_templateObject = _rollupPluginBabelHelpers.taggedTemplateLiteral(["\n  &::after {\n    content: \"\";\n    position: absolute;\n    display: block;\n    width: 15%;\n    height: 15%;\n    border-top: 3px solid var(--wp--preset--color--accent-2);\n    border-right: 3px solid var(--wp--preset--color--accent-2);\n    top: 50%;\n    left: 50%;\n    ", "\n  }\n"])), arrowDirectionStyles(direction));
};

//擬似要素の出力を選択させるインスペクターコントロール
var PseudoElm = _ref2 => {
  var {
    direction,
    onChange: _onChange
  } = _ref2;
  return /*#__PURE__*/React.createElement(components.RadioControl, {
    selected: direction,
    options: [{
      label: i18n.__("Upper", "itmar_block_collections"),
      value: "upper"
    }, {
      label: i18n.__("Left", "itmar_block_collections"),
      value: "left"
    }, {
      label: i18n.__("Right", "itmar_block_collections"),
      value: "right"
    }, {
      label: i18n.__("Under", "itmar_block_collections"),
      value: "under"
    }],
    onChange: changeOption => {
      _onChange(changeOption);
    }
  });
};

exports.Arrow = Arrow;
exports.default = PseudoElm;
//# sourceMappingURL=PseudoElm.js.map
