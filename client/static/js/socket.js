define(['socketio'], function(io) {
    var socket = io.connect(location.hostname + ':3000'),
        clients = [],
        id;

    socket.on('idList', function(data) {
        console.log(data);

        clients = data;
        id = clients.shift();

        console.log(id, clients);
    });
    socket.on('newID', function(data) {
        console.log('new user', data);

        clients.push(data);

        console.log('userList', clients);
    });
    socket.on('cursor', function(data) {
        //console.log(data);
    });

    return {
        emit: function(name, data) {
            socket.emit(name, data);
        },
        id: function() {
            return id;
        }
    };
});