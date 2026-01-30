import { objectSpread2 as _objectSpread2 } from './_virtual/_rollupPluginBabelHelpers.js';
import { __ } from '@wordpress/i18n';
import { PanelBody, PanelRow, __experimentalUnitControl, Button } from '@wordpress/components';
import { useRef, useEffect } from '@wordpress/element';

var useDraggingMove = (isMovable, blockRef, position, onPositionChange) => {
  var elmposition = useRef({
    x: 0,
    y: 0
  });
  var isDragging = useRef(false);
  var mousePosition = useRef({
    x: 0,
    y: 0
  });
  useEffect(() => {
    var element = blockRef.current;
    if (!isMovable) {
      if (element) {
        element.classList.remove("itmar_isDraggable"); //移動カーソル表示クラス削除
      }
      return; // 移動許可がある場合のみ、後続のロジックを実行
    }
    //positionの変化に合わせて現在位置を変更
    var pos_value_x = position.x.match(/(-?\d+)([%a-zA-Z]+)/);
    var pos_value_y = position.y.match(/(-?\d+)([%a-zA-Z]+)/);
    elmposition.current = {
      x: parseInt(pos_value_x[1]),
      y: parseInt(pos_value_y[1])
    };

    //イベントハンドラ
    var handleMouseDown = event => {
      // 移動カーソル表示クラス名を追加します。
      element.classList.add("itmar_isDraggable");
      //ドラッグの開始フラグオン
      isDragging.current = true;
      //ドラッグ開始の絶対位置
      mousePosition.current = {
        x: event.clientX,
        y: event.clientY
      };
    };
    var handleMouseMove = event => {
      if (!isDragging.current) return; //ドラッグ中でなければ処理を中止
      var dx = event.clientX - mousePosition.current.x;
      var dy = event.clientY - mousePosition.current.y;
      //ドラッグ後の位置を保存
      var newPosition = {
        x: elmposition.current.x + dx,
        y: elmposition.current.y + dy
      };
      elmposition.current = newPosition;
      mousePosition.current = {
        x: event.clientX,
        y: event.clientY
      }; //マウス位置の保存
      //ドラッグによるブロックの一時的移動
      element.style.transform = "translate(".concat(elmposition.current.x, "px, ").concat(elmposition.current.y, "px)");
    };
    var handleMouseUp = () => {
      isDragging.current = false;
      element.style.transform = null;
      //呼出しもとに要素の位置を返す
      onPositionChange({
        x: "".concat(elmposition.current.x, "px"),
        y: "".concat(elmposition.current.y, "px")
      });
    };
    var handleMouseLeave = () => {
      isDragging.current = false;
    };
    if (element) {
      // クラス名を追加します。
      element.classList.add("itmar_isDraggable");
    }
    // イベントハンドラを追加します。
    element.addEventListener("mousedown", handleMouseDown);
    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseup", handleMouseUp);
    element.addEventListener("mouseleave", handleMouseLeave);

    // イベントリスナーを削除するクリーンアップ関数を返します。
    return () => {
      element.removeEventListener("mousedown", handleMouseDown);
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseup", handleMouseUp);
      element.removeEventListener("mouseleave", handleMouseLeave);
      element.style.transform = null;
    };
  }, [isMovable, blockRef, position, onPositionChange]); // 依存配列に isMovable を含めます
};
function DraggableBox(props) {
  var position = props.attributes;

  //インスペクター内のコントロールからの移動操作
  var chagePosition = (value, cordinate) => {
    if (value) {
      var newPos = _objectSpread2(_objectSpread2({}, position), {}, {
        [cordinate]: value
      });
      props.onPositionChange(newPos);
    }
  };

  //リセット
  var resetPos = () => {
    var newPos = {
      x: "0px",
      y: "0px"
    };
    props.onPositionChange(newPos);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PanelBody, {
    title: __("Position Setting", "block-collections"),
    initialOpen: true
  }, /*#__PURE__*/React.createElement(PanelRow, {
    className: "distance_row"
  }, /*#__PURE__*/React.createElement(__experimentalUnitControl, {
    dragDirection: "e",
    onChange: value => chagePosition(value, "x"),
    label: __("Vertical", "block-collections"),
    value: (position === null || position === void 0 ? void 0 : position.x) || 0
  }), /*#__PURE__*/React.createElement(__experimentalUnitControl, {
    dragDirection: "e",
    onChange: value => chagePosition(value, "y"),
    label: __("Horizen", "block-collections"),
    value: (position === null || position === void 0 ? void 0 : position.y) || 0
  })), /*#__PURE__*/React.createElement(PanelRow, {
    className: "reset_row"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: () => resetPos()
  }, __("Reset", "block-collections")))));
}

export { DraggableBox as default, useDraggingMove };
//# sourceMappingURL=DraggableBox.js.map
