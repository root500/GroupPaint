define(['global', 'class', 'jquery'], function(g, Class, $) {
    "use strict";

    return Class().extend({
        initialize: function() {
            this.$container = $('.canvas-container');

            this.$stage = $('#stage');
            this.main = this.$stage[0];
            this.ctx = this.main.getContext('2d');

            this.$buffer = $('#buffer');
            this.buffer = this.$buffer[0];
            this.bufferCtx = this.buffer.getContext('2d');

            this.main.width = 1024;
            this.main.height = 720;
            this.buffer.width = this.main.width;
            this.buffer.height = this.main.height;

            this.width = this.main.width;
            this.height = this.main.height;

            this.draw = this.draw(this);
            this.cursor = this.cursor(this);
        },

        // 커서 조정
        cursor: function(self) {
            return {
                add: function(id, mouse) {
                    var $cursor = $(g.tmpl.cursor({ id: id }));

                    $cursor.css({
                        left: mouse.x,
                        top: mouse.y
                    }).appendTo(self.$container).fadeIn();
                },
                move: function(id, mouse) {
                    $('#cursor-' + id).css({
                        left: mouse.x,
                        top: mouse.y
                    });
                },
                remove: function(id) {
                    $('#cursor-' + id).fadeOut(function() {
                        $(this).remove();
                    });
                }
            }
        },

        // 그리기
        draw: function(self) {
            return {
                begin: function(x, y) {
                    self.ctx.beginPath();
                    self.ctx.moveTo(x, y);
                    self.ctx.lineTo(x - 0.1, y);
                    self.ctx.stroke();

                    this.px = x;
                    this.py = y;
                    //this.history = [[x, y]];
                },
                drawing: function(x, y) {
                    self.ctx.moveTo(this.px, this.py);
                    self.ctx.lineTo(x, y);
                    self.ctx.stroke();
                    self.ctx.closePath();
                    self.ctx.beginPath();

                    this.px = x;
                    this.py = y;
                    //this.history.push([x, y]);
                },
                end: function() {
                    //var firstPos = this.history.shift();

                    self.ctx.stroke();
                    self.ctx.closePath();
                    //self.ctx.clearRect(0, 0, self.width, self.height);

                    /*self.mainCtx.beginPath();
                    self.mainCtx.moveTo(firstPos[0], firstPos[1]);

                    _.each(this.history, function(pos) {
                        self.mainCtx.lineTo(pos[0], pos[1]);
                    });

                    self.mainCtx.stroke();
                    self.mainCtx.closePath();*/
                }
            };
        }
    });
});