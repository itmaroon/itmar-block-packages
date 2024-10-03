import { useRef, useEffect, useState } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import isEqual from "lodash/isEqual";

//useRefで参照したDOM要素の大きさを取得するカスタムフック
export function useElementWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
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
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
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
export function useIsIframeMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // iframeのcontentWindowを監視する関数
    const checkIframeSize = () => {
      const iframeInstance = document.getElementsByName("editor-canvas")[0];
      if (iframeInstance && iframeInstance.contentWindow) {
        setIsMobile(iframeInstance.contentWindow.innerWidth <= 767);
      }
    };

    // iframeのcontentWindowのリサイズイベントにリスナーを追加
    const iframeInstance = document.getElementsByName("editor-canvas")[0];
    if (iframeInstance && iframeInstance.contentWindow) {
      iframeInstance.contentWindow.addEventListener("resize", checkIframeSize);
    }

    // 初期チェックを実行
    checkIframeSize();

    // クリーンアップ関数
    return () => {
      if (iframeInstance && iframeInstance.contentWindow) {
        iframeInstance.contentWindow.removeEventListener(
          "resize",
          checkIframeSize
        );
      }
    };
  }, []);

  return isMobile;
}

//ブロックの背景色を取得するカスタムフック
export function useElementBackgroundColor(blockRef, style) {
  const [baseColor, setBaseColor] = useState("");

  useEffect(() => {
    if (blockRef.current && style) {
      if (
        style.backgroundColor &&
        !style.backgroundColor.startsWith("var(--wp")
      ) {
        //backgroundColorが設定されており、それがカスタムプロパティでない
        setBaseColor(style.backgroundColor);
      } else {
        //レンダリング結果から背景色を取得
        if (blockRef.current) {
          const computedStyles = getComputedStyle(blockRef.current);
          setBaseColor(computedStyles.backgroundColor);
        }
      }
    }
  }, [style, blockRef]);

  return baseColor;
}

//たくさんの要素をもつオブジェクトや配列の内容の変化で発火するuseEffect
export function useDeepCompareEffect(callback, dependencies) {
  const dependenciesRef = useRef();

  if (!isEqual(dependencies, dependenciesRef.current)) {
    dependenciesRef.current = dependencies;
  }

  useEffect(() => {
    return callback();
  }, [dependenciesRef.current]);
}

export function useFontawesomeIframe() {
  //iframeにfontawesomeを読み込む
  useEffect(() => {
    const iframeInstance = document.getElementsByName("editor-canvas")[0];

    if (iframeInstance) {
      const iframeDocument =
        iframeInstance.contentDocument || iframeInstance.contentWindow.document;
      const scriptElement = iframeDocument.createElement("script");
      scriptElement.setAttribute("src", "../../../assets/fontawesome.js");
      //scriptElement.setAttribute("crossorigin", "anonymous");

      iframeDocument.body.appendChild(scriptElement);

      // Return a cleanup function to remove the script tag
      return () => {
        iframeDocument.body?.removeChild(scriptElement);
      };
    }
  }, []);
}

//ネストしたブロックを平坦化
const getFlattenBlocks = (blocks) => {
  return blocks.reduce((acc, block) => {
    acc.push(block);
    if (block.innerBlocks && block.innerBlocks.length > 0) {
      acc.push(...getFlattenBlocks(block.innerBlocks));
    }
    return acc;
  }, []);
};

//指定されたブロック名とクラス名を含むブロックの属性が更新されたときその更新内容をかえすフック
export function useBlockAttributeChanges(
  clientId,
  blockName,
  className,
  modFlg = false,
  excludeAttributes = {}
) {
  const [latestAttributes, setLatestAttributes] = useState(null);
  //const [idleFlg, setIdleFlg] = useState(null);
  const prevBlocksRef = useRef({});

  //属性変更関数を取得
  const { updateBlockAttributes } = useDispatch("core/block-editor");
  //インナーブロックを平坦化する関数
  const flattenedBlocks = useSelect(
    (select) => {
      const { getBlock } = select("core/block-editor");
      const rootBlock = getBlock(clientId);
      return rootBlock ? getFlattenBlocks([rootBlock]) : [];
    },
    [clientId]
  );

  const targetBlocks = flattenedBlocks.filter(
    (block) =>
      block.name === blockName &&
      block.attributes.className?.includes(className)
  );

  useEffect(() => {
    //平坦化されたブロックを調査
    for (const block of targetBlocks) {
      const prevAttributes =
        prevBlocksRef.current[block.clientId]?.attributes || {};
      //既に先に記録された属性があることをチェック
      if (Object.keys(prevAttributes).length > 0) {
        // 除外する属性を取り除いた属性オブジェクトを作成
        const filteredCurrentAttributes = Object.keys(block.attributes).reduce(
          (acc, key) => {
            if (!excludeAttributes.hasOwnProperty(key)) {
              acc[key] = block.attributes[key];
            }
            return acc;
          },
          {}
        );

        const filteredPrevAttributes = Object.keys(prevAttributes).reduce(
          (acc, key) => {
            if (!excludeAttributes.hasOwnProperty(key)) {
              acc[key] = prevAttributes[key];
            }
            return acc;
          },
          {}
        );

        //属性の変化を比較
        if (
          JSON.stringify(filteredCurrentAttributes) !==
          JSON.stringify(filteredPrevAttributes)
        ) {
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
      prevBlocksRef.current[block.clientId] = { ...block };
    }
  }, [targetBlocks, blockName, className]);

  //innerFlattenedBlocks内の同一種のブロックに対して属性をセットする;
  useEffect(() => {
    //確認ダイアログが処理されたことを確認してからこちらの処理を進める
    if (latestAttributes && modFlg) {
      // const latestAttrObj = JSON.parse(latestAttributes);
      // const setObj = {
      //   ...latestAttrObj,
      //   className: `auto_attr_change ${latestAttrObj.className}`,
      // };
      targetBlocks.forEach((block) => {
        updateBlockAttributes(block.clientId, JSON.parse(latestAttributes));
      });
    }
  }, [latestAttributes]);

  return JSON.parse(latestAttributes);
}
