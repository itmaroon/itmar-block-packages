'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function ToggleElement(props) {
  var toggleOpen = () => {
    props.onToggle && props.onToggle(!props.openFlg);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "".concat(props.className, " ").concat(props.openFlg ? 'open' : ''),
    style: props.style,
    onClick: toggleOpen
  }, props.children);
}

exports.default = ToggleElement;
//# sourceMappingURL=ToggleElement.js.map
