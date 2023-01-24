import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Table from "./Table";
import "./App.css";

const socket = io();

function App() {
  const [tableID, setTableID] = useState('');
  const [players, setPlayers] = useState([]);
  const [self, setSelf] = useState('');
  const [inputTableID, setInputTableID] = useState('');
  const [gameStatus, setGameStatus] = useState(0);
  const [gameState, setGameState] = useState({});

  useEffect(() => {
    socket.on('connect', () => {
      console.log('app socket connected');
    });

    socket.on('player:init', (data) => {
      setSelf(data.self);
    });
    
    socket.on('table:update', (data) => {
      setPlayers(data.players);
    });

    socket.on('game:update', (data) => {
      console.log('game:' + data.gameID);
      console.log(data.gameState);
      setGameState(data.gameState);
    });

    return () => {
      socket.off('connect');
      socket.off('table:update');
      socket.off('game:update');
    };
  }, []);

  function handleCreate() {
    socket.emit('table:create', (data) => {
      setTableID(data.tableID);
      setPlayers(data.players);
    });
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
        <button onClick={handleCreate}>Create a new Table</button><br/>
        <p>or</p>
        <form onSubmit={(e) => handleJoin(e, inputTableID)}>
          <input type='text' name="table-id" onChange={handleChange} />
          <input type='submit' value='Join a Table'/>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h1>Play Majiang Together by R.S.</h1>
      {tableCtrlPanel}
      {tableID && (
        <Table 
          tableID={tableID} players={players} self={self}  
          gameStatus={gameStatus} gameState={gameState} socket={socket}
        />
      )}
    </div>
  );
}

export default App;
