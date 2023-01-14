import React from "react";

function Tile(props) {
    const tileStyle = {
      backgroundImage: 'url("/tiles/tile-' + props.value + '.png")',
      backgroundSize: "cover"
    };
    let classStr = "tile tile-" + props.value;
    if(props.additionalClass) classStr += ' ' + props.additionalClass;
    return (
      <button 
        className={classStr}
        onClick={props.onClick} style={tileStyle}>
      </button>
    );
  }

export default Tile;