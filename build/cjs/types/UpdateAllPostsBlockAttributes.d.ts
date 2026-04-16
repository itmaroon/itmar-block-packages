interface UpdateAllPostsProps {
    postType: string;
    blockName: string;
    newAttributes: Record<string, any>;
    onProcessStart: () => void;
    onProcessEnd: () => void;
    onProcessCancel: () => void;
}
export default function UpdateAllPostsBlockAttributes({ postType, blockName, newAttributes, onProcessStart, onProcessEnd, onProcessCancel, }: UpdateAllPostsProps): import("react/jsx-runtime").JSX.Element;
export {};
