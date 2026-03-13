'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var element = require('@wordpress/element');

function BlockEditWrapper({ lazyComponent: LazyComponent, ...props }) {
    return (element.createElement(element.Suspense, { fallback: element.createElement("div", null, "Loading...") },
        element.createElement(LazyComponent, { ...props })));
}

exports.default = BlockEditWrapper;
//# sourceMappingURL=BlockEditWrapper.js.map
