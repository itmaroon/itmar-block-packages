
export default function ToggleElement(props) {


  const toggleOpen = () => {
    props.onToggle && props.onToggle(!props.openFlg);
  };

  return (
    <div
      className={`${props.className} ${props.openFlg ? 'open' : ''}`}
      style={props.style}
      onClick={toggleOpen}
    >
      {props.children}
    </div>
  )
}