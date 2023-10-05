import Element from "./modules/base/Element.js";
import Screen from "./modules/base/Screen.js";
import Button from "./modules/base/Button.js";
import Dialog from "./modules/base/Dialog.js";
import Box from "./modules/base/Box.js";
import Label from "./modules/base/Label.js";
// import ImageBlock from "./modules/ImageBlock.js";
import Tile from "./modules/custom/Tile.js";
import MainScreen from "./modules/custom/MainScreen.js";
import GameScreen from "./modules/custom/GameScreen.js";
import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
import socketSetup from "./socket.js";

const socket = io("http://localhost:9000");

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
console.log("canvas: " + canvas.width + "x" + canvas.height);

const app = new Element();

// const gameScreen = new Screen(ctx, canvas.width, canvas.height, "#3B7A57");
// const tableIDLable = new Label(gameScreen, {x: 8, y: 12}, 'Table ID: ', '20px Arial Bold', '#000000', 'left', 'top');
// const mainPlayerBox = new Box(gameScreen, {width: canvas.width, height: 220, verticalAlign: 'bottom'}, {}, null, '#000000');
// const mainPlayerLabel = new Label(mainPlayerBox, {x: canvas.width / 2, y: canvas.height - 160}, 'Player 1', '60px Arial Bold', '#666666', 'center', 'middle');
// const profileBox = new Box(mainPlayerBox, {width: 80, height: 100, verticalAlign: 'top', horizontalAlign: 'left'}, {}, null, '#000000');
// const usernameLabel = new Label(profileBox, {verticalAlign: 'bottom', horizontalAlign: 'left'}, 'Username', '20px Arial', '#FFFFFF', 'left', 'bottom');
// const controlBox = new Box(mainPlayerBox, {x: 80, width: canvas.width - 100, height: 50}, {type: 'row', padding: 20, spacing: 20}, null, '#000000');
// const readyButton = new Button(controlBox, {width: 150, height: 40, verticalAlign: 'middle'}, 'Ready');

// readyButton.onClick = () => {
//     console.log('READY clicked');
//     controlBox.ready = !controlBox.ready;
//     socket.emit('game:ready');
// };
// const leaveButton = new Button(controlBox, {width: 150, height: 40, verticalAlign: 'middle'}, 'Leave');
// leaveButton.setOnClick(() => {
//     console.log('LEAVE clicked');
//     socket.emit('table:leave', (data) => {
//         app.setState('tableID', data.tableID);
//     });
// });
// controlBox.setState('ready', false, () => {
//     readyButton.text = controlBox.ready ? 'Cancel' : 'Ready';
//     leaveButton.style.disabled = controlBox.ready;
// });

// const handBox = new Box(mainPlayerBox, {x:70, width: 832, height: 110, verticalAlign: 'bottom'}, {type: 'row'}, null, '#000000');
// handBox.setState('tiles', [], () => {
//     handBox.removeAll();
//     for (let i = 0; i < handBox.tiles.length; i++) {
//         Tile(handBox, handBox.tiles[i]);
//     }
// });

// const leftPlayerBox = new Box(gameScreen, {y: 40, width: 160, height: canvas.height - 260, horizontalAlign: 'left'}, {}, null, '#000000');

// const topPlayerBox = new Box(gameScreen, {x: 160, width: canvas.width - 320, height: 160, verticalAlign: 'top'}, {}, null, '#000000');

// const rightPlayerBox = new Box(gameScreen, {y: 40, width: 160, height: canvas.height - 260, horizontalAlign: 'right'}, {}, null, '#000000');

let mainScreen = MainScreen(ctx, canvas, socket);
let gameScreen = GameScreen(ctx, canvas, socket, app);

app.activeScreen = mainScreen;

app.setState('tableID', null, () => {
    if (app.tableID) {
        gameScreen = GameScreen(ctx, canvas, socket, app);
        app.activeScreen = gameScreen;
        gameScreen.tableID = app.tableID;
    } else {
        mainScreen = MainScreen(ctx, canvas, socket);
        app.activeScreen = mainScreen;
    }
    app.activeScreen.draw();
});
app.setState('gameState', {}, () => {
    if (app.gameState.players !== undefined
        && app.gameState.currPlayer !== 0
        && app.gameState.forbid !== 0) {
        handBox.tiles = app.gameState.players[0].hand;
    }
});

canvas.addEventListener('mousemove', (e) => {
    let x = e.offsetX, y = e.offsetY;
    app.activeScreen.passMousemove(x, y);
    app.activeScreen.draw();
});

canvas.addEventListener('click', (e) => {
    let x = e.offsetX, y = e.offsetY;
    console.log(x + ',' + y);
    app.activeScreen.passClick(x, y);
    app.activeScreen.draw();
});

window.addEventListener('load', () => {
    app.activeScreen.draw();
});

socketSetup(socket, app, gameScreen);
