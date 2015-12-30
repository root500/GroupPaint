define(['global', 'jquery', 'socket'], function(g, $, socket) {
    var $stage = $('#stage'),
        stage = $stage[0],
        context = stage.getContext('2d'),
        width = stage.width,
        height = stage.height;

    function resizeCanvas() {
        function resize() {
            var save = context.getImageData(0, 0, width, height);

            stage.width = g.width();
            stage.height = g.height();

            context.putImageData(save, 0, 0, 0, 0, width, height);
            width = stage.width;
            height = stage.height;
        }

        g.$win.on('resize', resize);
        resize();
    }

    function setDraw() {
        var sx, sy,
            cx, cy,
            isDown = false;

        $stage.on({
            'mousedown': function(event) {
                isDown = true;
                sx = event.clientX;
                sy = event.clientY;

                context.lineJoin = 'round';
                context.lineCap = 'round';
                context.lineWidth = 2;
                //context.shadowColor = '#000';
                //context.shadowBlur = 1;

                context.beginPath();
                context.moveTo(sx, sy);
                context.lineTo(sx, sy);
                context.stroke();
            },
            'mousemove': function(event) {
                cx = event.clientX;
                cy = event.clientY;

                socket.emit('cursor', cx + ',' + cy);

                if(isDown) {
                    context.moveTo(sx, sy);
                    context.lineTo(cx, cy);
                    context.stroke();
                    context.closePath();
                    context.beginPath();

                    sx = cx;
                    sy = cy;
                }
            },
            'mouseup': function(event) {
                isDown = false;
                context.closePath();
                context.stroke();
            }
        });
    }

    function init() {
        setDraw();
        resizeCanvas();
    }

    return {
        init: init,
        $el: $stage,
        el: stage,
        ctx: context
    };
});