import {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
  RefObject,
} from "@wordpress/element";

import { type ComponentType, type ReactNode } from "react";
import type React from "react";
import { useSelect, useDispatch } from "@wordpress/data";
import isEqual from "lodash/isEqual";
import { StyleSheetManager } from "styled-components";
import { createPortal } from "react-dom";

import { __ } from "@wordpress/i18n";

interface BlockInstance {
  attributes: Record<string, any>;
  innerBlocks: BlockInstance[];
  name: string;
  isValid: boolean;
  clientId: string;
}

//useRefで参照したDOM要素の大きさを取得するカスタムフック
export function useElementWidth(): {
  ref: RefObject<HTMLDivElement | null>;
  width: number;
} {
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

  return { ref, width };
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
      const iframeInstance = document.getElementsByName(
        "editor-canvas",
      )[0] as HTMLIFrameElement;
      if (iframeInstance && iframeInstance.contentWindow) {
        setIsMobile(iframeInstance.contentWindow.innerWidth <= 767);
      }
    };

    // iframeのcontentWindowのリサイズイベントにリスナーを追加
    const iframeInstance = document.getElementsByName(
      "editor-canvas",
    )[0] as HTMLIFrameElement;
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
          checkIframeSize,
        );
      }
    };
  }, []);

  return isMobile;
}

