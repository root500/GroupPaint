requirejs.config({
    baseUrl: 'static/js',
    paths: {
        'class':        'lib/class',
        'jquery':       'lib/jquery-2.1.4.min',
        'underscore':   'lib/underscore-min',
        'socketio':     '//' + location.hostname + ':3000/socket.io/socket.io',
        'livereload':   '//' + location.hostname + ':35730/livereload'
    },
    shim: {
        'socketio': {
            exports: 'io'
        }
    }
});