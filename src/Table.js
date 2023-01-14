import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Player from "./Player";
import Editor from "./Editor";
import { postData, putData } from "./request";

const socket = io();

function Table() {
  const [self, setSelf] = useState('Player 1');
  const [players, setPlayers] = useState(["Player 1", "Player 2", "Player 3", "Player 4"]);
  const [gameState, setGameState] = useState({
    tiles: [],
    playerHands: [[], [], [], []],
    playerWaste: [[], [], [], []],
    playerShows: [[], [], [], []],
    currPlayer: [0],
    playerActions: [{}, {}, {}, {}],
    lastAction: '',
    status: 0,
    winner: [],
  });
  /* states for developing ONLY */
  const [godMode, setGodMode] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('server game connected');
    });

    socket.on('update', (newState) => {
      console.log(newState);
      setGameState(newState);
    });

    return () => {
      socket.off('connect');
      socket.off('update');
    };
  }, []);

  function clear() {
    setGameState({
      tiles: [],
      playerHands: [[], [], [], []],
      playerWaste: [[], [], [], []],
      playerShows: [[], [], [], []],
      currPlayer: [0],
      playerActions: [{}, {}, {}, {}],
      lastAction: '',
      status: 0,
      winner: [],
    });
  }
  
  function handleStart() {
    fetch('/game?status=init')
      .then(res => res.json())
      .then(res => setGameState(res));
  }

  function handleDiscard(pid, tid) {
    const playerHands = gameState.playerHands.slice();
    const data = {
      action: 'discard',
      pid: pid,
      tid: tid,
      discardTile: playerHands[pid][tid],
    };
    console.log('discard:' + pid + ',' + tid);
    putData('/game', data)
      .then(res => setGameState(res));
  }

  function handleAction(type, pid) {
    const data = {
      action: type,
      pid: pid,
    };
    console.log(type + ': ' + pid);
    putData('/game', data)
      .then(res => setGameState(res));
  }

  function toggleGodMode() {
    setGodMode(!godMode);
  }

  function handleSubmit(data) {
    postData('/game', data)
      .then(res => setGameState(res));
  }

  const currPlayer = gameState.currPlayer;
  const active = [false, false, false, false];
  currPlayer.forEach(i => {
    active[i] = true;
  });
  const winner = gameState['winner'].slice();
  const isWinner = [false, false, false, false];
  winner.forEach(i => (isWinner[i] = true));
  const actions = gameState.playerActions.slice();
  const playerList = [];
  for(let i = 0; i < 4; i++) {
    const playerProps = {
      name: players[i],
      hand: gameState.playerHands[i],
      handOnclick: (j) => (handleDiscard(i, j)),
      show: gameState.playerShows[i],
      waste: gameState.playerWaste[i],
      active: active[i],
      winner: isWinner[i],
      status: gameState.status,
      lastAction: gameState.lastAction,
    };
    if(i === 0 && Object.values(actions[0]).some(v => v)) {
      playerProps['action'] = actions[i];
      let haveAction = false;
      if(actions[i]['pong']){
        playerProps["pongOnclick"] = () => handleAction('pong', i);
        haveAction = true;
      } else if(actions[i]['kong']) {
        playerProps["kongOnclick"] = () => handleAction('kong', i);
        haveAction = true;
      } 
      if(actions[i]['hu']){
        playerProps["huOnclick"] = () => handleAction('win', i);
        haveAction = true;
      }
      if(haveAction) {
        playerProps["cancelOnclick"] = () => handleAction('cancel', i);
      }
    }
    playerList.push((<Player { ...playerProps }/>));
  }
  const editorBox = (
    <div>
      <Editor players={players} handleSubmit={handleSubmit}/>
    </div>
  );
  return (
    <div>
      <h1>My Majiang Table</h1>
      <button onClick={handleStart}>Start</button>
      <button onClick={clear}>Clear</button>
      <button onClick={toggleGodMode}>God Mode: {godMode? 'ON' : 'OFF'}</button>
      <p>Tiles left: {gameState.tiles.length}</p>
      <div>
        {playerList}
      </div>
      {godMode && editorBox}
    </div>
  );
}

export default Table;

// playerHands: [[11,11,13,14,15], [11,12,13,14], [14,15,15,15], [23,23,23,23]],