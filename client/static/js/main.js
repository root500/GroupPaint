requirejs(['config'], function() {
    requirejs(['jquery', 'underscore', 'global', 'stage', 'socket'], function($, _, g, Stage, Socket) {
        require(['livereload']);

        $(function() {
            var stage = new Stage(),
                sock = new Socket(),

                isMouseDown = false;

            function addUser(id, mouse) {
                sock.clients[id].stage = new Stage();
                sock.clients[id].stage.initialize();
                stage.cursor.add(id, mouse);
            }

            function initClient() {
                stage.initialize();

                stage.$canvas.on({
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
                            var bufferData = stage.draw.end();

                            isMouseDown = false;
                            sock.emit('buffer', bufferData);
                        }
                    }
                });
            }

            sock.onJoin = function(id) {
                addUser(id, { x: 0, y: 0 });
            };
            sock.onLeave = function(id) {
                stage.cursor.remove(id);
            };

            sock.onBuffer = function(id, data) {
                var bufferImg = new Image();

                bufferImg.src = data;
                stage.ctx.drawImage(bufferImg, 0, 0);
                sock.clients[id].stage.draw.buffer.remove();
            };

            sock.onMousedown = function(id, mouse) {
                sock.clients[id].stage.draw.begin(mouse.x, mouse.y);
            };
            sock.onMousemove = function(id, mouse) {
                stage.cursor.move(id, mouse);

                if(sock.clients[id].mouse.isDown) {
                    sock.clients[id].stage.draw.drawing(mouse.x, mouse.y);
                }
            };
            sock.onMouseup = function(id, isDown) {
                if(isDown) {
                    sock.clients[id].stage.draw.end(true);
                }
            };

            sock.onConnected = function(data) {
                g.stage = data.stage;
                initClient();
                _.each(data.clients, function(client, _id) {
                    addUser(_id, client.mouse);
                });
            };

            sock.initialize();
        });

    });
});