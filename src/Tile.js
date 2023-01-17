import React, { useState } from "react";

function Tile(props) {
  const [isFocused, setIsFocused] = useState(false);
  
  const tileStyle = {
    backgroundImage: 'url("/tiles/tile-' + props.value + '.png")',
    backgroundSize: "cover"
  };
  let classStr = "tile tile-" + props.value;
  if(props.additionalClass) classStr += ' ' + props.additionalClass;
  if(props.isActive && isFocused) classStr += ' tile-focused';

  return (
    <button 
      className={classStr}
      onClick={props.onClick} style={tileStyle}
      onMouseEnter={props.isActive ? () => setIsFocused(true) : undefined}
      onMouseLeave={props.isActive ? () => setIsFocused(false) : undefined}
    >
    </button>
  );
}

export default Tile;