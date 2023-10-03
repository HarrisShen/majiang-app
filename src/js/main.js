import Element from "./modules/Element.js";
import Screen from "./modules/Screen.js";
import Button from "./modules/Button.js";
import Dialog from "./modules/Dialog.js";
import Box from "./modules/Box.js";
import Label from "./modules/Label.js";
import ImageBlock from "./modules/ImageBlock.js";
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
const mainPlayerBox = new Box(gameScreen, {width: canvas.width, height: 220, verticalAlign: 'bottom'}, {}, null, '#000000');
const mainPlayerLabel = new Label(mainPlayerBox, {x: canvas.width / 2, y: canvas.height - 160}, 'Player 1', '60px Arial Bold', '#666666', 'center', 'middle');
const profileBox = new Box(mainPlayerBox, {width: 80, height: 100, verticalAlign: 'top', horizontalAlign: 'left'}, {}, null, '#000000');
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
for (let i = 0; i < 13; i++) {
    const tile = new ImageBlock(handBox, {width: 64, height: 96, verticalAlign: 'bottom'}, '../../public/tiles/tile-11.png');
    tile.onMousemove = (function (x, y) {
        this.style.verticalAlign = this.isInside(x, y) ? 'top' : 'bottom';
    });
}

app.activeScreen = mainScreen;
app.setState('tableID', null, () => {
    app.activeScreen = app.tableID ? gameScreen : mainScreen;
    app.activeScreen.draw();
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
