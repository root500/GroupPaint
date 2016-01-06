var app = require('http').createServer(),
    io = require('socket.io')(app);

var ioEvent = {},
    clients = {};

app.listen(3000, function(){
    console.log('listening on *:3000');
});

function getClients(myID) {
    var clients = [];

    io.sockets.sockets.forEach(function(el, idx) {
        if(el.id !== myID) clients.push(el.id);
    });

    clients.unshift(myID);

    return clients;
}

ioEvents = {
    mousedown: function(pos) {
        console.log('mousedown: ', this.id, pos.x, pos.y);

        clients[this.id].mouse = {
            isDown: true,
            x: pos.x,
            y: pos.y
        };

        this.broadcast.emit('mousedown', {
            id: this.id,
            mouse: clients[this.id].mouse
        });
    },
    mousemove: function(pos) {
        console.log('mousemove: ', this.id, pos.x, pos.y);

        clients[this.id].mouse.x = pos.x;
        clients[this.id].mouse.y = pos.y;

        this.broadcast.emit('mousemove', {
            id: this.id,
            mouse: pos
        });
    },
    mouseup: function() {
        console.log('mouseup: ', this.id);

        clients[this.id].mouse.isDown = false;

        this.broadcast.emit('mouseup', {
            id: this.id
        });
    }
};

io.on('connection', function(socket) {
    console.log('new user: ', socket.id, '(' + io.sockets.sockets.length + ')');

    // 새 사용자 설정
    clients[socket.id] = {
        mouse: {
            isDown: false,
            x: 0,
            y: 0
        }
    };
    socket.emit('connected', {
        id: socket.id,
        clients: clients
    });
    socket.broadcast.emit('join', socket.id);

    Object.keys(ioEvents).forEach(function(func) {
        socket.on(func, function(data) {
            ioEvents[func].call(socket, data);
        });
    });

    // 끊기
    socket.on('disconnect', function() {
        console.log('user disconnected:', socket.id);

        delete clients[socket.id];
        socket.broadcast.emit('leave', socket.id, '(' + io.sockets.sockets.length + ')');
    });
});