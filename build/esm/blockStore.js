import { useSelect } from '@wordpress/data';
import { store } from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';

var useTargetBlocks = function useTargetBlocks(clientId, blockName) {
  var attributeFilter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var includeNested = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var targetblocks = useSelect(select => {
    var {
      getBlockRootClientId,
      getBlock
    } = select(store);
    var parentId = getBlockRootClientId(clientId); // 自分の親の clientId を取得
    if (!parentId) return attributeFilter ? null : [];
    var parentBlock = getBlock(parentId);
    if (!parentBlock) return attributeFilter ? null : [];
    var siblingBlocks = includeNested ? flattenBlocks(parentBlock.innerBlocks || []) //ネストされたブロックも含んで検索
    : parentBlock.innerBlocks || []; //兄弟ブロックのみ

    var filtered = siblingBlocks.filter(block => block.name === blockName && block.clientId !== clientId);
    if (attributeFilter) {
      return filtered.find(block => {
        return Object.entries(attributeFilter).every(_ref => {
          var [key, value] = _ref;
          return block.attributes[key] === value;
        });
      }) || null;
    }
    return filtered;
  }, [clientId, blockName, JSON.stringify(attributeFilter), includeNested]);
  return targetblocks;
};

//ネストしたブロックを平坦化
var flattenBlocks = blocks => {
  return blocks.reduce((acc, block) => {
    acc.push(block);
    if (block.innerBlocks && block.innerBlocks.length > 0) {
      acc.push(...flattenBlocks(block.innerBlocks));
    }
    return acc;
  }, []);
};

// 再帰的にブロック構造をシリアライズする関数
var serializeBlockTree = block => {
  return {
    blockName: block.name,
    attributes: block.attributes,
    innerBlocks: block.innerBlocks.length > 0 ? block.innerBlocks.map(serializeBlockTree) : []
  };
};
// シリアライズしたブロックデータをもとの階層構造に戻す関数
var createBlockTree = blockData => {
  var inner = Array.isArray(blockData.innerBlocks) ? blockData.innerBlocks.map(createBlockTree) : [];
  return createBlock(blockData.blockName, blockData.attributes, inner);
};

export { createBlockTree, flattenBlocks, serializeBlockTree, useTargetBlocks };
//# sourceMappingURL=blockStore.js.map
