'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _rollupPluginBabelHelpers = require('./_virtual/_rollupPluginBabelHelpers.js');
var element = require('@wordpress/element');

var _excluded = ["lazyComponent"];
function BlockEditWrapper(_ref) {
  var {
      lazyComponent: LazyComponent
    } = _ref,
    props = _rollupPluginBabelHelpers.objectWithoutProperties(_ref, _excluded);
  return /*#__PURE__*/React.createElement(element.Suspense, {
    fallback: /*#__PURE__*/React.createElement("div", null, "Loading...")
  }, /*#__PURE__*/React.createElement(LazyComponent, props));
}

exports.default = BlockEditWrapper;
//# sourceMappingURL=BlockEditWrapper.js.map
