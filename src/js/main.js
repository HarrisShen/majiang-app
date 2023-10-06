import Element from "./modules/base/Element.js";
import MainScreen from "./modules/custom/MainScreen.js";
import GameScreen from "./modules/custom/GameScreen.js";
import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

const socket = io("http://localhost:9000");

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
console.log("canvas: " + canvas.width + "x" + canvas.height);

const app = new Element();

let mainScreen, gameScreen;

app.setState('mode', 'main', () => {
    if (app.mode === 'main') {
        mainScreen = MainScreen(ctx, canvas, socket);
        app.activeScreen = mainScreen;
    } else if (app.mode === 'game') {
        gameScreen = GameScreen(ctx, canvas, socket, app);
        app.activeScreen = gameScreen;
    }
    app.activeScreen.draw();
});
app.setState('self', '', () => {});

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

socket.on('connect', () => {
    console.log('app socket connected');
});

socket.on('player:init', (data) => {
    console.log(data);
});

socket.on('table:update', (data) => {
    console.log(data);
    if (data.source === 'create') {
        app.mode = 'game';
        gameScreen.tableID = data.tableID;
        gameScreen.players = data.players;
        gameScreen.playerReady = data.playerReady;
    } else if (data.source === 'leave' || data.source === 'join') {
        gameScreen.players = data.players;
        gameScreen.playerReady = data.playerReady;
    } else if (data.source === 'reset-ready') {
        gameScreen.playerReady = data.playerReady;
    }
    app.activeScreen.draw();
});

socket.on('game:update', (data) => {
    console.log('game:' + data.gameID);
    console.log(data.gameState);
    gameScreen.gameState = data.gameState;
    if (data.start) {
        socket.emit('game:action', null, null, null);
    }
    app.activeScreen.draw();
});