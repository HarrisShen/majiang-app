import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Table from "./Table";
import "./App.css";

const socket = io();

const initGameState = {
  tiles: 0,
  playerHands: [[], [], [], []],
  playerWaste: [[], [], [], []],
  playerShows: [[], [], [], []],
  currPlayer: 0,
  playerActions: [],
  lastAction: '',
  winner: [],
};

function App() {
  const [tableID, setTableID] = useState('');
  const [players, setPlayers] = useState([]);
  const [playerReady, setPlayerReady] = useState([]);
  const [self, setSelf] = useState('');
  const [inputTableID, setInputTableID] = useState('');
  const [gameStatus, setGameStatus] = useState(0);
  const [gameState, setGameState] = useState(initGameState);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('app socket connected');
    });

    socket.on('player:init', (data) => {
      setSelf(data.self);
    });
    
    socket.on('table:update', (data) => {
      if (data.tableID) setTableID(data.tableID);
      if (data.players) setPlayers(data.players);
      if (data.playerReady) setPlayerReady(data.playerReady);
      if (data.source !== 'ready') {
        setGameStatus(0);
        setGameState(initGameState);
      }
    });

    socket.on('game:update', (data) => {
      console.log('game:' + data.gameID);
      console.log(data.gameState);
      setGameState(data.gameState);
      setGameStatus(data.gameState.status);
      if (data.start) {
        socket.emit('game:renew-id', (data) => {
          if (data.status === 'OK') console.log('session gameID updated');
        });
      }
    });

    return () => {
      socket.off('connect');
      socket.off('table:update');
      socket.off('game:update');
    };
  }, []);

  function handleCreate(tableSize) {
    socket.emit('table:create', tableSize);
  }

  function handleLeave() {
    socket.emit('table:leave', (data) => {
      setTableID(data.tableID);
    });
  }

  function handleJoin(event, tableID) {
    event.preventDefault();
    if(!tableID) return;
    socket.emit('table:join', tableID, (data) => {
      if (data.error) {
        console.log(data.error);
        alert(data.error);
      } else {
        setTableID(tableID);
        setPlayers(data.players);
        setPlayerReady(data.playerReady);
        setInputTableID(''); // clear input - in case for leaving table and back to join page
      }
    })
  }

  function handleChange(event) {
    setInputTableID(event.target.value);
  }

  let tableCtrlPanel;
  if(tableID) {
    tableCtrlPanel = (
      <div>
        <h3>Current table: {tableID}</h3>
        <button onClick={handleLeave}>Leave Table</button>
      </div>
    );
  } else {
    tableCtrlPanel = (
      <div>
        <p><strong>Create a table</strong></p>
        <button onClick={() => handleCreate(1)}>Single-player</button><br/>
        <button onClick={() => handleCreate(4)}>Multiplayer</button><br/>
        <p><strong>Join a table</strong></p>
        <form onSubmit={(e) => handleJoin(e, inputTableID)}>
          <input type='text' name="table-id" onChange={handleChange} />
          <input type='submit' value='Join'/>
        </form>
      </div>
    );
  }

  const tableProps = {
    tableID: tableID,
    players: players,
    self: self,
    playerReady: playerReady,
    gameStatus: gameStatus,
    gameState: gameState,
    socket: socket,
  };

  return (
    <div>
      <h1>Play Majiang Together by R.S.</h1>
      {tableCtrlPanel}
      {tableID && <Table {...tableProps} />}
    </div>
  );
}

export default App;
