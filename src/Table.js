import React, {Component} from "react";
import Player from "./Player";
import {shuffleArray, havePong, haveKong, getKongTile, isHuPai} from "./gameUtils";

class Table extends Component {
    constructor(props) {
      super(props);
      const tiles = this.props.tiles.slice();
      shuffleArray(tiles);
      console.log(tiles);
      this.state = {
        tiles: tiles.slice(),
        players: ["Player 1", "Player 2", "Player 3", "Player 4"],
        player_hands: [[11,11,13,14,15], [11,12,13,14], [14,15,15,15], [23,23,23,23]],
        player_waste: [[], [], [], []],
        player_shows: [[], [], [], []],
        curr_player: [0],
        last_player: 3,
        curr_action: {pong: false, kong: false, chow: false, hu: false},
        curr_stage: 0, // 0 - start/drawing, 1 - playing, 2 - over
        is_winner: [false, false, false, false],
      }
    }
    
    clear() {
      const tiles = this.props.tiles.slice();
      shuffleArray(tiles);
      console.log(tiles);
      this.setState({
        tiles: tiles.slice(),
        players: ["Player 1", "Player 2", "Player 3", "Player 4"],
        player_hands: [[], [], [], []],
        player_waste: [[], [], [], []],
        player_shows: [[], [], [], []],
        curr_player: [0],
        last_player: 3,
        curr_action: {pong: false, kong: false, chow: false, hu: false},
        curr_stage: 0, // 0 - start/drawing, 1 - playing, 2 - over
        is_winner: [false, false, false, false],
      });
    }
    
    dealNext() {
      const tiles = this.state.tiles.slice();
      const player_hands = this.state.player_hands.slice();
      const curr_player = this.state.curr_player[0];
      if(player_hands[curr_player].length === 14)
        return;
      player_hands[curr_player].push(tiles.pop());
      player_hands[curr_player] = player_hands[curr_player].sort();
      this.setState({
        tiles: tiles,
        player_hands: player_hands,
      });
      if(player_hands[curr_player].length < 14) {
        this.setState({
          curr_player: [getNext(curr_player)],
          last_player: curr_player,
        });
      }
    }
    
    dealAll() {
      const tiles = this.state.tiles.slice();
      const player_hands = this.state.player_hands.slice();
      let curr_player = this.state.curr_player[0];
      while(player_hands[curr_player].length < 14) {
        player_hands[curr_player].push(tiles.pop());
        console.log(tiles.length);
        player_hands[curr_player] = player_hands[curr_player].sort();
        if(player_hands[curr_player].length < 14){
          curr_player = getNext(curr_player);
        }
      }
      this.setState({
        tiles: tiles,
        player_hands: player_hands,
        curr_player: [curr_player],
        last_player: getPrev(curr_player),
        curr_stage: 1,
      });
    }
    
    handleClick(pid, tid) {
      const curr_player = this.state.curr_player[0];
      const tiles = this.state.tiles.slice();
      const player_hands = this.state.player_hands.slice();
      const player_waste = this.state.player_waste.slice();
      const curr_action = initAction();
  
      const discard_tile = player_hands[pid][tid];
      player_hands[pid].splice(tid, 1);
      player_waste[pid].push(discard_tile);
  
      for(let i = 0; i < 4; i++) {
        if(i === pid) continue;
        if(isHuPai(player_hands[i].concat([discard_tile]))) {
          curr_action["hu"] = true;
          this.setState({
            tiles: tiles,
            player_hands: player_hands,
            player_waste: player_waste,
            curr_player: [i],
            last_player: curr_player,
            curr_action: curr_action,
          });
          return;
        }
        if(haveKong(player_hands[i], discard_tile)) {
          curr_action["kong"] = true;
          this.setState({
            tiles: tiles,
            player_hands: player_hands,
            player_waste: player_waste,
            curr_player: [i],
            last_player: curr_player,
            curr_action: curr_action,
          });
          return;
        }
        if(havePong(player_hands[i], discard_tile)) {
          curr_action["pong"] = true;
          this.setState({
            tiles: tiles,
            player_hands: player_hands,
            player_waste: player_waste,
            curr_player: [i],
            last_player: curr_player,
            curr_action: curr_action,
          });
          return;
        }
      }
  
      const next_player = getNext(curr_player);
      player_hands[next_player].push(tiles.pop());
      player_hands[next_player] = player_hands[next_player].sort();
      this.setState({
        tiles: tiles,
        player_hands: player_hands,
        player_waste: player_waste,
        curr_player: [next_player],
        last_player: curr_player,
      });
    }
  
    handlePong(curr_pid, last_pid) {
      const player_hands = this.state.player_hands.slice();
      const player_waste = this.state.player_waste.slice();
      const player_shows = this.state.player_shows.slice();
      const pong_tile = player_waste[last_pid].pop();
  
      player_hands[curr_pid] = player_hands[curr_pid].filter(
        (tile) => tile !== pong_tile
      );
  
      player_shows[curr_pid] = player_shows[curr_pid].concat(Array(3).fill(pong_tile));
  
      this.setState({
        player_hands: player_hands,
        player_waste: player_waste,
        player_shows: player_shows,
        curr_action: initAction(),
      })
    }

