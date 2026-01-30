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

export { ToggleElement as default };
//# sourceMappingURL=ToggleElement.js.map