//ブロックの背景色を取得するカスタムフック
export function useElementBackgroundColor(
  blockRef: RefObject<HTMLElement>,
  style: React.CSSProperties,
) {
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

//ブロックのスタイルを取得し、コールバック関数を返すカスタムフック
function camelToKebab(prop: string) {
  if (prop.startsWith("--")) {
    return prop;
  }

  return prop.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

export function useElementStyleObject(
  blockRef: RefObject<HTMLElement>,
  style: React.CSSProperties = {},
) {
  const [styleObject, setStyleObject] = useState("");

  const styleSignature = JSON.stringify(style ?? {});

  useEffect(() => {
    const element = blockRef.current;

    if (!element || !styleSignature || styleSignature === "{}") {
      return;
    }

    let cancelled = false;

    const frameId = window.requestAnimationFrame(() => {
      if (cancelled || !blockRef.current) {
        return;
      }

      const computedStyles = window.getComputedStyle(blockRef.current);
      const styleKeys = Object.keys(JSON.parse(styleSignature));

      const newStyleObject = styleKeys.reduce<Record<string, string>>(
        (acc, key) => {
          const cssPropertyName = camelToKebab(key);

          const value = computedStyles.getPropertyValue(cssPropertyName);

          if (value) {
            acc[key] = value.trim();
          }

          return acc;
        },
        {},
      );

      const nextStyleObject = JSON.stringify(newStyleObject);

      setStyleObject((prev) => {
        return prev === nextStyleObject ? prev : nextStyleObject;
      });
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frameId);
    };
  }, [blockRef, styleSignature]);
  return styleObject;
}

//たくさんの要素をもつオブジェクトや配列の内容の変化で発火するuseEffect
export function useDeepCompareEffect(
  callback: () => void | (() => void), // EffectCallback の中身を直接書く
  dependencies: any[], // DependencyList の中身を直接書く
): void {
  const dependenciesRef = useRef<any[]>();

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
    const iframeInstance = document.getElementsByName(
      "editor-canvas",
    )[0] as HTMLIFrameElement;

    if (iframeInstance) {
      const iframeDocument =
        iframeInstance.contentDocument ||
        iframeInstance.contentWindow?.document;
      if (!iframeDocument) {
        // 存在しない場合はここで終了（ガード）
        return;
      }
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
const getFlattenBlocks = (blocks: BlockInstance[]): BlockInstance[] => {
  return blocks.reduce<BlockInstance[]>((acc, block) => {
    acc.push(block);
    if (block.innerBlocks && block.innerBlocks.length > 0) {
      acc.push(...getFlattenBlocks(block.innerBlocks));
    }
    return acc;
  }, []);
};

//指定されたブロック名とクラス名を含むブロックの属性が更新されたときその更新内容をかえすフック
export function useBlockAttributeChanges(
  clientId: string,
  blockName: string,
  className: string,
  modFlg: boolean = false,
  excludeAttributes: Record<string, any> = {},
) {
  const [latestAttributes, setLatestAttributes] = useState<string | null>(null);
  //const [idleFlg, setIdleFlg] = useState(null);
  const prevBlocksRef = useRef<Record<string, BlockInstance>>({});

  //属性変更関数を取得
  const { updateBlockAttributes } = useDispatch("core/block-editor") as any;
  //インナーブロックを平坦化する関数
  const flattenedBlocks = useSelect(
    (select) => {
      const { getBlock } = select("core/block-editor") as any;
      const rootBlock = getBlock(clientId) as BlockInstance | null;
      return rootBlock ? getFlattenBlocks([rootBlock]) : [];
    },
    [clientId],
  );

  const targetBlocks = flattenedBlocks.filter(
    (block) =>
      block.name === blockName &&
      block.attributes.className?.includes(className),
  );

  useEffect(() => {
    //平坦化されたブロックを調査
    for (const block of targetBlocks) {
      const prevAttributes =
        prevBlocksRef.current[block.clientId]?.attributes || {};
      //既に先に記録された属性があることをチェック
      if (Object.keys(prevAttributes).length > 0) {
        // 除外する属性を取り除いた属性オブジェクトを作成
        const filteredCurrentAttributes = Object.keys(block.attributes).reduce<
          Record<string, any>
        >((acc, key) => {
          if (!(key in excludeAttributes)) {
            acc[key] = block.attributes[key];
          }
          return acc;
        }, {});

        const filteredPrevAttributes = Object.keys(prevAttributes).reduce<
          Record<string, any>
        >((acc, key) => {
          if (!(key in excludeAttributes)) {
            acc[key] = prevAttributes[key];
          }
          return acc;
        }, {});

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

  // 安全なパース処理
  try {
    return latestAttributes ? JSON.parse(latestAttributes) : null;
  } catch (e) {
    return null;
  }
}

//インナーブロックが挿入されたとき、指定されたブロック名が存在れば、挿入されたブロックを削除するフック
export function useDuplicateBlockRemove(
  clientId: string,
  blockNames: string[],
) {
  const { removeBlock } = useDispatch("core/block-editor") as any;
  const { createNotice } = useDispatch("core/notices") as any;

  // clientIdに対応するインナーブロックを取得
  const innerBlocks = useSelect(
    (select) => {
      const { getBlocks } = select("core/block-editor") as any;
      return getBlocks(clientId) as BlockInstance[];
    },
    [clientId],
  ) as BlockInstance[];

  // 前回の innerBlocks を保存するための ref
  const prevInnerBlocksRef = useRef<BlockInstance[]>(innerBlocks);

  useEffect(() => {
    const prevInnerBlocks = prevInnerBlocksRef.current;
    //先に保存したインナーブロックの中に対象となるブロックが存在しなければ何もしない
    const result = prevInnerBlocks.some((block) =>
      blockNames.includes(block.name),
    );

    if (result) {
      // ブロックが挿入されているか確認（前回と比較）
      if (innerBlocks.length > prevInnerBlocks.length) {
        // 新しく挿入されたブロックを特定
        const newlyInsertedBlock = innerBlocks.find(
          (block) =>
            !prevInnerBlocks.some(
              (prevBlock) => prevBlock.clientId === block.clientId,
            ),
        );

        // 新しいブロックが blockNames に含まれている場合、削除
        if (
          newlyInsertedBlock &&
          blockNames.includes(newlyInsertedBlock.name)
        ) {
          removeBlock(newlyInsertedBlock.clientId);

          // 通知を作成
          createNotice(
            "error", // 通知のタイプ（エラー）
            __(
              "A new block cannot be inserted because a block has already been placed.",
              "block-collections",
            ), // メッセージ
            {
              type: "snackbar", // 通知のスタイル
              isDismissible: true, // 通知を閉じることができるか
            },
          );
        }
      }
    }

    // 現在の innerBlocks を次回用に保存
    prevInnerBlocksRef.current = innerBlocks;
  }, [innerBlocks, blockNames, removeBlock, createNotice]);
}

//iframeにスタイルをわたすReactコンポーネントを作る
export function useStyleIframe<T>(
  StyleComp: React.ComponentType<{ attributes: T; children?: React.ReactNode }>,
  attributes: T,
  styleName = "",
) {
  const [iframeHead, setIframeHead] = useState<HTMLHeadElement | null>(null);

  useEffect(() => {
    let disposed = false;
    let timerId: number | undefined;

    const findIframeHead = () => {
      const iframe = document.getElementsByName("editor-canvas")[0] as
        | HTMLIFrameElement
        | undefined;

      const doc =
        iframe?.contentDocument || iframe?.contentWindow?.document || null;

      if (doc?.head && !disposed) {
        setIframeHead(doc.head);
        return true;
      }

      return false;
    };

    if (!findIframeHead()) {
      timerId = window.setInterval(() => {
        if (findIframeHead() && timerId) {
          window.clearInterval(timerId);
        }
      }, 100);
    }

    return () => {
      disposed = true;
      if (timerId) {
        window.clearInterval(timerId);
      }
    };
  }, []);

  if (!iframeHead) return null;

  return createPortal(
    <StyleSheetManager target={iframeHead}>
      <StyleComp attributes={attributes} />
    </StyleSheetManager>,
    iframeHead,
  );
}
