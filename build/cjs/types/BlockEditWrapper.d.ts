import { ElementType } from "react";
interface BlockEditWrapperProps {
    lazyComponent: ElementType;
    [key: string]: any;
}
declare function BlockEditWrapper({ lazyComponent: LazyComponent, ...props }: BlockEditWrapperProps): import("react/jsx-runtime").JSX.Element;
export default BlockEditWrapper;
