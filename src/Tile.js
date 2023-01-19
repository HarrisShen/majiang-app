import React, { useState } from "react";

function Tile(props) {
  const [isFocused, setIsFocused] = useState(false);

  const tileStyle = {
    backgroundImage: 'url("/tiles/tile-' + props.value + '.png")',
    backgroundSize: "cover"
  };

  let classStr = 'tile';
  if(props.isLastDrawn) classStr += ' tile-last-drawn';
  if(props.isActive && isFocused) classStr += ' tile-focused';  

  return (
    <button 
      className={classStr} style={tileStyle}
      onClick={props.isActive ? () => {setIsFocused(false); props.onClick()} : undefined}
      onMouseEnter={props.isActive ? () => setIsFocused(true) : undefined}
      onMouseLeave={props.isActive ? () => setIsFocused(false) : undefined}
    >
    </button>
  );
}

export default Tile;