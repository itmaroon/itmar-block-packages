import {
  Button,
  Icon,
  PanelRow,
  ComboboxControl,
  ToolbarDropdownMenu,
  __experimentalNumberControl as NumberControl,
  __experimentalUnitControl as UnitControl,
  __experimentalInputControl as InputControl,
} from "@wordpress/components";

import { useSelect, dispatch } from "@wordpress/data";
import { useState, useEffect, useRef } from "@wordpress/element";

import { __ } from "@wordpress/i18n";
import { justifyCenter, justifyLeft, justifyRight } from "@wordpress/icons";
//上よせアイコン
const upper = <Icon icon={justifyLeft} className="rotate-icon" />;
//中央よせのアイコン
const middle = <Icon icon={justifyCenter} className="rotate-icon" />;
//下よせのアイコン
const lower = <Icon icon={justifyRight} className="rotate-icon" />;
// アイコンと文字列キーのマッピングを作成
const alignIconMap = {
  left: justifyLeft,
  center: justifyCenter,
  right: justifyRight,
  upper: upper,
  middle: middle,
  lower: lower,
};

const units = [
  { value: "px", label: "px" },
  { value: "em", label: "em" },
  { value: "rem", label: "rem" },
];

const initializeUnitArray = (rowUnit, length) => {
  if (!Array.isArray(rowUnit)) {
    // rowUnit が配列ではない（undefined を含む）場合、全て "1fr" で埋めた配列を返す
    return Array(length).fill("1fr");
  }

  return Array.from({ length }, (_, i) => rowUnit[i] || "1fr");
};

//r,cで与えられた座標がgridElmsのどの要素に含まれているかを返す
const findElementInGrid = (gridElms, r, c) => {
  for (let i = 0; i < gridElms.length; i++) {
    const { startCell, endCell } = gridElms[i];
    // 各座標の最小値と最大値を決定
    const minRow = Math.min(startCell?.rowInx, endCell?.rowInx);
    const maxRow = Math.max(startCell?.rowInx, endCell?.rowInx);
    const minCol = Math.min(startCell?.colInx, endCell?.colInx);
    const maxCol = Math.max(startCell?.colInx, endCell?.colInx);

    // 座標が範囲内にあるかどうかをチェック
    if (r >= minRow && r <= maxRow && c >= minCol && c <= maxCol) {
      return { index: i, elm: gridElms[i] };
    }
  }
  return null;
};

//親にイベントを伝播させないラッパー
const StopPropagationWrapper = ({ children }) => {
  const handleClick = (event) => {
    // イベントの伝播を阻止
    event.stopPropagation();
  };

  return (
    <div className="itmar_event_stopper" onClick={handleClick}>
      {children}
    </div>
  );
};

