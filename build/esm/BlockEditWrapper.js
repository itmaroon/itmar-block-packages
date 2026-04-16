import { jsx } from 'react/jsx-runtime';
import { Suspense } from '@wordpress/element';

function BlockEditWrapper({ lazyComponent: LazyComponent, ...props }) {
    return (jsx(Suspense, { fallback: jsx("div", { children: "Loading..." }), children: jsx(LazyComponent, { ...props }) }));
}

export { BlockEditWrapper as default };
//# sourceMappingURL=BlockEditWrapper.js.map
