import React, {Component} from "react";

class Tile extends Component {
    render() {
      const tileStyle = {
        backgroundImage: 'url("/tiles/tile-' + this.props.value + '.png")',
        backgroundSize: "cover"
      };
      let classStr = "tile tile-" + this.props.value;
      if(this.props.additionalClass) classStr += ' ' + this.props.additionalClass;
      return (
        <button 
          className={classStr}
          onClick={this.props.onClick} style={tileStyle}>
        </button>
      );    
    }
  }

export default Tile;