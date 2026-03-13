import { createElement, Suspense } from '@wordpress/element';

function BlockEditWrapper({ lazyComponent: LazyComponent, ...props }) {
    return (createElement(Suspense, { fallback: createElement("div", null, "Loading...") },
        createElement(LazyComponent, { ...props })));
}

export { BlockEditWrapper as default };
//# sourceMappingURL=BlockEditWrapper.js.map
