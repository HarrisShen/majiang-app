import Screen from "./modules/Screen.js";
import Button from "./modules/Button.js";
import Dialog from "./modules/Dialog.js";
import Box from "./modules/Box.js";
import Label from "./modules/Label.js";
import ImageBlock from "./modules/ImageBlock.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
console.log("canvas: " + canvas.width + "x" + canvas.height);

let activeScreen = null;

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
        activeScreen = gameScreen;
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

const gameScreen = new Screen(ctx, canvas.width, canvas.height, "#3B7A57");
const mainPlayerBox = new Box(gameScreen, {width: canvas.width, height: 240, verticalAlign: 'bottom'}, {}, null, '#000000');
const mainPlayerLabel = new Label(mainPlayerBox, {x: canvas.width / 2, y: canvas.height - 200}, 'Player 1', '60px Arial Bold', '#000000', 'center', 'middle');
const profileBox = new Box(mainPlayerBox, {width: 80, height: 100, verticalAlign: 'top', horizontalAlign: 'left'}, {}, null, '#000000');
const controlBox = new Box(mainPlayerBox, {x: 80, width: canvas.width - 100, height: 50}, {type: 'row', padding: 20, spacing: 20}, null, '#000000');
const readyButton = new Button(controlBox, {width: 150, height: 40, verticalAlign: 'middle'}, 'Ready');
readyButton.onClick = () => {
    console.log('READY clicked');
};
const leaveButton = new Button(controlBox, {width: 150, height: 40, verticalAlign: 'middle'}, 'Leave');
leaveButton.onClick = () => {
    console.log('LEAVE clicked');
    activeScreen = mainScreen;
};
const handBox = new Box(mainPlayerBox, {x:50, width: 884, height: 120, verticalAlign: 'bottom'}, {type: 'row'}, null, '#000000');
for (let i = 0; i < 13; i++) {
    const tile = new ImageBlock(handBox, {width: 68, height: 100, verticalAlign: 'bottom'}, '../../public/tiles/tile-11.png');
    tile.onMousemove = (function (x, y) {
        this.style.verticalAlign = this.isInside(x, y) ? 'top' : 'bottom';
    });
}

// const img = new Image();
// img.addEventListener('load', () => {
//     ctx.drawImage(img, 10, 10);
// }, false);
// img.src = '../../public/tiles/tile-11.png';

activeScreen = gameScreen;

canvas.addEventListener('mousemove', (e) => {
    let x = e.offsetX, y = e.offsetY;
    activeScreen.passMousemove(x, y);
    activeScreen.draw();
});

canvas.addEventListener('click', (e) => {
    let x = e.offsetX, y = e.offsetY;
    console.log(x + ',' + y);
    activeScreen.passClick(x, y);
    activeScreen.draw();
});

window.addEventListener('load', () => {
    activeScreen.draw();
});