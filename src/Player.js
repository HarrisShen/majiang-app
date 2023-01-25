import React, { useState } from "react";
import Tile from "./Tile";

function Player(props) {
  // const [ready, setReady] = useState(false);

  // const socket = props.socket;

  function renderHand(i) {
    // const isActiveHand = props.control && props.active && props.status === 1;
    // const isLastDrawn = i === props.hand.length - 1 && props.hand.length % 3 === 2 && props.lastAction === 'draw';
        // isActive={isActiveHand}
        // isLastDrawn={isLastDrawn}    
    return (
      <Tile 
        value={props.hand[i]}
        active={props.control}
        onClick={props.handOnclick ? () => props.handOnclick(i) : undefined}
      />
    );
  }
    
  function renderShow(i) {
    return (
      <Tile value={props.show[i]} />
    );
  }

  function renderWaste(i) {
    return (
      <Tile value={props.waste[i]} />
    );
  }
    
  let infoStr = '';
  if (props.status === 0) {
    if (props.ready) infoStr += '\u2713';
    if (props.winner) infoStr += " I win!!!";
  } else if(props.isCurrPlayer) {
    infoStr = "<=";
  }

  const handTiles = [];
  if (props.hand) {
    for(let i = 0; i < props.hand.length; i++) {
      handTiles.push(renderHand(i));
    }    
  }
  const showTiles = [];
  if (props.show) {
    for(let i = 0; i < props.show.length; i++) {
      showTiles.push(renderShow(i));
    }    
  }
  const wasteTiles = [];
  if (props.waste) {
    for (let i = 0; i < props.waste.length; i++) {
      wasteTiles.push(renderWaste(i));
    }    
  }
  const ctrlButtons = [];
  if (props.status === 0) {
    if (props.control) {
      ctrlButtons.push(
        <button className="ready-btn" onClick={props.readyOnClick}>{
          props.ready ? "Cancel" : "Ready"
        }</button>
      );
    }
  } else if (props.status === 2) {
    if(props.action["pong"]) {
      ctrlButtons.push(
        <button className="pong-btn" onClick={props.pongOnclick}>Pong</button>
      );
    } 
    if(props.action["kong"]) {
      ctrlButtons.push(
        <button className="kong-btn" onClick={props.kongOnclick}>Kong</button>
      );
    } 
    if(props.action["hu"]) {
      ctrlButtons.push(
        <button className="hu-btn" onClick={props.huOnclick}>Win!</button>
      );
    }
    if(ctrlButtons.length > 0){
      ctrlButtons.push(
        <button className="cancel-btn" onClick={props.cancelOnclick}>Cancel</button>          
      );      
    }
  }
  return (
    <div>
      <div className="info-row">
        <span>{props.id} {infoStr}</span>
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

export default Player;
