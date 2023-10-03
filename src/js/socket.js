function socketSetup(socket, app) {
    socket.on('connect', () => {
        console.log('app socket connected');
    });

    socket.on('player:init', (data) => {
        app.setState('self', data.self);
    });

    socket.on('table:update', (data) => {
        console.log(data);
        if (data.tableID) app.tableID = data.tableID;
        if (data.players) app.players = data.players;
    });
}

export default socketSetup;