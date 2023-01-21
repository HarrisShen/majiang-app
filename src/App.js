import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Table from "./Table";
import "./App.css";

const socket = io();

function App() {
  const [tableID, setTableID] = useState('');
  const [inputTableID, setInputTableID] = useState('');

  useEffect(() => {
    socket.on('connect', () => {
      console.log('app socket connected');
    });

    return () => {
      socket.off('connect');
    };
  }, []);

  function handleCreate() {
    socket.emit('table:create', (data) => {
      setTableID(data.tableID);
    });
  }

  function handleLeave() {
    socket.emit('table:leave', (data) => {
      setTableID(data.tableID);
    });
  }

  function handleJoin(event, tableID) {
    event.preventDefault();
    socket.emit('table:join', tableID, (data) => {
      if (data.error) {
        console.log(data.error);
        alert(data.error);
      } else {
        setTableID(tableID);
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
      {tableID && <Table tableID={tableID}/>}
    </div>
  )
}

export default App;
