'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var element = require('@wordpress/element');
var components = require('@wordpress/components');
var data = require('@wordpress/data');
var i18n = require('@wordpress/i18n');
var icons = require('@wordpress/icons');

//上よせアイコン
const upper = element.createElement(components.Icon, { icon: icons.justifyLeft, className: "rotate-icon" });
//中央よせのアイコン
const middle = element.createElement(components.Icon, { icon: icons.justifyCenter, className: "rotate-icon" });
//下よせのアイコン
const lower = element.createElement(components.Icon, { icon: icons.justifyRight, className: "rotate-icon" });
// アイコンと文字列キーのマッピングを作成
const alignIconMap = {
    left: icons.justifyLeft,
    center: icons.justifyCenter,
    right: icons.justifyRight,
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
const StopPropagationWrapper = ({ children }) => {
    const handleClick = (event) => {
        // イベントの伝播を阻止
        event.stopPropagation();
    };
    return (element.createElement("div", { className: "itmar_event_stopper", onClick: handleClick }, children));
};
const GridControls = ({ attributes, clientId, onChange, }) => {
    const { gridElms, rowNum, colNum, rowGap, colGap, rowUnit, colUnit } = attributes;
    //コンポーネント内の行列情報
    const [rowCount, setRowCount] = element.useState(rowNum);
    const [colCount, setColCount] = element.useState(colNum);
    //マウント時検出用フラグ
    const firstFlgRef = element.useRef(true);
    //グリッドの配置指定用テーブル要素
    const renderRows = () => {
        //セルが埋まっているかどうかの判定配列
        const occupied = new Array(rowCount)
            .fill(0)
            .map(() => new Array(colCount).fill(false));
        let rows = [];
        // 列単位入力行を追加
        let headerCells = [element.createElement("th", { key: "header-corner" })]; // 左上の角の空白セル
        for (let c = 0; c < colCount; c++) {
            headerCells.push(element.createElement("th", { key: `header-${c}` },
                element.createElement(components.__experimentalInputControl, { value: colUnit ? colUnit[c] : "", type: "text", isPressEnterToChange: true, onChange: (newValue) => {
                        // 2. newValue が undefined の可能性を考慮してガードを入れる
                        const safeValue = newValue ?? "";
                        const newArray = [
                            ...colUnit.slice(0, c),
                            safeValue,
                            ...colUnit.slice(c + 1),
                        ];
                        setUnitColArray(newArray);
                    } })));
        }
        rows.push(element.createElement("tr", { key: "header-row" }, headerCells));
        // 各行とセルの生成
        for (let r = 0; r < rowCount; r++) {
            let cells = [];
            // 行行単位入力を追加
            cells.push(element.createElement("th", { key: `row-header-${r}` },
                element.createElement(components.__experimentalInputControl, { value: rowUnit ? rowUnit[r] : "", type: "text", isPressEnterToChange: true, onChange: (newValue) => {
                        // newValue が undefined の可能性を考慮してガードを入れる
                        const safeValue = newValue ?? "";
                        const newArray = [
                            ...rowUnit.slice(0, r),
                            safeValue,
                            ...rowUnit.slice(r + 1),
                        ];
                        setUnitRowArray(newArray);
                    } })));
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
                cells.push(element.createElement("td", { key: `cell-${r}-${c}`, ...cellSpan, className: isCellSelected(r, c) ? "selected" : "", style: setElm
                        ? {
                            backgroundColor: `var(--wp--custom--color--area-${setElm.index})`,
                        }
                        : undefined, onClick: () => detectCellPosition(r, c) }, setElm && (element.createElement(StopPropagationWrapper, null,
                    element.createElement(components.ToolbarDropdownMenu, { label: i18n.__("Lateral Alignment", "block-collections"), icon: setElm.elm.latAlign
                            ? alignIconMap[setElm.elm.latAlign]
                            : alignIconMap["left"], controls: ["left", "center", "right"].map((align) => ({
                            icon: alignIconMap[align],
                            title: i18n.__(align.charAt(0).toUpperCase() + align.slice(1), "block-collections"),
                            isActive: setElm.elm.latAlign === align,
                            onClick: () => updateAlignment(setElm.index, align, "latAlign"),
                        })) }),
                    element.createElement(components.ToolbarDropdownMenu, { label: i18n.__("Vertical Alignment", "block-collections"), icon: setElm.elm.vertAlign
                            ? alignIconMap[setElm.elm.vertAlign]
                            : alignIconMap["upper"], controls: ["upper", "middle", "lower"].map((align) => ({
                            icon: alignIconMap[align],
                            title: i18n.__(align.charAt(0).toUpperCase() + align.slice(1), "block-collections"),
                            isActive: setElm.elm.vertAlign === align,
                            onClick: () => updateAlignment(setElm.index, align, "vertAlign"),
                        })) })))));
            }
            // 行の追加
            rows.push(element.createElement("tr", { key: `row-${r}` }, cells));
        }
        return rows;
    };
    //テーブルの位置選択関数
    const detectCellPosition = (rowIndex, colIndex) => {
        //インナーブロックの選択がなければリターン
        if (!selBlock) {
            data.dispatch("core/notices").createNotice("error", i18n.__("No blocks selected.", "itmar_guest_contact_block"), { type: "snackbar", isDismissible: true });
            return;
        }
        //選択済みのセルが選択されたときはリターン
        if (findElementInGrid(gridElms, rowIndex, colIndex)) {
            data.dispatch("core/notices").createNotice("error", i18n.__("That cell is already selected by another block.", "itmar_guest_contact_block"), { type: "snackbar", isDismissible: true });
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
        const index = gridElms?.findIndex((block) => block.value === selBlock.value);
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
            const minRow = Math.min(selBlock.startCell?.rowInx, selBlock.endCell?.rowInx);
            const maxRow = Math.max(selBlock.startCell?.rowInx, selBlock.endCell?.rowInx);
            const minCol = Math.min(selBlock.startCell?.colInx, selBlock.endCell?.colInx);
            const maxCol = Math.max(selBlock.startCell?.colInx, selBlock.endCell?.colInx);
            // 座標が範囲内にあるかどうかをチェック
            return (rowIndex >= minRow &&
                rowIndex <= maxRow &&
                colIndex >= minCol &&
                colIndex <= maxCol);
        }
        else {
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
    const [selBlock, setSelBlock] = element.useState(null);
    //インナーブロックを取得
    const parentBlocks = data.useSelect((select) => {
        // 1. select の型を補完（または any で一時回避）
        const editor = select("core/block-editor");
        const innerBlocks = editor.getBlocks(clientId);
        //インナーブロック入れ替えの際は既に登録したブロックの位置情報があれば、それを付加する。
        const new_block_names = innerBlocks.map((block, index) => gridElms.length > index
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
            });
        return new_block_names;
    }, [clientId]);
    const [blockNames, setBlockNames] = element.useState(parentBlocks);
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
    const [unitRowArray, setUnitRowArray] = element.useState(initRowUnitArray);
    const initColUnitArray = initializeUnitArray(colUnit, colCount);
    const [unitColArray, setUnitColArray] = element.useState(initColUnitArray);
    //親ブロックへの書き戻し
    element.useEffect(() => {
        const gridStyle = {
            ...attributes,
            gridElms: blockNames, // BlockNameItem[] を GridElement[] に合わせる
            rowNum: rowCount,
            colNum: colCount,
            rowGap: attributes.rowGap ?? "0px", // 必須プロパティが空の場合のガード
            colGap: attributes.colGap ?? "0px",
            rowUnit: unitRowArray,
            colUnit: unitColArray,
        };
        onChange(gridStyle);
    }, [blockNames, unitRowArray, unitColArray]);
    //行と列の数を変えた場合は位置情報を削除・単位の再編成
    element.useEffect(() => {
        if (!firstFlgRef.current) {
            //マウント時は実行しない
            //ブロックの位置情報クリア
            clear_placement();
            //単位情報の再編成
            const newRowUnitArray = initializeUnitArray(rowUnit, rowCount);
            setUnitRowArray(newRowUnitArray);
            const newColUnitArray = initializeUnitArray(colUnit, colCount);
            setUnitColArray(newColUnitArray);
        }
        else {
            firstFlgRef.current = false;
        }
    }, [rowCount, colCount]);
    return (element.createElement(element.Fragment, null,
        element.createElement(components.PanelRow, { className: "distance_row" },
            element.createElement(components.__experimentalNumberControl, { onChange: (newValue) => {
                    const input_val = typeof newValue === "number" ? newValue : Number(newValue);
                    setRowCount(input_val);
                }, label: i18n.__("Number of Row ", "block-collections"), value: rowCount, min: 2 }),
            element.createElement(components.__experimentalNumberControl, { onChange: (newValue) => {
                    const input_val = typeof newValue === "number" ? newValue : Number(newValue);
                    setColCount(input_val);
                }, label: i18n.__("Number of Colum", "block-collections"), value: colCount })),
        element.createElement(components.PanelRow, { className: "distance_row" },
            element.createElement(components.__experimentalUnitControl, { onChange: (newValue) => {
                    newValue = newValue != "" ? newValue : "0px";
                    const newStyle = { ...attributes, rowGap: newValue };
                    onChange(newStyle);
                }, label: i18n.__("Row Gap", "block-collections"), value: rowGap, units: units }),
            element.createElement(components.__experimentalUnitControl, { onChange: (newValue) => {
                    newValue = newValue != "" ? newValue : "0px";
                    const newStyle = { ...attributes, colGap: newValue };
                    onChange(newStyle);
                }, label: i18n.__("Colum Gap", "block-collections"), value: colGap, units: units })),
        element.createElement(components.PanelRow, { className: "distance_row" },
            element.createElement("p", null, i18n.__("Element placement", "block-collections")),
            element.createElement(components.Button, { variant: "secondary", onClick: clear_placement }, i18n.__("Clear", "block-collections"))),
        element.createElement(components.PanelRow, { className: "grid_table" },
            element.createElement("table", null, renderRows())),
        element.createElement(components.ComboboxControl, { label: i18n.__("InnerBlock Name", "block-collections"), options: blockNames, value: selBlock ? selBlock.value : null, onChange: (sel_id) => {
                const matchedBlock = blockNames.find((block) => block.value === sel_id);
                if (matchedBlock) {
                    setSelBlock(matchedBlock);
                }
                else {
                    setSelBlock(null);
                }
            } })));
};

exports.default = GridControls;
//# sourceMappingURL=GridControls.js.map
