import Element from "./modules/Element.js";
import Screen from "./modules/Screen.js";
import Button from "./modules/Button.js";
import Dialog from "./modules/Dialog.js";
import Box from "./modules/Box.js";
import Label from "./modules/Label.js";
// import ImageBlock from "./modules/ImageBlock.js";
import { Tile } from "./custom.js";
import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
import socketSetup from "./socket.js";

const socket = io("http://localhost:9000");

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
console.log("canvas: " + canvas.width + "x" + canvas.height);

const app = new Element();

const mainScreen = new Screen(ctx, canvas.width, canvas.height, '#7CB9E8');

const gameTitle = new Label(mainScreen, {x: canvas.width / 2, y: 200}, 'Minimal Mahjong', '60px Arial Bold', '#000000', 'center', 'middle')

const buttonBox = new Box(
    mainScreen, 
    {width: 250, height: 200, verticalAlign: 'middle', horizontalAlign: 'center'}, 
    {type: 'column', justify: 'center', padding: 20, spacing: 30}, 
    null, null);

const createButton = new Button(
    buttonBox, {width: 200, height: 50, horizontalAlign: 'center'}, 
    'Create table');
createButton.onClick = () => {
    console.log('CREATE clicked');
    const d = new Dialog(mainScreen, '#FFFFFF');
    d.setOnConfirm(() => {
        console.log('OK clicked');
        socket.emit('table:create', 1);
    });
};

const joinButton = new Button(
    buttonBox, {width: 200, height: 50, horizontalAlign: 'center'}, 
    'Join table');
joinButton.onClick = () => {
    console.log('JOIN clicked');
    const d = new Dialog(mainScreen, '#FFFFFF');
    d.setOnConfirm(() => {
        console.log('OK clicked');
    });
};

const toggleButton = new Button(
    buttonBox, {width: 200, height: 50, horizontalAlign: 'center'},
    'Toggle');
toggleButton.setState('toggle', true, () => {
    toggleButton.text = toggleButton.toggle ? 'Toggle' : 'Untoggle';
});
toggleButton.onClick = () => {
    console.log('TOGGLE clicked');
    toggleButton.toggle = !toggleButton.toggle;
};

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
    controlBox.ready = !controlBox.ready;
    socket.emit('game:ready');
};
const leaveButton = new Button(controlBox, {width: 150, height: 40, verticalAlign: 'middle'}, 'Leave');
leaveButton.setOnClick(() => {
    console.log('LEAVE clicked');
    socket.emit('table:leave', (data) => {
        app.setState('tableID', data.tableID);
    });
});
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

// for (let i = 0; i < 13; i++) {
//     Tile(handBox);
// }

const leftPlayerBox = new Box(gameScreen, {y: 40, width: 160, height: canvas.height - 260, horizontalAlign: 'left'}, {}, null, '#000000');

const topPlayerBox = new Box(gameScreen, {x: 160, width: canvas.width - 320, height: 160, verticalAlign: 'top'}, {}, null, '#000000');

const rightPlayerBox = new Box(gameScreen, {y: 40, width: 160, height: canvas.height - 260, horizontalAlign: 'right'}, {}, null, '#000000');
app.activeScreen = mainScreen;
app.setState('tableID', null, () => {
    app.activeScreen = app.tableID ? gameScreen : mainScreen;
    tableIDLable.text = 'Table ID: ' + app.tableID;
    app.activeScreen.draw();
});
app.setState('self', '', () => {
    usernameLabel.text = app.self;
});
app.setState('players', [], () => {
    console.log(app.players);
});
app.setState('gameState', {}, () => {
    if (app.gameState.players !== undefined
        || app.gameState.currPlayer !== 0
        || app.gameState.forbid !== 0) {
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

socketSetup(socket, app);
