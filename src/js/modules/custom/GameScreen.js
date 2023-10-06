import Screen from "../base/Screen.js";
import Label from "../base/Label.js";
import Box from "../base/Box.js";
import Button from "../base/Button.js";
import Tile from "./Tile.js";

function GameScreen(ctx, canvas, socket, app) {
    const gameScreen = new Screen(ctx, canvas.width, canvas.height, "#3B7A57");
    const tableIDLable = new Label(gameScreen, {x: 8, y: 12}, 'Table ID: ', '20px Arial Bold', '#000000', 'left', 'top');
    const mainPlayerBox = new Box(gameScreen, {width: canvas.width, height: 220, verticalAlign: 'bottom'}, {}, null, '#000000');
    const mainPlayerLabel = new Label(mainPlayerBox, {x: canvas.width / 2, y: canvas.height - 160}, 'Player 1', '60px Arial Bold', '#666666', 'center', 'middle');
    const profileBox = new Box(mainPlayerBox, {width: 80, height: 100, verticalAlign: 'top', horizontalAlign: 'left'}, {}, null, '#000000');
    const usernameLabel = new Label(profileBox, {verticalAlign: 'bottom', horizontalAlign: 'left'}, 'Username', '20px Arial', '#FFFFFF', 'left', 'bottom');
    const controlBox = new Box(mainPlayerBox, {x: 80, width: canvas.width - 100, height: 50}, {type: 'row', padding: 20, spacing: 20}, null, '#000000');
    
    const readyButton = new Button(controlBox, {width: 150, height: 40, verticalAlign: 'middle'}, 'Ready');
    readyButton.onClick = () => {
        console.log('READY clicked');
        // controlBox.ready = !controlBox.ready;
        socket.emit('game:ready');
    };
    const leaveButton = new Button(controlBox, {width: 150, height: 40, verticalAlign: 'middle'}, 'Leave');
    leaveButton.setOnClick(() => {
        console.log('LEAVE clicked');
        socket.emit('table:leave', (data) => {
            app.mode = 'main';
        });
    });
    const chowButton = new Button(controlBox, {width: 150, height: 40, verticalAlign: 'middle', hidden: true}, 'Chow');
    const pongButton = new Button(controlBox, {width: 150, height: 40, verticalAlign: 'middle', hidden: true}, 'Pong');
    const kongButton = new Button(controlBox, {width: 150, height: 40, verticalAlign: 'middle', hidden: true}, 'Kong');
    const winButton = new Button(controlBox, {width: 150, height: 40, verticalAlign: 'middle', hidden: true}, 'Win');
    const passButton = new Button(controlBox, {width: 150, height: 40, verticalAlign: 'middle', hidden: true}, 'Pass');

    controlBox.setState('ready', false, () => {
        readyButton.text = controlBox.ready ? 'Cancel' : 'Ready';
        leaveButton.style.disabled = controlBox.ready;
    });

    const handBox = new Box(mainPlayerBox, {x:70, width: 832, height: 110, verticalAlign: 'bottom'}, {type: 'row'}, null, '#000000');
    handBox.setState('tiles', [], () => {
        handBox.removeAll();
        for (let i = 0; i < handBox.tiles.length; i++) {
            Tile(handBox, handBox.tiles[i]);
        }
    });

    const leftPlayerBox = new Box(gameScreen, {y: 40, width: 160, height: canvas.height - 260, horizontalAlign: 'left'}, {}, null, '#000000');

    const topPlayerBox = new Box(gameScreen, {x: 160, width: canvas.width - 320, height: 160, verticalAlign: 'top'}, {}, null, '#000000');

    const rightPlayerBox = new Box(gameScreen, {y: 40, width: 160, height: canvas.height - 260, horizontalAlign: 'right'}, {}, null, '#000000');

    gameScreen.setState('tableID', null, () => {
        tableIDLable.text = 'Table ID: ' + gameScreen.tableID;
    });
    gameScreen.setState('players', [], () => {
        if (gameScreen.players.length === 0) return;
        usernameLabel.text = gameScreen.players[0];
    });
    gameScreen.setState('playerReady', [], () => {
        if (gameScreen.playerReady.length === 0) return;
        controlBox.ready = gameScreen.playerReady[0];
    });
    gameScreen.setState('gameState', {}, () => {
        const gameState = gameScreen.gameState;
        if (gameState.players === undefined) return;
        const controlButtons = controlBox.components;
        controlButtons.forEach((button) => {
            button.style.hidden = true;
        });
        if (gameState.status === 0) {
            readyButton.style.hidden = false;
            leaveButton.style.hidden = false;
        } else if (gameState.status === 2) {
            if (gameState.playerActions[0].pong)
                pongButton.style.hidden = false;
            if (gameState.playerActions[0].kong)
                kongButton.style.hidden = false;
            if (gameState.playerActions[0].chow)
                chowButton.style.hidden = false;
            if (gameState.playerActions[0].hu)
                winButton.style.hidden = false;
            passButton.style.hidden = false;
        }
        handBox.tiles = gameState.players[0].hand;
    });

    return gameScreen;
}

export default GameScreen;