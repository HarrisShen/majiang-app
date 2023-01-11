import React, {Component} from "react";
import Player from "./Player";
import Editor from "./Editor";
import { postData, putData } from "./request";

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tiles: [],
      self: 'Player 1',
      players: ["Player 1", "Player 2", "Player 3", "Player 4"],
      playerHands: [[], [], [], []],
      playerWaste: [[], [], [], []],
      playerShows: [[], [], [], []],
      currPlayer: [0],
      playerActions: [],
      status: 0, // 0 - start/drawing, 1 - playing, 2 - deciding
      winner: [],

      /* states for developing ONLY */
      godMode: false,
    }

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  clear() {
    this.setState({
      tiles: [],
      players: ["Player 1", "Player 2", "Player 3", "Player 4"],
      playerHands: [[], [], [], []],
      playerWaste: [[], [], [], []],
      playerShows: [[], [], [], []],
      currPlayer: [0],
      playerActions: [],
      status: 0,
      winner: [],
    });
  }
  
  dealNext() {
    const tiles = this.state.tiles.slice();
    const playerHands = this.state.playerHands.slice();
    const currPlayer = this.state.currPlayer[0];
    if(playerHands[currPlayer].length === 14)
      return;
    playerHands[currPlayer].push(tiles.pop());
    playerHands[currPlayer] = playerHands[currPlayer].sort();
    this.setState({
      tiles: tiles,
      playerHands: playerHands,
    });
    if(playerHands[currPlayer].length < 14) {
      this.setState({
        currPlayer: [getNext(currPlayer)],
        last_player: currPlayer,
      });
    }
  }
  
  dealAll() {
    const tiles = this.state.tiles.slice();
    const playerHands = this.state.playerHands.slice();
    let currPlayer = this.state.currPlayer[0];
    while(playerHands[currPlayer].length < 14) {
      playerHands[currPlayer].push(tiles.pop());
      console.log(tiles.length);
      playerHands[currPlayer] = playerHands[currPlayer].sort();
      if(playerHands[currPlayer].length < 14){
        currPlayer = getNext(currPlayer);
      }
    }
    this.setState({
      tiles: tiles,
      playerHands: playerHands,
      currPlayer: [currPlayer],
      last_player: getPrev(currPlayer),
      curr_stage: 1,
    });
  }
  
  handleStart() {
    fetch('/game?status=init')
      .then(res => res.json())
      .then(res => this.setState(res));
  }

  handleDiscard(pid, tid) {
    const playerHands = this.state.playerHands.slice();
    const data = {
      action: 'discard',
      pid: pid,
      tid: tid,
      discardTile: playerHands[pid][tid],
    };
    console.log('discard:' + pid + ',' + tid);
    putData('/game', data)
      .then(res => this.setState(res));
  }

  handleAction(type, pid) {
    const data = {
      action: type,
      pid: pid,
    };
    console.log(type + ': ' + pid);
    putData('/game', data)
      .then(res => this.setState(res));
  }

  toggleGodMode() {
    this.setState({
      godMode: !this.state.godMode,
    });
  }

  handleSubmit(event, data) {
    postData('/game', data)
      .then(res => this.setState(res));
    event.preventDefault();
  }

  render() {
    const currPlayer = this.state.currPlayer;
    const active = [false, false, false, false];
    currPlayer.forEach(i => (active[i] = true));
    const winner = this.state.winner.slice();
    const isWinner = [false, false, false, false];
    winner.forEach(i => (isWinner[i] = true));
    const actions = this.state.playerActions.slice();
    const playerList = [];
    for(let i = 0; i < 4; i++) {
      const playerProps = {
        name: this.state.players[i],
        hand: this.state.playerHands[i],
        handOnclick: (j) => (this.handleDiscard(i, j)),
        show: this.state.playerShows[i],
        waste: this.state.playerWaste[i],
        active: active[i],
        winner: isWinner[i],
        status: this.state.status,
      };
      if(actions[i] && this.state.status === 2) {
        playerProps["action"] = actions[i];
        let haveAction = false;
        if(actions[i]["pong"]){
          playerProps["pongOnclick"] = () => this.handleAction('pong', i);
          haveAction = true;
        } else if(actions[i]["kong"]) {
          playerProps["kongOnclick"] = () => this.handleAction('kong', i);
          haveAction = true;
        } 
        if(actions[i]["hu"]){
          playerProps["huOnclick"] = () => this.handleAction('win', i);
          haveAction = true;
        }
        if(haveAction) {
          playerProps["cancelOnclick"] = () => this.handleAction('cancel', i);
        }
      }
      playerList.push((<Player {...playerProps}/>));
    }
    const editorBox = (
      <div>
        <Editor players={this.state.players} handleSubmit={this.handleSubmit}/>
      </div>
    );
    return (
      <div>
        <h1>My Majiang Table</h1>
        <button onClick={() => this.handleStart()}>Start</button>
        <button onClick={() => this.clear()}>Clear</button>
        <button onClick={() => this.toggleGodMode()}>God Mode: {this.state.godMode? 'ON' : 'OFF'}</button>
        <p>Tiles left: {this.state.tiles.length}</p>
        <div>
          {playerList}
        </div>
        {this.state.godMode && editorBox}
      </div>
    );    
  }
}

const getNext = (i) => (i + 1) % 4;

const getPrev = (i) => (i + 3) % 4;

export default Table;

// playerHands: [[11,11,13,14,15], [11,12,13,14], [14,15,15,15], [23,23,23,23]],