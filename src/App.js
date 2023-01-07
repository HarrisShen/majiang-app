import React from "react";
import Table from "./Table";
import {getTiles} from "./gameUtils";
import "./App.css";

function App() {
  return (
    <div>
      <Table tiles={getTiles()}/>
    </div>
  )
}

export default App;
