import { objectSpread2 as _objectSpread2 } from './_virtual/_rollupPluginBabelHelpers.js';
import { flattenBlocks, createBlockTree, serializeBlockTree } from './blockStore.js';
import { createBlock, getBlockType } from '@wordpress/blocks';
import { useEffect } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';

//フィールド生成用関数
var createBlockAttr = selectedField => {
  var _blockType$attributes, _blockType$attributes2, _blockType$attributes3, _blockType$attributes4;
  var blockAttributes = {};
  switch (selectedField.block) {
    case "itmar/design-title":
      var block_class = selectedField.key.startsWith("tax_") ? selectedField.key : "sp_field_".concat(selectedField.key);
      blockAttributes = {
        className: block_class,
        headingContent: "[".concat(selectedField.label, "]")
      };
      break;
    case "core/paragraph":
      blockAttributes = {
        className: "itmar_ex_block sp_field_".concat(selectedField.key),
        content: "[".concat(selectedField.label, "]")
      };
      break;
    case "core/image":
      blockAttributes = {
        className: "itmar_ex_block sp_field_".concat(selectedField.key),
        url: "".concat(itmar_option.plugin_url, "/assets/image/main_sample.png")
      };
      break;
    case "itmar/slide-mv":
      var spaceAttributes = {
        margin_val: {
          type: "object",
          default: {
            top: "0em",
            left: "0em",
            bottom: "0em",
            right: "0em"
          }
        },
        padding_val: {
          type: "object",
          default: {
            top: "0em",
            left: "0em",
            bottom: "0em",
            right: "0em"
          }
        }
      };
      var imageBlock = createBlock("core/image", _objectSpread2({
        className: "itmar_ex_block",
        url: "".concat(itmar_option.plugin_url, "/assets/image/slide_sample.png")
      }, spaceAttributes));
      //Design Blockの初期設定を取得
      var blockType = getBlockType("itmar/design-group");
      var defaultValBase = (_blockType$attributes = blockType === null || blockType === void 0 || (_blockType$attributes2 = blockType.attributes) === null || _blockType$attributes2 === void 0 || (_blockType$attributes2 = _blockType$attributes2.default_val) === null || _blockType$attributes2 === void 0 ? void 0 : _blockType$attributes2.default) !== null && _blockType$attributes !== void 0 ? _blockType$attributes : {};
      var mobileValBase = (_blockType$attributes3 = blockType === null || blockType === void 0 || (_blockType$attributes4 = blockType.attributes) === null || _blockType$attributes4 === void 0 || (_blockType$attributes4 = _blockType$attributes4.mobile_val) === null || _blockType$attributes4 === void 0 ? void 0 : _blockType$attributes4.default) !== null && _blockType$attributes3 !== void 0 ? _blockType$attributes3 : {};
      var slideBlock = createBlock("itmar/design-group", {
        default_val: _objectSpread2(_objectSpread2({}, defaultValBase), {}, {
          width_val: "fit"
        }),
        mobile_val: _objectSpread2(_objectSpread2({}, mobileValBase), {}, {
          width_val: "fit"
        })
      }, [imageBlock]);
      //slideBlock をシリアライズ
      var serializedSlide = serializeBlockTree(slideBlock);
      // 同じスライドブロックを5つ複製（独立したブロックとして）
      var slideBlocks = Array.from({
        length: 5
      }, () => createBlockTree(serializedSlide));
      //子ブロック付きで返す
      blockAttributes = {
        attributes: {
          className: "sp_field_".concat(selectedField.key)
        },
        slideBlocks: slideBlocks
      };
      break;
    default:
      blockAttributes = {
        className: "sp_field_".concat(selectedField.key),
        headingContent: "[".concat(selectedField.label, "]")
      };
  }
  return blockAttributes;
};

