import { ElementType } from "react";
interface BlockEditWrapperProps {
    lazyComponent: ElementType;
    [key: string]: any;
}
declare function BlockEditWrapper({ lazyComponent: LazyComponent, ...props }: BlockEditWrapperProps): JSX.Element;
export default BlockEditWrapper;