const GridControls = ({ attributes, clientId, onChange }) => {
  const { gridElms, rowNum, colNum, rowGap, colGap, rowUnit, colUnit } =
    attributes;

  //コンポーネント内の行列情報
  const [rowCount, setRowCount] = useState(rowNum);
  const [colCount, setColCount] = useState(colNum);

  //マウント時検出用フラグ
  const firstFlgRef = useRef(true);

  //グリッドの配置指定用テーブル要素
  const renderRows = () => {
    //セルが埋まっているかどうかの判定配列

    const occupied = new Array(rowCount)
      .fill(0)
      .map(() => new Array(colCount).fill(false));

    let rows = [];
    // 列単位入力行を追加
    let headerCells = [<th key="header-corner"></th>]; // 左上の角の空白セル
    for (let c = 0; c < colCount; c++) {
      headerCells.push(
        <th key={`header-${c}`}>
          <InputControl
            value={colUnit ? colUnit[c] : ""}
            type="text"
            isPressEnterToChange={true}
            onChange={(newValue) => {
              const newArray = [
                ...colUnit.slice(0, c),
                newValue,
                ...colUnit.slice(c + 1),
              ];
              setUnitColArray(newArray);
            }}
          />
        </th>
      );
    }
    rows.push(<tr key="header-row">{headerCells}</tr>);

    // 各行とセルの生成
    for (let r = 0; r < rowCount; r++) {
      let cells = [];
      // 行行単位入力を追加
      cells.push(
        <th key={`row-header-${r}`}>
          <InputControl
            value={rowUnit ? rowUnit[r] : ""}
            type="text"
            isPressEnterToChange={true}
            onChange={(newValue) => {
              const newArray = [
                ...rowUnit.slice(0, r),
                newValue,
                ...rowUnit.slice(r + 1),
              ];
              setUnitRowArray(newArray);
            }}
          />
        </th>
      );

      // 各行に対するセルを生成
      for (let c = 0; c < colCount; c++) {
        if (occupied[r][c]) {
          continue; // このセルは既に占められているのでスキップ
        }
        //複数のセルを占める設定があればセルの結合オブジェクトを生成
        const setElm = findElementInGrid(gridElms, r, c);
        const rowSpanValue = setElm
          ? Math.abs(setElm.elm.startCell.rowInx - setElm.elm.endCell.rowInx)
          : 0;
        const colSpanValue = setElm
          ? Math.abs(setElm.elm.startCell.colInx - setElm.elm.endCell.colInx)
          : 0;
        const cellSpan = {
          ...(rowSpanValue !== 0 && { rowspan: rowSpanValue + 1 }),
          ...(colSpanValue !== 0 && { colspan: colSpanValue + 1 }),
        };
        // 占められるセルの位置を記録
        for (let i = 0; i <= rowSpanValue; i++) {
          for (let j = 0; j <= colSpanValue; j++) {
            if (r + i < rowCount && c + j < colCount) {
              occupied[r + i][c + j] = true;
            }
          }
        }
        //セルを生成
        cells.push(
          <td
            key={`cell-${r}-${c}`}
            {...cellSpan}
            className={isCellSelected(r, c) ? "selected" : ""}
            style={
              setElm
                ? {
                    backgroundColor: `var(--wp--custom--color--area-${setElm.index})`,
                  }
                : undefined
            }
            onClick={() => detectCellPosition(r, c)}
          >
            {setElm && (
              <StopPropagationWrapper>
                <ToolbarDropdownMenu
                  label={__("Lateral Alignment", "block-collections")}
                  icon={
                    setElm.elm.latAlign
                      ? alignIconMap[setElm.elm.latAlign]
                      : alignIconMap["left"]
                  }
                  controls={["left", "center", "right"].map((align) => ({
                    icon: alignIconMap[align],
                    isActive: setElm.elm.latAlign === align,
                    onClick: () =>
                      updateAlignment(setElm.index, align, "latAlign"),
                  }))}
                />
                <ToolbarDropdownMenu
                  label={__("Vertical Alignment", "block-collections")}
                  icon={
                    setElm.elm.vertAlign
                      ? alignIconMap[setElm.elm.vertAlign]
                      : alignIconMap["upper"]
                  }
                  controls={["upper", "middle", "lower"].map((align) => ({
                    icon: alignIconMap[align],
                    isActive: setElm.elm.vertAlign === align,
                    onClick: () =>
                      updateAlignment(setElm.index, align, "vertAlign"),
                  }))}
                />
              </StopPropagationWrapper>
            )}
          </td>
        );
      }
      // 行の追加
      rows.push(<tr key={`row-${r}`}>{cells}</tr>);
    }
    return rows;
  };

  //テーブルの位置選択関数
  const detectCellPosition = (rowIndex, colIndex) => {
    //インナーブロックの選択がなければリターン
    if (!selBlock) {
      dispatch("core/notices").createNotice(
        "error",
        __("No blocks selected.", "itmar_guest_contact_block"),
        { type: "snackbar", isDismissible: true }
      );
      return;
    }
    //選択済みのセルが選択されたときはリターン
    if (findElementInGrid(gridElms, rowIndex, colIndex)) {
      dispatch("core/notices").createNotice(
        "error",
        __(
          "That cell is already selected by another block.",
          "itmar_guest_contact_block"
        ),
        { type: "snackbar", isDismissible: true }
      );
      return;
    }

    //選択されたブロックのポジションを記録
    const newBlock = !selBlock.startCell
      ? {
          ...selBlock,
          startCell: { rowInx: rowIndex, colInx: colIndex },
          endCell: { rowInx: rowIndex, colInx: colIndex },
        }
      : { ...selBlock, endCell: { rowInx: rowIndex, colInx: colIndex } };

    setSelBlock(newBlock);

    //blockNamesの更新
    const index = gridElms?.findIndex(
      (block) => block.value === selBlock.value
    );
    const setAreaBlock = [
      ...blockNames.slice(0, index),
      newBlock,
      ...blockNames.slice(index + 1),
    ];
    setBlockNames(setAreaBlock);
  };

  // セルが選択されているか判断する関数
  const isCellSelected = (rowIndex, colIndex) => {
    if (selBlock) {
      // 各座標の最小値と最大値を決定
      const minRow = Math.min(
        selBlock.startCell?.rowInx,
        selBlock.endCell?.rowInx
      );
      const maxRow = Math.max(
        selBlock.startCell?.rowInx,
        selBlock.endCell?.rowInx
      );
      const minCol = Math.min(
        selBlock.startCell?.colInx,
        selBlock.endCell?.colInx
      );
      const maxCol = Math.max(
        selBlock.startCell?.colInx,
        selBlock.endCell?.colInx
      );

      // 座標が範囲内にあるかどうかをチェック
      return (
        rowIndex >= minRow &&
        rowIndex <= maxRow &&
        colIndex >= minCol &&
        colIndex <= maxCol
      );
    } else {
      return false;
    }
  };

  //コンテンツ位置設定
  const updateAlignment = (index, align, derection) => {
    const alignBlock = { ...blockNames[index], [derection]: align };
    const setAlignBlock = [
      ...blockNames.slice(0, index),
      alignBlock,
      ...blockNames.slice(index + 1),
    ];
    setBlockNames(setAlignBlock);
  };

  //選択したインナーブロック
  const [selBlock, setSelBlock] = useState(null);

  //インナーブロックを取得
  const parentBlocks = useSelect(
    (select) => {
      const innerBlocks = select("core/block-editor").getBlocks(clientId);
      //インナーブロック入れ替えの際は既に登録したブロックの位置情報があれば、それを付加する。
      const new_block_names = innerBlocks.map((block, index) =>
        gridElms.length > index
          ? {
              value: block.clientId,
              label: block.name,
              startCell: gridElms[index].startCell,
              endCell: gridElms[index].endCell,
              latAlign: gridElms[index].latAlign,
              vertAlign: gridElms[index].vertAlign,
            }
          : {
              value: block.clientId,
              label: block.name,
            }
      );
      return new_block_names;
    },
    [clientId]
  );
  const [blockNames, setBlockNames] = useState(parentBlocks);

  //グリッド配置のクリア
  const clear_placement = () => {
    //ブロックの配置情報削除
    const clear_block = blockNames.map((block) => ({
      value: block.value,
      label: block.label,
    }));
    setBlockNames(clear_block);
  };

  //単位配列の初期化
  const initRowUnitArray = initializeUnitArray(rowUnit, rowCount);
  const [unitRowArray, setUnitRowArray] = useState(initRowUnitArray);
  const initColUnitArray = initializeUnitArray(colUnit, colCount);
  const [unitColArray, setUnitColArray] = useState(initColUnitArray);

  //親ブロックへの書き戻し
  useEffect(() => {
    const gridStyle = {
      ...attributes,
      gridElms: blockNames,
      rowNum: rowCount,
      colNum: colCount,
      rowUnit: unitRowArray,
      colUnit: unitColArray,
    };

    onChange(gridStyle);
  }, [blockNames, unitRowArray, unitColArray]);

  //行と列の数を変えた場合は位置情報を削除・単位の再編成
  useEffect(() => {
    if (!firstFlgRef.current) {
      //マウント時は実行しない
      //ブロックの位置情報クリア
      clear_placement();
      //単位情報の再編成
      const newRowUnitArray = initializeUnitArray(rowUnit, rowCount);
      setUnitRowArray(newRowUnitArray);
      const newColUnitArray = initializeUnitArray(colUnit, colCount);
      setUnitColArray(newColUnitArray);
    } else {
      firstFlgRef.current = false;
    }
  }, [rowCount, colCount]);

  return (
    <>
      <PanelRow className="distance_row">
        <NumberControl
          onChange={(newValue) => {
            const input_val =
              typeof newValue === "number" ? newValue : Number(newValue);
            setRowCount(input_val);
          }}
          label={__("Number of Row ", "block-collections")}
          value={rowCount}
          min={2}
        />
        <NumberControl
          onChange={(newValue) => {
            const input_val =
              typeof newValue === "number" ? newValue : Number(newValue);
            setColCount(input_val);
          }}
          label={__("Number of Colum", "block-collections")}
          value={colCount}
        />
      </PanelRow>
      <PanelRow className="distance_row">
        <UnitControl
          onChange={(newValue) => {
            newValue = newValue != "" ? newValue : "0px";
            const newStyle = { ...attributes, rowGap: newValue };
            onChange(newStyle);
          }}
          label={__("Row Gap", "block-collections")}
          value={rowGap}
          units={units}
        />
        <UnitControl
          onChange={(newValue) => {
            newValue = newValue != "" ? newValue : "0px";
            const newStyle = { ...attributes, colGap: newValue };
            onChange(newStyle);
          }}
          label={__("Colum Gap", "block-collections")}
          value={colGap}
          units={units}
        />
      </PanelRow>

      <PanelRow className="distance_row">
        <p>{__("Element placement", "block-collections")}</p>
        <Button variant="secondary" onClick={clear_placement}>
          {__("Clear", "block-collections")}
        </Button>
      </PanelRow>

      <PanelRow className="grid_table">
        <table>{renderRows()}</table>
      </PanelRow>
      <ComboboxControl
        label={__("InnerBlock Name", "block-collections")}
        options={blockNames}
        value={selBlock ? selBlock.value : null}
        onChange={(sel_id) => {
          const matchedBlock = blockNames.find(
            (block) => block.value === sel_id
          );
          setSelBlock(matchedBlock);
        }}
      />
    </>
  );
};
export default GridControls;
