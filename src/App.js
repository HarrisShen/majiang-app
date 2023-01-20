import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Table from "./Table";
import "./App.css";

const socket = io();

function App() {
  const [tableID, setTableID] = useState('');

  useEffect(() => {
    socket.on('connect', () => {
      console.log('app socket connected');
    });

    return () => {
      socket.off('connect');
    };
  }, []);

  function createTable() {
    socket.emit('table:create', (data) => {
      setTableID(data.tableID);
    });
  }

  function leaveTable() {
    socket.emit('table:leave', (data) => {
      setTableID(data.tableID);
    });
  }

  let tableCtrl;
  if(tableID) {
    tableCtrl = (<button onClick={leaveTable}>Leave Table</button>);
  } else {
    tableCtrl = [
      <button onClick={createTable}>Create Table</button>,
      <button>Join Table</button>        
    ];
  }
  return (
    <div>
      <h1>Play Majiang Together by R.S.</h1>
      <div>
        {tableCtrl}
      </div>
      {tableID && <Table tableID={tableID}/>}
    </div>
  )
}

export default App;
