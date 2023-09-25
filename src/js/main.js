import Screen from "./modules/Screen.js";
import Button from "./modules/Button.js";
import Dialog from "./modules/Dialog.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const mainScreen = new Screen(ctx, canvas.width, canvas.height, '#7CB9E8');
console.log("mainScreen: " + mainScreen.width + "x" + mainScreen.height);

const createButton = new Button(
    mainScreen, 200, 50, (canvas.width - 200) / 2, (canvas.height - 50) / 2, 
    'Create table');
createButton.onClick = () => {
    console.log('CREATE clicked');
    const d = new Dialog(mainScreen, '#FFFFFF');
    d.setOnConfirm(() => {
        console.log('OK clicked');
    });
};

const joinButton = new Button(
    mainScreen, 200, 50, (canvas.width - 200) / 2, (canvas.height - 50) / 2 + 100, 
    'Join table');
joinButton.onClick = () => {
    console.log('JOIN clicked');
};

const gameScreen = new Screen(ctx, canvas.width, canvas.height, "#3B7A57");

// const img = new Image();
// img.addEventListener('load', () => {
//     ctx.drawImage(img, 10, 10);
// }, false);
// img.src = '../../public/tiles/tile-11.png';

canvas.addEventListener('mousemove', (e) => {
    let x = e.offsetX, y = e.offsetY;
    mainScreen.passMousemove(x, y);
    mainScreen.draw();
});

canvas.addEventListener('click', (e) => {
    let x = e.offsetX, y = e.offsetY;
    console.log(x + ',' + y);
    mainScreen.passClick(x, y);
    mainScreen.draw();
});

window.addEventListener('load', () => {
    mainScreen.draw();
});