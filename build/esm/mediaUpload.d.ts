interface MediaObject {
    id: number;
    url: string;
    alt?: string;
    caption?: string;
    [key: string]: any;
}
interface SingleImageSelectProps {
    attributes: {
        mediaID?: number;
        media?: MediaObject;
    };
    onSelectChange: (media: MediaObject) => void;
}
export declare function SingleImageSelect({ attributes, onSelectChange, }: SingleImageSelectProps): JSX.Element;
interface MultiImageSelectProps {
    attributes: {
        mediaID: number[];
        media: MediaObject[];
    };
    label: string;
    onSelectChange: (media: MediaObject[]) => void;
    onAllDelete: () => void;
}
export declare function MultiImageSelect({ attributes, label, onSelectChange, onAllDelete, }: MultiImageSelectProps): JSX.Element;
export declare function getMediaType(url: string): "image" | "video" | undefined;
export declare function getImageAspectRatio(url: string): Promise<unknown>;
export declare function getVideoAspectRatio(url: string): Promise<unknown>;
export {};
