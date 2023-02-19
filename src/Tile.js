import React, { useState } from "react";

function Tile(props) {
  const [isFocused, setIsFocused] = useState(false);

  const tileStyle = {
    backgroundImage: 'url("/tiles/tile-' + props.value + '.png")',
    backgroundSize: "cover"
  };

  let classStr = 'tile';
  if(props.isLastDrawn) classStr += ' tile-last-drawn';
  if(props.active && isFocused) classStr += ' tile-focused'; 
  if(props.forbidden) classStr += ' tile-forbidden';

  return (
    <button 
      className={classStr} style={tileStyle}
      onClick={props.active ? () => {setIsFocused(false); props.onClick()} : undefined}
      onMouseEnter={props.active ? () => setIsFocused(true) : undefined}
      onMouseLeave={props.active ? () => setIsFocused(false) : undefined}
    >
    </button>
  );
}

export default Tile;