'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var element = require('@wordpress/element');

function BlockEditWrapper({ lazyComponent: LazyComponent, ...props }) {
    return (jsxRuntime.jsx(element.Suspense, { fallback: jsxRuntime.jsx("div", { children: "Loading..." }), children: jsxRuntime.jsx(LazyComponent, { ...props }) }));
}

exports.default = BlockEditWrapper;
//# sourceMappingURL=BlockEditWrapper.js.map
