function socketSetup(socket, app) {
    socket.on('connect', () => {
        console.log('app socket connected');
    });

    socket.on('table:update', (data) => {
        console.log('table:update -');
        console.log(data);
        app.setState('tableID', data.tableID);
    });    
}

export default socketSetup;