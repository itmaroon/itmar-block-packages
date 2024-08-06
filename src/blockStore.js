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
