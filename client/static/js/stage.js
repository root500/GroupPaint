define(['global', 'class', 'jquery'], function(g, Class, $) {
    "use strict";

    return Class().extend({
        initialize: function() {
            this.$container = $('.canvas-container');

            this.$canvas = $('#stage');
            this.canvas = this.$canvas[0];
            this.ctx = this.canvas.getContext('2d');

            this.width = g.stage.width;
            this.height = g.stage.height;

            this.canvas.width = this.width;
            this.canvas.height = this.height;

            this.Buffer = this.Buffer();
            this.draw = this.draw(this);
            this.cursor = this.cursor(this);

            this.$canvas.css({
                width: this.width,
                height: this.height
            });
            this.$container.css({
                display: 'block',
                marginLeft: -this.width / 2,
                marginTop: -this.height / 2
            });
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

        Buffer: function() {
            var self = this;

            return Class().extend({
                add: function() {
                    this.$canvas = $('<canvas class="canvas canvas-buffer"></canvas>');
                    this.$canvas.prependTo(self.$container);

                    this.canvas = this.$canvas[0];
                    this.canvas.width = self.width;
                    this.canvas.height = self.height;
                    this.ctx = this.canvas.getContext('2d');
                },
                remove: function() {
                    this.$canvas.remove();
                }
            });
        },

        // 그리기
        draw: function(self) {
            return {
                begin: function(x, y) {
                    this.buffer = new self.Buffer();
                    this.buffer.add();

                    this.buffer.ctx.beginPath();
                    this.buffer.ctx.moveTo(x, y);
                    this.buffer.ctx.lineTo(x - 0.1, y);
                    this.buffer.ctx.stroke();
                    this.px = x;
                    this.py = y;
                },
                drawing: function(x, y) {
                    this.buffer.ctx.beginPath();
                    this.buffer.ctx.moveTo(this.px, this.py);
                    this.buffer.ctx.lineTo(x, y);
                    this.buffer.ctx.stroke();
                    this.buffer.ctx.closePath();
                    this.buffer.ctx.beginPath();

                    this.px = x;
                    this.py = y;
                },
                end: function(isRemote) {
                    var bufferImg = new Image(),
                        bufferData = this.buffer.canvas.toDataURL();

                    this.buffer.ctx.stroke();
                    this.buffer.ctx.closePath();

                    if(!isRemote) {
                        bufferImg.src = bufferData;
                        self.ctx.drawImage(bufferImg, 0, 0);

                        this.buffer.remove();

                        return bufferData;
                    }
                }
            };
        }
    });
});