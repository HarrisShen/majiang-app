import Screen from "./modules/Screen.js";
import Button from "./modules/Button.js";
import Dialog from "./modules/Dialog.js";
import Box from "./modules/Box.js";
import Label from "./modules/Label.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
console.log("canvas: " + canvas.width + "x" + canvas.height);

let activeScreen = null;

const mainScreen = new Screen(ctx, canvas.width, canvas.height, '#7CB9E8');

const gameTitle = new Label(mainScreen, {x: canvas.width / 2, y: 200}, 'Minimal Mahjong', '60px Arial Bold', '#000000', 'center', 'middle')

const createButton = new Button(
    mainScreen, {width: 200, height: 50, verticalAlign: 'middle', horizontalAlign: 'center'}, 
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
    mainScreen, {width: 200, height: 50, y: (canvas.height - 50) / 2 + 100, horizontalAlign: 'center'}, 
    'Join table');
joinButton.onClick = () => {
    console.log('JOIN clicked');
    const d = new Dialog(mainScreen, '#FFFFFF');
    d.setOnConfirm(() => {
        console.log('OK clicked');
    });
};

const gameScreen = new Screen(ctx, canvas.width, canvas.height, "#3B7A57");
const mainPlayerBox = new Box(gameScreen, {width: canvas.width, height: 300, x: 0, y: canvas.height - 300}, null, '#000000');
const mainPlayerLabel = new Label(mainPlayerBox, {x: canvas.width / 2, y: canvas.height - 200}, 'Player 1', '60px Arial Bold', '#000000', 'center', 'middle');
const controlBox = new Box(mainPlayerBox, {width: canvas.width, height: 80}, null, '#000000');

// const img = new Image();
// img.addEventListener('load', () => {
//     ctx.drawImage(img, 10, 10);
// }, false);
// img.src = '../../public/tiles/tile-11.png';

activeScreen = mainScreen;

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