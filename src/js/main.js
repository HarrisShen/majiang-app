import MainScreen from "./modules/MainScreen.js";
import Button from "./modules/Button.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const mainScreen = new MainScreen(ctx, canvas.width, canvas.height);

const createButton = new Button(
    mainScreen, 200, 50, (canvas.width - 200) / 2, (canvas.height - 50) / 2, 
    '#AAAAAA', 'Create table');
createButton.onClick = () => {
    console.log('CREATE clicked');
};

const joinButton = new Button(
    mainScreen, 200, 50, (canvas.width - 200) / 2, (canvas.height - 50) / 2 + 100, 
    '#AAAAAA', 'Join table');
joinButton.onClick = () => {
    console.log('JOIN clicked');
};

// const img = new Image();
// img.addEventListener('load', () => {
//     ctx.drawImage(img, 10, 10);
// }, false);
// img.src = '../../public/tiles/tile-11.png';

canvas.addEventListener('click', (e) => {
    let x = e.clientX, y = e.clientY;
    console.log(x + ',' + y);
    mainScreen.onClick(x, y);
});

window.addEventListener('load', () => {
    mainScreen.draw();
});