//表示フィールド変更によるインナーブロックの再構成
var useRebuildChangeField = (dispAttributeArray, selectedFields, pickupType, dispTaxonomies, sectionCount, domType, clientId, insertId) => {
  // dispatch関数を取得
  var {
    replaceInnerBlocks
  } = useDispatch("core/block-editor");
  var pickupBlock = useSelect(select => select("core/block-editor").getBlock(clientId), [clientId]);
  useEffect(() => {
    //dispAttributeArray の個数調整
    var blocksLength = dispAttributeArray.length;
    if (blocksLength < sectionCount) {
      // dispAttributeArrayの長さが短い場合、{}を追加する
      var diff = sectionCount - blocksLength;
      for (var i = 0; i < diff; i++) {
        dispAttributeArray.push({});
      }
    } else {
      // dispAttributeArrayの長さが長い場合、余分な要素を削除する
      dispAttributeArray.splice(sectionCount);
    }

    // インナーブロックに差し込むブロック配列を生成
    var blocksArray = dispAttributeArray.map((dispAttribute, unit_index) => {
      // blocksAttributesArray属性で登録されたブロックのclassName一覧（sp_field_xxx を拾う）
      var allBlocks = Array.isArray(dispAttribute.innerBlocks) ? flattenBlocks(dispAttribute.innerBlocks) //階層になったブロックを平坦化
      : [];
      var existingKeys = allBlocks.map(block => {
        var _block$attributes;
        return (_block$attributes = block.attributes) === null || _block$attributes === void 0 ? void 0 : _block$attributes.className;
      }).filter(Boolean).map(cls => {
        var _match$;
        // sp_field_◯◯ か tax_◯◯ のどちらかにマッチ
        var match = cls.match(/sp_field_([\w-]+)|(tax_[\w-]+)/);
        if (!match) return null;

        // match[1] があれば sp_field_ のほう → プレフィックス除去
        // match[2] があれば tax_ のほう → そのまま返す
        return (_match$ = match[1]) !== null && _match$ !== void 0 ? _match$ : match[2];
      }).filter(Boolean);

      // dispTaxonomies からオブジェクトを作って selectedFieldsに加えてnewSelectedFieldsを生成
      var newSelectedFields = [...selectedFields, ...dispTaxonomies.map(tax => ({
        key: "tax_".concat(tax),
        // 例: "tax_category"
        label: tax,
        // 例: "category"
        block: "itmar/design-title"
      }))];

      //  newSelectedFieldsのうち未挿入のものだけ追加
      var autoGeneratedBlocks = newSelectedFields.filter(field => !existingKeys.includes(field.key)).map(field => {
        var _attr$attributes;
        var attr = createBlockAttr(field);
        var blockName = field.block;
        var blockAttributes = (_attr$attributes = attr === null || attr === void 0 ? void 0 : attr.attributes) !== null && _attr$attributes !== void 0 ? _attr$attributes : attr;
        var innerBlocks = Array.isArray(attr === null || attr === void 0 ? void 0 : attr.slideBlocks) ? attr.slideBlocks : [];
        return createBlock(blockName, blockAttributes, innerBlocks);
      });
      // blocksAttributesArray属性で登録されたブロックの再構築
      var selectedKeys = selectedFields.map(f => f.key);
      var filterBlocksRecursively = blocks => {
        return blocks.map(block => {
          var _block$attributes2;
          var className = ((_block$attributes2 = block.attributes) === null || _block$attributes2 === void 0 ? void 0 : _block$attributes2.className) || "";
          // 1. まず sp_field_ のパターンを探す
          var match = className.match(/sp_field_([a-zA-Z0-9_]+)/);
          // 2. 見つからなければ tax_○○ をチェック
          if (className.startsWith("tax_")) {
            var name = className.slice("tax_".length); // "tax_category" → "category"

            // dispTaxonomies に含まれないものだけ有効とする
            if (!dispTaxonomies.includes(name)) {
              // 正規表現の match 結果っぽい形の配列を自分で作る
              // [0] に全体一致, [1] にグループ1 というイメージ
              match = ["tax_".concat(name), name];
            }
          }

          // 再帰的に innerBlocks をフィルタ
          var filteredInner = block.innerBlocks ? filterBlocksRecursively(block.innerBlocks) : [];
          var isAutoGenerated = !!match;
          var keep = !isAutoGenerated || selectedKeys.includes(match[1]);
          if (!keep) return null;

          // 構造を復元して返す
          return _objectSpread2(_objectSpread2({}, block), {}, {
            innerBlocks: filteredInner
          });
        }).filter(Boolean); // null を除去
      };
      var userBlocks = Array.isArray(dispAttribute.innerBlocks) ? filterBlocksRecursively(dispAttribute.innerBlocks).map(createBlockTree) : [];

      // autoGenerated（selectedFields） + userBlocks を合成
      var innerBlocks = [...userBlocks, ...autoGeneratedBlocks];
      var ret = createBlock("itmar/design-group", _objectSpread2(_objectSpread2({}, dispAttribute.attributes), {}, {
        className: "unit_design_".concat(unit_index),
        domType: domType
      }), innerBlocks);
      return ret;
    });

    //挿入するブロックと自身のブロックが異なる場合（slide-mvにデータを入れる場合）
    if (insertId !== clientId) {
      blocksArray.push(pickupBlock);
    }
    // 既存のインナーブロックを一括置換
    replaceInnerBlocks(insertId, blocksArray, false);
  }, [selectedFields, pickupType, dispTaxonomies]);
};

export { useRebuildChangeField };
//# sourceMappingURL=BrockInserter.js.map
