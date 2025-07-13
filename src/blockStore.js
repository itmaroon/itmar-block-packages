import { useSelect } from "@wordpress/data";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { createBlock } from "@wordpress/blocks";

export const useTargetBlocks = (
  clientId,
  blockName,
  attributeFilter = null,
  includeNested = false
) => {
  const targetblocks = useSelect(
    (select) => {
      const { getBlockRootClientId, getBlock } = select(blockEditorStore);

      const parentId = getBlockRootClientId(clientId); // 自分の親の clientId を取得
      if (!parentId) return attributeFilter ? null : [];

      const parentBlock = getBlock(parentId);
      if (!parentBlock) return attributeFilter ? null : [];

      const siblingBlocks = includeNested
        ? flattenBlocks(parentBlock.innerBlocks || []) //ネストされたブロックも含んで検索
        : parentBlock.innerBlocks || []; //兄弟ブロックのみ

      const filtered = siblingBlocks.filter(
        (block) => block.name === blockName && block.clientId !== clientId
      );

      if (attributeFilter) {
        return (
          filtered.find((block) => {
            return Object.entries(attributeFilter).every(
              ([key, value]) => block.attributes[key] === value
            );
          }) || null
        );
      }

      return filtered;
    },
    [clientId, blockName, JSON.stringify(attributeFilter), includeNested]
  );
  return targetblocks;
};

//ネストしたブロックを平坦化
export const flattenBlocks = (blocks) => {
  return blocks.reduce((acc, block) => {
    acc.push(block);
    if (block.innerBlocks && block.innerBlocks.length > 0) {
      acc.push(...flattenBlocks(block.innerBlocks));
    }
    return acc;
  }, []);
};

// 再帰的にブロック構造をシリアライズする関数
export const serializeBlockTree = (block) => {
  return {
    blockName: block.name,
    attributes: block.attributes,
    innerBlocks:
      block.innerBlocks.length > 0
        ? block.innerBlocks.map(serializeBlockTree)
        : [],
  };
};
// シリアライズしたブロックデータをもとの階層構造に戻す関数
export const createBlockTree = (blockData) => {
  const inner = Array.isArray(blockData.innerBlocks)
    ? blockData.innerBlocks.map(createBlockTree)
    : [];

  return createBlock(blockData.blockName, blockData.attributes, inner);
};
