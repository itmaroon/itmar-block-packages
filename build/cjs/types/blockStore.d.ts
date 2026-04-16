interface BlockInstance {
    attributes: Record<string, any>;
    innerBlocks: BlockInstance[];
    name: string;
    isValid: boolean;
    clientId: string;
}
export declare const useTargetBlocks: (clientId: string, blockName: string, attributeFilter?: null, includeNested?: boolean) => BlockInstance | BlockInstance[] | null;
export declare const flattenBlocks: (blocks: BlockInstance[]) => BlockInstance[];
interface SerializedBlock {
    blockName: string;
    attributes: Record<string, any>;
    innerBlocks: SerializedBlock[];
}
export declare const serializeBlockTree: (block: BlockInstance) => SerializedBlock;
export declare const createBlockTree: (blockData: SerializedBlock) => BlockInstance;
export {};
