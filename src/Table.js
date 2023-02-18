import React from "react";
import Player from "./Player";
import "./Table.css";

const directions = ['S', 'E', 'N', 'W'];

function Table(props) {

  const socket = props.socket;

  function handleReady() {
    socket.emit('game:ready');
  }

  function handleAction(type, pid, tid = null) {
    if(type === 'discard') {
      const playerHand = props.gameState.players[pid].hand.slice();
      console.log('discard:' + pid + ',' + playerHand[tid]);
    } else console.log(type + ': ' + pid);
    socket.emit('game:action', type, pid, tid);
  }

  const players = props.players.slice();
  const playerReady = props.playerReady.slice();
  const gameState = props.gameState;
  const actions = gameState.playerActions.slice();
  const offset = players.indexOf(props.self);
  const playerList = [];
  for (let i = 0; i < players.length; i++) {
    let idx = (i + offset) % players.length;
    let isCurrPlayer = idx === gameState.currPlayer;
    let control = i === 0;
    if (props.gameStatus === 1) {
      control &&= isCurrPlayer;
    } else if (props.gameStatus === 2) {
      control &&= !(Object.values(actions[idx]).every(x => !x));
    }
    let playerProps = {
      id: players[idx],
      status: props.gameStatus,
      ready: playerReady[idx],
      hand: gameState.players[idx].hand,
      show: gameState.players[idx].show,
      waste: gameState.players[idx].waste,
      isCurrPlayer: isCurrPlayer,
      control: control,
      action: actions[idx],
      afterDraw: gameState.lastAction === 'draw',
      direction: directions[i]
    };
    // add more props if player needs to act
    if (control) {
      if (props.gameStatus === 0) {
        Object.assign(playerProps, {
          readyOnClick: handleReady
        });
      } else {
        Object.assign(playerProps, {
          handOnClick: ((j) => handleAction('discard', idx, j)),
          pongOnClick: (() => handleAction('pong', idx)),
          kongOnClick: (() => handleAction('kong', idx)),
          chowOnClick: ((j) => handleAction('chow', idx, j)),
          huOnClick: (() => handleAction('hu', idx)),
          cancelOnClick: (() => handleAction('cancel', idx))
        });
      }
    }
    playerList.push(<Player {...playerProps} />)
  }

  return (
    <div>
      <p>Tiles left: {gameState.tiles}</p>
      <div className="mahjong-board">
        {playerList}
      </div>
    </div>
  ); 
}

export default Table;
