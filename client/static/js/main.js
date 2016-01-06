requirejs(['config'], function() {
    requirejs(['jquery', 'underscore', 'global', 'stage', 'socket'], function($, _, g, Stage, Socket) {
        require(['livereload']);

        $(function() {
            var stage = new Stage(),
                sock = new Socket(),

                isMouseDown = false;

            stage.initialize();

            stage.$stage.on({
                mousedown: function(event) {
                    var x = event.offsetX,
                        y = event.offsetY;

                    isMouseDown = true;

                    sock.emit('mousedown', {
                        x: x,
                        y: y
                    });

                    stage.draw.begin(x, y);
                },
                mousemove: function(event) {
                    var x = event.offsetX,
                        y = event.offsetY;

                    sock.emit('mousemove', {
                        x: x,
                        y: y
                    });

                    if(isMouseDown) {
                        stage.draw.drawing(x, y);
                    }
                },
                mouseup: function() {
                    sock.emit('mouseup');

                    if(isMouseDown) {
                        stage.draw.end();
                        isMouseDown = false;
                    }
                }
            });

            sock.onConnected = function(id, clients) {
                _.each(clients, function(client, idx) {
                    stage.cursor.add(idx, client.mouse);
                });
            };
            sock.onJoin = function(id) {
                stage.cursor.add(id, [0, 0]);
            };
            sock.onLeave = function(id) {
                stage.cursor.remove(id);
            };

            sock.onMousedown = function(id, mouse) {
                stage.draw.begin(mouse.x, mouse.y);
            };
            sock.onMousemove = function(id, mouse) {
                stage.cursor.move(id, mouse);

                if(sock.clients[id].mouse.isDown) {
                    stage.draw.drawing(mouse.x, mouse.y);
                }
            };
            sock.onMouseup = function(id, isDown) {
                if(isDown) {
                    stage.draw.end();
                }
            };

            sock.initialize();
        });

    });
});