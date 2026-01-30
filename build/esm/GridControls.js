import { objectSpread2 as _objectSpread2, extends as _extends } from './_virtual/_rollupPluginBabelHelpers.js';
import { PanelRow, __experimentalNumberControl, __experimentalUnitControl, Button, ComboboxControl, __experimentalInputControl, ToolbarDropdownMenu, Icon } from '@wordpress/components';
import { useSelect, dispatch } from '@wordpress/data';
import { useState, useRef, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { justifyRight, justifyCenter, justifyLeft } from '@wordpress/icons';

//上よせアイコン
var upper = /*#__PURE__*/React.createElement(Icon, {
  icon: justifyLeft,
  className: "rotate-icon"
});
//中央よせのアイコン
var middle = /*#__PURE__*/React.createElement(Icon, {
  icon: justifyCenter,
  className: "rotate-icon"
});
//下よせのアイコン
var lower = /*#__PURE__*/React.createElement(Icon, {
  icon: justifyRight,
  className: "rotate-icon"
});
// アイコンと文字列キーのマッピングを作成
var alignIconMap = {
  left: justifyLeft,
  center: justifyCenter,
  right: justifyRight,
  upper: upper,
  middle: middle,
  lower: lower
};
var units = [{
  value: "px",
  label: "px"
}, {
  value: "em",
  label: "em"
}, {
  value: "rem",
  label: "rem"
}];
var initializeUnitArray = (rowUnit, length) => {
  if (!Array.isArray(rowUnit)) {
    // rowUnit が配列ではない（undefined を含む）場合、全て "1fr" で埋めた配列を返す
    return Array(length).fill("1fr");
  }
  return Array.from({
    length
  }, (_, i) => rowUnit[i] || "1fr");
};

//r,cで与えられた座標がgridElmsのどの要素に含まれているかを返す
var findElementInGrid = (gridElms, r, c) => {
  for (var i = 0; i < gridElms.length; i++) {
    var {
      startCell,
      endCell
    } = gridElms[i];
    // 各座標の最小値と最大値を決定
    var minRow = Math.min(startCell === null || startCell === void 0 ? void 0 : startCell.rowInx, endCell === null || endCell === void 0 ? void 0 : endCell.rowInx);
    var maxRow = Math.max(startCell === null || startCell === void 0 ? void 0 : startCell.rowInx, endCell === null || endCell === void 0 ? void 0 : endCell.rowInx);
    var minCol = Math.min(startCell === null || startCell === void 0 ? void 0 : startCell.colInx, endCell === null || endCell === void 0 ? void 0 : endCell.colInx);
    var maxCol = Math.max(startCell === null || startCell === void 0 ? void 0 : startCell.colInx, endCell === null || endCell === void 0 ? void 0 : endCell.colInx);

    // 座標が範囲内にあるかどうかをチェック
    if (r >= minRow && r <= maxRow && c >= minCol && c <= maxCol) {
      return {
        index: i,
        elm: gridElms[i]
      };
    }
  }
  return null;
};

//親にイベントを伝播させないラッパー
var StopPropagationWrapper = _ref => {
  var {
    children
  } = _ref;
  var handleClick = event => {
    // イベントの伝播を阻止
    event.stopPropagation();
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "itmar_event_stopper",
    onClick: handleClick
  }, children);
};
var GridControls = _ref2 => {
  var {
    attributes,
    clientId,
    onChange: _onChange
  } = _ref2;
  var {
    gridElms,
    rowNum,
    colNum,
    rowGap,
    colGap,
    rowUnit,
    colUnit
  } = attributes;

  //コンポーネント内の行列情報
  var [rowCount, setRowCount] = useState(rowNum);
  var [colCount, setColCount] = useState(colNum);

  //マウント時検出用フラグ
  var firstFlgRef = useRef(true);

  //グリッドの配置指定用テーブル要素
  var renderRows = () => {
    //セルが埋まっているかどうかの判定配列

    var occupied = new Array(rowCount).fill(0).map(() => new Array(colCount).fill(false));
    var rows = [];
    // 列単位入力行を追加
    var headerCells = [/*#__PURE__*/React.createElement("th", {
      key: "header-corner"
    })]; // 左上の角の空白セル
    var _loop = function _loop(c) {
      headerCells.push(/*#__PURE__*/React.createElement("th", {
        key: "header-".concat(c)
      }, /*#__PURE__*/React.createElement(__experimentalInputControl, {
        value: colUnit ? colUnit[c] : "",
        type: "text",
        isPressEnterToChange: true,
        onChange: newValue => {
          var newArray = [...colUnit.slice(0, c), newValue, ...colUnit.slice(c + 1)];
          setUnitColArray(newArray);
        }
      })));
    };
    for (var c = 0; c < colCount; c++) {
      _loop(c);
    }
    rows.push(/*#__PURE__*/React.createElement("tr", {
      key: "header-row"
    }, headerCells));

    // 各行とセルの生成
    var _loop2 = function _loop2(r) {
      var cells = [];
      // 行行単位入力を追加
      cells.push(/*#__PURE__*/React.createElement("th", {
        key: "row-header-".concat(r)
      }, /*#__PURE__*/React.createElement(__experimentalInputControl, {
        value: rowUnit ? rowUnit[r] : "",
        type: "text",
        isPressEnterToChange: true,
        onChange: newValue => {
          var newArray = [...rowUnit.slice(0, r), newValue, ...rowUnit.slice(r + 1)];
          setUnitRowArray(newArray);
        }
      })));

      // 各行に対するセルを生成
      var _loop3 = function _loop3(_c) {
        if (occupied[r][_c]) {
          return 1; // continue
          // このセルは既に占められているのでスキップ
        }
        //複数のセルを占める設定があればセルの結合オブジェクトを生成
        var setElm = findElementInGrid(gridElms, r, _c);
        var rowSpanValue = setElm ? Math.abs(setElm.elm.startCell.rowInx - setElm.elm.endCell.rowInx) : 0;
        var colSpanValue = setElm ? Math.abs(setElm.elm.startCell.colInx - setElm.elm.endCell.colInx) : 0;
        var cellSpan = _objectSpread2(_objectSpread2({}, rowSpanValue !== 0 && {
          rowspan: rowSpanValue + 1
        }), colSpanValue !== 0 && {
          colspan: colSpanValue + 1
        });
        // 占められるセルの位置を記録
        for (var i = 0; i <= rowSpanValue; i++) {
          for (var j = 0; j <= colSpanValue; j++) {
            if (r + i < rowCount && _c + j < colCount) {
              occupied[r + i][_c + j] = true;
            }
          }
        }
        //セルを生成
        cells.push(/*#__PURE__*/React.createElement("td", _extends({
          key: "cell-".concat(r, "-").concat(_c)
        }, cellSpan, {
          className: isCellSelected(r, _c) ? "selected" : "",
          style: setElm ? {
            backgroundColor: "var(--wp--custom--color--area-".concat(setElm.index, ")")
          } : undefined,
          onClick: () => detectCellPosition(r, _c)
        }), setElm && /*#__PURE__*/React.createElement(StopPropagationWrapper, null, /*#__PURE__*/React.createElement(ToolbarDropdownMenu, {
          label: __("Lateral Alignment", "block-collections"),
          icon: setElm.elm.latAlign ? alignIconMap[setElm.elm.latAlign] : alignIconMap["left"],
          controls: ["left", "center", "right"].map(align => ({
            icon: alignIconMap[align],
            isActive: setElm.elm.latAlign === align,
            onClick: () => updateAlignment(setElm.index, align, "latAlign")
          }))
        }), /*#__PURE__*/React.createElement(ToolbarDropdownMenu, {
          label: __("Vertical Alignment", "block-collections"),
          icon: setElm.elm.vertAlign ? alignIconMap[setElm.elm.vertAlign] : alignIconMap["upper"],
          controls: ["upper", "middle", "lower"].map(align => ({
            icon: alignIconMap[align],
            isActive: setElm.elm.vertAlign === align,
            onClick: () => updateAlignment(setElm.index, align, "vertAlign")
          }))
        }))));
      };
      for (var _c = 0; _c < colCount; _c++) {
        if (_loop3(_c)) continue;
      }
      // 行の追加
      rows.push(/*#__PURE__*/React.createElement("tr", {
        key: "row-".concat(r)
      }, cells));
    };
    for (var r = 0; r < rowCount; r++) {
      _loop2(r);
    }
    return rows;
  };

  //テーブルの位置選択関数
  var detectCellPosition = (rowIndex, colIndex) => {
    //インナーブロックの選択がなければリターン
    if (!selBlock) {
      dispatch("core/notices").createNotice("error", __("No blocks selected.", "itmar_guest_contact_block"), {
        type: "snackbar",
        isDismissible: true
      });
      return;
    }
    //選択済みのセルが選択されたときはリターン
    if (findElementInGrid(gridElms, rowIndex, colIndex)) {
      dispatch("core/notices").createNotice("error", __("That cell is already selected by another block.", "itmar_guest_contact_block"), {
        type: "snackbar",
        isDismissible: true
      });
      return;
    }

    //選択されたブロックのポジションを記録
    var newBlock = !selBlock.startCell ? _objectSpread2(_objectSpread2({}, selBlock), {}, {
      startCell: {
        rowInx: rowIndex,
        colInx: colIndex
      },
      endCell: {
        rowInx: rowIndex,
        colInx: colIndex
      }
    }) : _objectSpread2(_objectSpread2({}, selBlock), {}, {
      endCell: {
        rowInx: rowIndex,
        colInx: colIndex
      }
    });
    setSelBlock(newBlock);

    //blockNamesの更新
    var index = gridElms === null || gridElms === void 0 ? void 0 : gridElms.findIndex(block => block.value === selBlock.value);
    var setAreaBlock = [...blockNames.slice(0, index), newBlock, ...blockNames.slice(index + 1)];
    setBlockNames(setAreaBlock);
  };

  // セルが選択されているか判断する関数
  var isCellSelected = (rowIndex, colIndex) => {
    if (selBlock) {
      var _selBlock$startCell, _selBlock$endCell, _selBlock$startCell2, _selBlock$endCell2, _selBlock$startCell3, _selBlock$endCell3, _selBlock$startCell4, _selBlock$endCell4;
      // 各座標の最小値と最大値を決定
      var minRow = Math.min((_selBlock$startCell = selBlock.startCell) === null || _selBlock$startCell === void 0 ? void 0 : _selBlock$startCell.rowInx, (_selBlock$endCell = selBlock.endCell) === null || _selBlock$endCell === void 0 ? void 0 : _selBlock$endCell.rowInx);
      var maxRow = Math.max((_selBlock$startCell2 = selBlock.startCell) === null || _selBlock$startCell2 === void 0 ? void 0 : _selBlock$startCell2.rowInx, (_selBlock$endCell2 = selBlock.endCell) === null || _selBlock$endCell2 === void 0 ? void 0 : _selBlock$endCell2.rowInx);
      var minCol = Math.min((_selBlock$startCell3 = selBlock.startCell) === null || _selBlock$startCell3 === void 0 ? void 0 : _selBlock$startCell3.colInx, (_selBlock$endCell3 = selBlock.endCell) === null || _selBlock$endCell3 === void 0 ? void 0 : _selBlock$endCell3.colInx);
      var maxCol = Math.max((_selBlock$startCell4 = selBlock.startCell) === null || _selBlock$startCell4 === void 0 ? void 0 : _selBlock$startCell4.colInx, (_selBlock$endCell4 = selBlock.endCell) === null || _selBlock$endCell4 === void 0 ? void 0 : _selBlock$endCell4.colInx);

      // 座標が範囲内にあるかどうかをチェック
      return rowIndex >= minRow && rowIndex <= maxRow && colIndex >= minCol && colIndex <= maxCol;
    } else {
      return false;
    }
  };

  //コンテンツ位置設定
  var updateAlignment = (index, align, derection) => {
    var alignBlock = _objectSpread2(_objectSpread2({}, blockNames[index]), {}, {
      [derection]: align
    });
    var setAlignBlock = [...blockNames.slice(0, index), alignBlock, ...blockNames.slice(index + 1)];
    setBlockNames(setAlignBlock);
  };

  //選択したインナーブロック
  var [selBlock, setSelBlock] = useState(null);

  //インナーブロックを取得
  var parentBlocks = useSelect(select => {
    var innerBlocks = select("core/block-editor").getBlocks(clientId);
    //インナーブロック入れ替えの際は既に登録したブロックの位置情報があれば、それを付加する。
    var new_block_names = innerBlocks.map((block, index) => gridElms.length > index ? {
      value: block.clientId,
      label: block.name,
      startCell: gridElms[index].startCell,
      endCell: gridElms[index].endCell,
      latAlign: gridElms[index].latAlign,
      vertAlign: gridElms[index].vertAlign
    } : {
      value: block.clientId,
      label: block.name
    });
    return new_block_names;
  }, [clientId]);
  var [blockNames, setBlockNames] = useState(parentBlocks);

  //グリッド配置のクリア
  var clear_placement = () => {
    //ブロックの配置情報削除
    var clear_block = blockNames.map(block => ({
      value: block.value,
      label: block.label
    }));
    setBlockNames(clear_block);
  };

  //単位配列の初期化
  var initRowUnitArray = initializeUnitArray(rowUnit, rowCount);
  var [unitRowArray, setUnitRowArray] = useState(initRowUnitArray);
  var initColUnitArray = initializeUnitArray(colUnit, colCount);
  var [unitColArray, setUnitColArray] = useState(initColUnitArray);

  //親ブロックへの書き戻し
  useEffect(() => {
    var gridStyle = _objectSpread2(_objectSpread2({}, attributes), {}, {
      gridElms: blockNames,
      rowNum: rowCount,
      colNum: colCount,
      rowUnit: unitRowArray,
      colUnit: unitColArray
    });
    _onChange(gridStyle);
  }, [blockNames, unitRowArray, unitColArray]);

  //行と列の数を変えた場合は位置情報を削除・単位の再編成
  useEffect(() => {
    if (!firstFlgRef.current) {
      //マウント時は実行しない
      //ブロックの位置情報クリア
      clear_placement();
      //単位情報の再編成
      var newRowUnitArray = initializeUnitArray(rowUnit, rowCount);
      setUnitRowArray(newRowUnitArray);
      var newColUnitArray = initializeUnitArray(colUnit, colCount);
      setUnitColArray(newColUnitArray);
    } else {
      firstFlgRef.current = false;
    }
  }, [rowCount, colCount]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PanelRow, {
    className: "distance_row"
  }, /*#__PURE__*/React.createElement(__experimentalNumberControl, {
    onChange: newValue => {
      var input_val = typeof newValue === "number" ? newValue : Number(newValue);
      setRowCount(input_val);
    },
    label: __("Number of Row ", "block-collections"),
    value: rowCount,
    min: 2
  }), /*#__PURE__*/React.createElement(__experimentalNumberControl, {
    onChange: newValue => {
      var input_val = typeof newValue === "number" ? newValue : Number(newValue);
      setColCount(input_val);
    },
    label: __("Number of Colum", "block-collections"),
    value: colCount
  })), /*#__PURE__*/React.createElement(PanelRow, {
    className: "distance_row"
  }, /*#__PURE__*/React.createElement(__experimentalUnitControl, {
    onChange: newValue => {
      newValue = newValue != "" ? newValue : "0px";
      var newStyle = _objectSpread2(_objectSpread2({}, attributes), {}, {
        rowGap: newValue
      });
      _onChange(newStyle);
    },
    label: __("Row Gap", "block-collections"),
    value: rowGap,
    units: units
  }), /*#__PURE__*/React.createElement(__experimentalUnitControl, {
    onChange: newValue => {
      newValue = newValue != "" ? newValue : "0px";
      var newStyle = _objectSpread2(_objectSpread2({}, attributes), {}, {
        colGap: newValue
      });
      _onChange(newStyle);
    },
    label: __("Colum Gap", "block-collections"),
    value: colGap,
    units: units
  })), /*#__PURE__*/React.createElement(PanelRow, {
    className: "distance_row"
  }, /*#__PURE__*/React.createElement("p", null, __("Element placement", "block-collections")), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: clear_placement
  }, __("Clear", "block-collections"))), /*#__PURE__*/React.createElement(PanelRow, {
    className: "grid_table"
  }, /*#__PURE__*/React.createElement("table", null, renderRows())), /*#__PURE__*/React.createElement(ComboboxControl, {
    label: __("InnerBlock Name", "block-collections"),
    options: blockNames,
    value: selBlock ? selBlock.value : null,
    onChange: sel_id => {
      var matchedBlock = blockNames.find(block => block.value === sel_id);
      setSelBlock(matchedBlock);
    }
  }));
};

export { GridControls as default };
//# sourceMappingURL=GridControls.js.map