    handleKong(curr_pid, last_pid) {
      // currently it is assumed that there is at most one kong at a hand
      const tiles = this.state.tiles.slice();
      const player_hands = this.state.player_hands.slice();
      const player_waste = this.state.player_waste.slice();
      const player_shows = this.state.player_shows.slice();

      let kong_tile;
      if(curr_pid !== last_pid) {
        kong_tile = player_waste[last_pid].pop();
      } else {
        kong_tile = getKongTile(player_hands[curr_pid])[0];
      }

      player_hands[curr_pid] = player_hands[curr_pid].filter(
        (tile) => tile !== kong_tile
      );
      player_hands[curr_pid].push(tiles.pop());

      player_shows[curr_pid] = player_shows[curr_pid].concat(Array(4).fill(kong_tile));

      this.setState({
        player_hands: player_hands,
        player_waste: player_waste,
        player_shows: player_shows,
        curr_action: initAction(),
      })
    }

    handleHu(curr_pid, last_pid) {
      const isWinner = this.state.is_winner;
      isWinner[curr_pid] = true;
      this.setState({
        curr_stage: 2,
        is_winner: isWinner,
      });

      const player_hands = this.state.player_hands;
      if(player_hands[curr_pid].length % 3 !== 2) {
        const player_waste = this.state.player_waste;
        const last_tile = player_waste[last_pid].pop();
        player_hands[curr_pid].push(last_tile);
        this.setState({
          player_hands: player_hands,
          player_waste: player_waste,
        });
      }
    }
    
    handleCancel(last_pid, type) {
      const curr_action = initAction();
      curr_action[type] = null;
      const curr_player = getNext(last_pid);
      const tiles = this.state.tiles;
      const player_hands = this.state.player_hands.slice();
      if(player_hands[curr_player].length % 3 !== 2) {
        player_hands[curr_player].push(tiles.pop());
      }
      this.setState({
        tiles: tiles,
        player_hands: player_hands,
        curr_action: curr_action,
        curr_player: [curr_player],
      })
    }

    render() {
      const player_hands = this.state.player_hands;
      const curr_player = this.state.curr_player;
      const active = [false, false, false, false];
      const winner = this.state.is_winner;
      curr_player.forEach((i) => {
        active[i] = !winner[i];
      });
      const action = this.state.curr_action;
      if(player_hands[curr_player].length % 3 === 2) {
        if(action["hu"] !== null) {
          action["hu"] = isHuPai(player_hands[curr_player[0]]);
        } 
        if(action["kong"] !== null) {
          action["kong"] = haveKong(player_hands[curr_player[0]]);
        }
      } 
      const playerList = [];
      for(let i = 0; i < 4; i++) {
        const playerProps = {
          name: this.state.players[i],
          hand: this.state.player_hands[i],
          hand_onclick: (j) => (this.handleClick(i, j)),
          show: this.state.player_shows[i],
          waste: this.state.player_waste[i],
          active: active[i],
          winner: this.state.is_winner[i],
        };
        if(active[i]){
          playerProps["action"] = action;
          const li = this.state.last_player;
          if(action["pong"]){
            playerProps["pong_onclick"] = () => this.handlePong(i, li);
            playerProps["cancel_onclick"] = () => this.handleCancel(li, "pong");
          } else if(action["kong"]) {
            if(player_hands[curr_player].length % 3 === 2) {
              playerProps["kong_onclick"] = () => this.handleKong(i, i);
              playerProps["cancel_onclick"] = () => this.handleCancel(i, "kong");              
            } else {
              playerProps["kong_onclick"] = () => this.handleKong(i, li);
              playerProps["cancel_onclick"] = () => this.handleCancel(li, "kong");
            }
          } else if(action["hu"]){
            playerProps["hu_onclick"] = () => this.handleHu(i, li);
            playerProps["cancel_onclick"] = () => this.handleCancel(li, "hu");
          }
        }
        playerList.push((<Player {...playerProps}/>));
      }
      return (
        <div>
          <h1>My Majiang Table</h1>
          <button onClick={() => this.clear()}>Restart</button>
          <button onClick={() => this.dealAll()}>Deal</button>
          <p>Tiles left: {this.state.tiles.length}</p>
          <div>
            {playerList}
          </div>
        </div>
      );    
    }
  }

function initAction() {
  return {
    pong: false,
    kong: false,
    chow: false,
    hu: false,
  };
}

const getNext = (i) => (i + 1) % 4;

const getPrev = (i) => (i + 3) % 4;

export default Table;

// player_hands: [[11,11,13,14,15], [11,12,13,14], [14,15,15,15], [23,23,23,23]],