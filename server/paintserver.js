var app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http);

var ioEvent = {};

http.listen(3000, function(){
    console.log('listening on *:3000');
});

function getSocketIDList(myID) {
    var idList = [];

    io.sockets.sockets.forEach(function(el, idx) {
        if(el.id !== myID) idList.push(el.id);
    });

    idList.unshift(myID);

    return idList;
}

ioEvent = {
    cursor: function(pos) {
        //console.log(pos);

        pos = pos.split(',');
        io.emit('cursor', JSON.stringify({
            id: this.id,
            pos: pos
        }));
    }
};

io.on('connection', function(socket){
    var idList = getSocketIDList(socket.id);

    console.log('새 사용자 접속: ', socket.id);

    socket.emit('idList', idList);
    socket.broadcast.emit('newID', socket.id);

    socket.on('cursor', function(data) {
        ioEvent.cursor.call(socket, data)
    });
});