function socketSetup(socket, app, gameScreen) {
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
}

export default socketSetup;