import React, {Component} from "react";
import Tile from "./Tile";

class Player extends Component {  
    renderHand(i) {
      const activeHand = this.props.active && noAction(this.props.action);
      return (
        <Tile 
          value={this.props.hand[i]} 
          onClick={activeHand ? (() => this.props.hand_onclick(i)) : undefined}
        />
      );
    }
    
    renderShow(i) {
      return (
        <Tile value={this.props.show[i]} />
      );
    }

    renderWaste(i) {
      return (
        <Tile value={this.props.waste[i]} />
      );
    }
    
    render() {
      let infoStr;
      if(this.props.winner) {
        infoStr = "I win!!!";
      } else if(this.props.active) {
        infoStr = "<=";
      }

      const handTiles = [];
      for(let i = 0; i < this.props.hand.length; i++) {
        handTiles.push(this.renderHand(i));
      }
      const showTiles = [];
      for(let i = 0; i < this.props.show.length; i++) {
        showTiles.push(this.renderShow(i));
      }
      const wasteTiles = [];
      for(let i = 0; i < this.props.waste.length; i++) {
        wasteTiles.push(this.renderWaste(i));
      }
      const ctrlButtons = [];
      if(this.props.action) {
        if(this.props.action["pong"]) {
          ctrlButtons.push(
            <button className="pong-btn" onClick={this.props.pong_onclick}>Pong</button>,
            <button className="cancel-btn" onClick={this.props.cancel_onclick}>Cancel</button>
          );
        } else if(this.props.action["kong"]) {
          ctrlButtons.push(
            <button className="kong-btn" onClick={this.props.kong_onclick}>Kong</button>,
            <button className="cancel-btn" onClick={this.props.cancel_onclick}>Cancel</button>
          );
        } else if(this.props.action["hu"]) {
          ctrlButtons.push(
            <button className="hu-btn" onClick={this.props.hu_onclick}>Win!</button>,
            <button className="cancel-btn" onClick={this.props.cancel_onclick}>Cancel</button>
          )
        }
      }
      return (
        <div>
          <div className="info-row">
            <span>{this.props.name} {infoStr}</span>
            {ctrlButtons}
          </div>
          <div className="hand-row">
            {handTiles}
          </div>
          <div className="display-row">
            {showTiles}
          </div>
          <div className="played-row">
            {wasteTiles}
          </div>
        </div>
      );
    }
  }

const noAction = (action) => Object.values(action).every((x) => !x);

export default Player;