import React, {Component} from "react";

class Tile extends Component {
    render() {
      const tileStyle = {
        backgroundImage: 'url("/tiles/tile-' + this.props.value + '.png")',
        backgroundSize: "cover"
      };
      return (
        <button 
          className={"tile tile-" + this.props.value}
          onClick={this.props.onClick} style={tileStyle}>
        </button>
      );    
    }
  }

export default Tile;