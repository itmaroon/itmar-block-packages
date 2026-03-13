import { createElement, Fragment } from "@wordpress/element";
import { Suspense } from "@wordpress/element";
import { ElementType } from "react";

// LazyComponent はコンポーネントそのもの、...props はそのコンポーネントに渡す中身です
interface BlockEditWrapperProps {
  lazyComponent: ElementType;
  [key: string]: any;
}

function BlockEditWrapper({
  lazyComponent: LazyComponent,
  ...props
}: BlockEditWrapperProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

export default BlockEditWrapper;
