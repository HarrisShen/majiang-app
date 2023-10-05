import Element from "./modules/base/Element.js";
import MainScreen from "./modules/custom/MainScreen.js";
import GameScreen from "./modules/custom/GameScreen.js";
import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

const socket = io("http://localhost:9000");

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
console.log("canvas: " + canvas.width + "x" + canvas.height);

const app = new Element();

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

// socketSetup(socket, app, gameScreen);
socket.on('connect', () => {
    console.log('app socket connected');
});

socket.on('player:init', (data) => {
    // app.setState('self', data.self);
    gameScreen.self = data.self;
});

socket.on('table:update', (data) => {
    console.log(data);
    if (data.tableID) {
        app.tableID = data.tableID;
        gameScreen.tableID = data.tableID;
    }
    if (data.players) gameScreen.players = data.players;
});

socket.on('game:update', (data) => {
    console.log('game:' + data.gameID);
    console.log(data.gameState);
    app.gameState = data.gameState;
    if (data.start) {
        socket.emit('game:action', null, null, null);
    }
});