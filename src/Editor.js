import { Component } from "react";

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        tiles: '',
        player1: '',
        player2: '',
        player3: '',
        player4: '',
      },
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const value = this.state.value;
    value[event.target.name] = event.target.value;
    this.setState({value: value});
  }

  handleSubmit(event) {
    event.preventDefault();
    const playerHands = [1,2,3,4].map(i => (
      this.state.value['player' + i].split(',')
    ));
    const data = {
      tiles: this.state.value['tiles'].split(','),
      playerHands: playerHands,
    }
    this.props.handleSubmit(data);
  }

  render() {
    return (
      <div className="editor-div">
        <form onSubmit={this.handleSubmit}>
          <label>
            Tiles
            <input type='text' name="tiles" onChange={this.handleChange} />
          </label>
          <br />
          <label>
            {this.props.players[0]}
            <input type='text' name="player1" onChange={this.handleChange} />
          </label>
          <br />
          <label>
            {this.props.players[1]}
            <input type='text' name="player2" onChange={this.handleChange} />
          </label>
          <br />
          <label>
            {this.props.players[2]}
            <input type='text' name="player3" onChange={this.handleChange} />
          </label>
          <br />
          <label>
            {this.props.players[3]}
            <input type='text' name="player4" onChange={this.handleChange} />
          </label>
          <br />
          <input type='submit' value='Apply' />
        </form>
      </div>
    );
  }
}

export default Editor;
