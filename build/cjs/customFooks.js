'use strict';

var _rollupPluginBabelHelpers = require('./_virtual/_rollupPluginBabelHelpers.js');
var element = require('@wordpress/element');
var data = require('@wordpress/data');
var isEqual = require('lodash/isEqual');
var i18n = require('@wordpress/i18n');

//useRefで参照したDOM要素の大きさを取得するカスタムフック
function useElementWidth() {
  var ref = element.useRef(null);
  var [width, setWidth] = element.useState(0);
  element.useEffect(() => {
    var resizeObserver = new ResizeObserver(entries => {
      for (var entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    if (ref.current) {
      resizeObserver.observe(ref.current);
    }
    return () => {
      resizeObserver.disconnect();
    };
  }, []);
  return [ref, width];
}

//ViewPortの大きさでモバイルを判断(767px以下がモバイル)するカスタムフック
function useIsMobile() {
  var [isMobile, setIsMobile] = element.useState(false);
  element.useEffect(() => {
    if (typeof window !== "undefined") {
      var handleResize = () => {
        setIsMobile(window.innerWidth <= 767);
      };
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);
  return isMobile;
}

//モバイル表示か否かを判定するフック
function useIsIframeMobile() {
  var [isMobile, setIsMobile] = element.useState(false);
  element.useEffect(() => {
    // iframeのcontentWindowを監視する関数
    var checkIframeSize = () => {
      var iframeInstance = document.getElementsByName("editor-canvas")[0];
      if (iframeInstance && iframeInstance.contentWindow) {
        setIsMobile(iframeInstance.contentWindow.innerWidth <= 767);
      }
    };

    // iframeのcontentWindowのリサイズイベントにリスナーを追加
    var iframeInstance = document.getElementsByName("editor-canvas")[0];
    if (iframeInstance && iframeInstance.contentWindow) {
      iframeInstance.contentWindow.addEventListener("resize", checkIframeSize);
    }

    // 初期チェックを実行
    checkIframeSize();

    // クリーンアップ関数
    return () => {
      if (iframeInstance && iframeInstance.contentWindow) {
        iframeInstance.contentWindow.removeEventListener("resize", checkIframeSize);
      }
    };
  }, []);
  return isMobile;
}

//ブロックの背景色を取得するカスタムフック
function useElementBackgroundColor(blockRef, style) {
  var [baseColor, setBaseColor] = element.useState("");
  element.useEffect(() => {
    if (blockRef.current && style) {
      if (style.backgroundColor && !style.backgroundColor.startsWith("var(--wp")) {
        //backgroundColorが設定されており、それがカスタムプロパティでない
        setBaseColor(style.backgroundColor);
      } else {
        //レンダリング結果から背景色を取得
        if (blockRef.current) {
          var computedStyles = getComputedStyle(blockRef.current);
          setBaseColor(computedStyles.backgroundColor);
        }
      }
    }
  }, [style, blockRef]);
  return baseColor;
}

//ブロックのスタイルを取得し、コールバック関数を返すカスタムフック
function useElementStyleObject(blockRef, style) {
  var [styleObject, setStyleObject] = element.useState("");
  element.useEffect(() => {
    if (blockRef.current && style) {
      //レンダリング結果に基づくスタイルの取得
      var computedStyles = getComputedStyle(blockRef.current);
      // styleオブジェクトのキーに基づいてnewStyleObjectを生成
      var newStyleObject = Object.keys(style).reduce((acc, key) => {
        if (computedStyles[key]) {
          // computedStylesにキーが存在するか確認
          acc[key] = computedStyles[key];
        }
        return acc;
      }, {});
      setStyleObject(JSON.stringify(newStyleObject));
    }
  }, [blockRef, style]);
  // styleObjectをオブジェクトとして返す
  return styleObject;
}

//たくさんの要素をもつオブジェクトや配列の内容の変化で発火するuseEffect
function useDeepCompareEffect(callback, dependencies) {
  var dependenciesRef = element.useRef();
  if (!isEqual(dependencies, dependenciesRef.current)) {
    dependenciesRef.current = dependencies;
  }
  element.useEffect(() => {
    return callback();
  }, [dependenciesRef.current]);
}
function useFontawesomeIframe() {
  //iframeにfontawesomeを読み込む
  element.useEffect(() => {
    var iframeInstance = document.getElementsByName("editor-canvas")[0];
    if (iframeInstance) {
      var iframeDocument = iframeInstance.contentDocument || iframeInstance.contentWindow.document;
      var scriptElement = iframeDocument.createElement("script");
      scriptElement.setAttribute("src", "../../../assets/fontawesome.js");
      //scriptElement.setAttribute("crossorigin", "anonymous");

      iframeDocument.body.appendChild(scriptElement);

      // Return a cleanup function to remove the script tag
      return () => {
        var _iframeDocument$body;
        (_iframeDocument$body = iframeDocument.body) === null || _iframeDocument$body === void 0 || _iframeDocument$body.removeChild(scriptElement);
      };
    }
  }, []);
}

//ネストしたブロックを平坦化
var getFlattenBlocks = blocks => {
  return blocks.reduce((acc, block) => {
    acc.push(block);
    if (block.innerBlocks && block.innerBlocks.length > 0) {
      acc.push(...getFlattenBlocks(block.innerBlocks));
    }
    return acc;
  }, []);
};

//指定されたブロック名とクラス名を含むブロックの属性が更新されたときその更新内容をかえすフック
function useBlockAttributeChanges(clientId, blockName, className) {
  var modFlg = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var excludeAttributes = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var [latestAttributes, setLatestAttributes] = element.useState(null);
  //const [idleFlg, setIdleFlg] = useState(null);
  var prevBlocksRef = element.useRef({});

  //属性変更関数を取得
  var {
    updateBlockAttributes
  } = data.useDispatch("core/block-editor");
  //インナーブロックを平坦化する関数
  var flattenedBlocks = data.useSelect(select => {
    var {
      getBlock
    } = select("core/block-editor");
    var rootBlock = getBlock(clientId);
    return rootBlock ? getFlattenBlocks([rootBlock]) : [];
  }, [clientId]);
  var targetBlocks = flattenedBlocks.filter(block => {
    var _block$attributes$cla;
    return block.name === blockName && ((_block$attributes$cla = block.attributes.className) === null || _block$attributes$cla === void 0 ? void 0 : _block$attributes$cla.includes(className));
  });
  element.useEffect(() => {
    var _loop = function _loop(block) {
      var _prevBlocksRef$curren;
      var prevAttributes = ((_prevBlocksRef$curren = prevBlocksRef.current[block.clientId]) === null || _prevBlocksRef$curren === void 0 ? void 0 : _prevBlocksRef$curren.attributes) || {};
      //既に先に記録された属性があることをチェック
      if (Object.keys(prevAttributes).length > 0) {
        // 除外する属性を取り除いた属性オブジェクトを作成
        var filteredCurrentAttributes = Object.keys(block.attributes).reduce((acc, key) => {
          if (!excludeAttributes.hasOwnProperty(key)) {
            acc[key] = block.attributes[key];
          }
          return acc;
        }, {});
        var filteredPrevAttributes = Object.keys(prevAttributes).reduce((acc, key) => {
          if (!excludeAttributes.hasOwnProperty(key)) {
            acc[key] = prevAttributes[key];
          }
          return acc;
        }, {});

        //属性の変化を比較
        if (JSON.stringify(filteredCurrentAttributes) !== JSON.stringify(filteredPrevAttributes)) {
          //確認ダイアログが出ている状態か否かで状態変数を変化させる
          // if (block.attributes.isIdle) {
          //   setIdleFlg(true);
          // } else {
          //   setIdleFlg(false);
          // }
          //呼び出し元に返すための更新後の属性オブジェクトを格納

          setLatestAttributes(JSON.stringify(filteredCurrentAttributes));
        }
      }
      // 現在のブロック状態を保存（除外属性も含めて保存）
      prevBlocksRef.current[block.clientId] = _rollupPluginBabelHelpers.objectSpread2({}, block);
    };
    //平坦化されたブロックを調査
    for (var block of targetBlocks) {
      _loop(block);
    }
  }, [targetBlocks, blockName, className]);

  //innerFlattenedBlocks内の同一種のブロックに対して属性をセットする;
  element.useEffect(() => {
    //確認ダイアログが処理されたことを確認してからこちらの処理を進める
    if (latestAttributes && modFlg) {
      // const latestAttrObj = JSON.parse(latestAttributes);
      // const setObj = {
      //   ...latestAttrObj,
      //   className: `auto_attr_change ${latestAttrObj.className}`,
      // };
      targetBlocks.forEach(block => {
        updateBlockAttributes(block.clientId, JSON.parse(latestAttributes));
      });
    }
  }, [latestAttributes]);
  return JSON.parse(latestAttributes);
}

//インナーブロックが挿入されたとき、指定されたブロック名が存在れば、挿入されたブロックを削除するフック
function useDuplicateBlockRemove(clientId, blockNames) {
  var {
    removeBlock
  } = data.useDispatch("core/block-editor");
  var {
    createNotice
  } = data.useDispatch("core/notices");

  // clientIdに対応するインナーブロックを取得
  var innerBlocks = data.useSelect(select => select("core/block-editor").getBlocks(clientId), [clientId]);

  // 前回の innerBlocks を保存するための ref
  var prevInnerBlocksRef = element.useRef(innerBlocks);
  element.useEffect(() => {
    var prevInnerBlocks = prevInnerBlocksRef.current;
    //先に保存したインナーブロックの中に対象となるブロックが存在しなければ何もしない
    var result = prevInnerBlocks.some(block => blockNames.includes(block.name));
    if (result) {
      // ブロックが挿入されているか確認（前回と比較）
      if (innerBlocks.length > prevInnerBlocks.length) {
        // 新しく挿入されたブロックを特定
        var newlyInsertedBlock = innerBlocks.find(block => !prevInnerBlocks.some(prevBlock => prevBlock.clientId === block.clientId));

        // 新しいブロックが blockNames に含まれている場合、削除
        if (newlyInsertedBlock && blockNames.includes(newlyInsertedBlock.name)) {
          removeBlock(newlyInsertedBlock.clientId);

          // 通知を作成
          createNotice("error",
          // 通知のタイプ（エラー）
          i18n.__("A new block cannot be inserted because a block has already been placed.", "block-collections"),
          // メッセージ
          {
            type: "snackbar",
            // 通知のスタイル
            isDismissible: true // 通知を閉じることができるか
          });
        }
      }
    }

    // 現在の innerBlocks を次回用に保存
    prevInnerBlocksRef.current = innerBlocks;
  }, [innerBlocks, blockNames, removeBlock, createNotice]);
}

exports.useBlockAttributeChanges = useBlockAttributeChanges;
exports.useDeepCompareEffect = useDeepCompareEffect;
exports.useDuplicateBlockRemove = useDuplicateBlockRemove;
exports.useElementBackgroundColor = useElementBackgroundColor;
exports.useElementStyleObject = useElementStyleObject;
exports.useElementWidth = useElementWidth;
exports.useFontawesomeIframe = useFontawesomeIframe;
exports.useIsIframeMobile = useIsIframeMobile;
exports.useIsMobile = useIsMobile;
//# sourceMappingURL=customFooks.js.map
