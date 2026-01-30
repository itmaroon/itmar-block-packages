import { objectWithoutProperties as _objectWithoutProperties } from './_virtual/_rollupPluginBabelHelpers.js';
import { Suspense } from '@wordpress/element';

var _excluded = ["lazyComponent"];
function BlockEditWrapper(_ref) {
  var {
      lazyComponent: LazyComponent
    } = _ref,
    props = _objectWithoutProperties(_ref, _excluded);
  return /*#__PURE__*/React.createElement(Suspense, {
    fallback: /*#__PURE__*/React.createElement("div", null, "Loading...")
  }, /*#__PURE__*/React.createElement(LazyComponent, props));
}

export { BlockEditWrapper as default };
//# sourceMappingURL=BlockEditWrapper.js.map
