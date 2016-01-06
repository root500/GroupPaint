define(['global', 'class', 'jquery', 'socketio'], function(g, Class, $, io) {
    "use strict";

    return Class().extend({
        initialize: function(addr) {
            var self = this;

            this.sock = io.connect(addr == undefined ? location.hostname + ':3000' : addr);
            this.clients = [];
            this.id = '';

            _.each([
                'connected',
                'join',
                'leave',
                'mousedown',
                'mousemove',
                'mouseup'
            ], function(func) {
                self.sock.on(func, function(data) {
                    self[func].call(self, data);
                });
            });
        },

        emit: function(name, data) {
            this.sock.emit(name, data);
        },

        // 접속
        connected: function(data) {
            this.id = data.id;

            delete data.clients[data.id];
            this.clients = data.clients;

            console.log('[socket/connected] id:', this.id, ', clients:', this.clients);

            if(typeof this.onConnected === 'function') {
                this.onConnected(this.id, this.clients);
            }
        },

        // 다른 클라이언트 입장
        join: function(data) {
            this.clients[data] = {
                mouse: {
                    x: 0,
                    y: 0
                }
            };

            console.log('[socket/join]', data);

            if(typeof this.onJoin === 'function') {
                this.onJoin(data);
            }
        },

        // 다른 클라이언트 퇴장
        leave: function(data) {
            console.log('[socket/leave]', data);

            delete this.clients[data];

            if(typeof this.onLeave === 'function') {
                this.onLeave(data);
            }
        },

        // 마우스 움직임
        mousedown: function(data) {
            console.log('[socket/mousedown]', data.id, data.mouse.x, data.mouse.y);

            data.mouse.isDown = true;
            this.clients[data.id].mouse = data.mouse;

            if(typeof this.onMousedown === 'function') {
                this.onMousedown(data.id, data.mouse);
            }
        },
        mousemove: function(data) {
            console.log('[socket/mousemove]', data.id, data.mouse.x, data.mouse.y, this.clients[data.id].mouse.isDown);

            this.clients[data.id].mouse.x = data.mouse.x;
            this.clients[data.id].mouse.y = data.mouse.y;

            if(typeof this.onMousemove === 'function') {
                this.onMousemove(data.id, data.mouse);
            }
        },
        mouseup: function(data) {
            console.log('[socket/mouseup]', data.id);

            var wasDown = this.clients[data.id].mouse.isDown;

            this.clients[data.id].mouse.isDown = false;

            if(typeof this.onMouseup === 'function') {
                this.onMouseup(data.id, wasDown);
            }
        }
    });
});