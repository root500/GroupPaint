requirejs.config({
    baseUrl: 'static/js',
    paths: {
        'jquery':       'lib/jquery-2.1.4.min',
        'underscore':   'lib/underscore-min',
        'socketio':     '//' + location.hostname + ':3000/socket.io/socket.io',
        'livereload':   '//' + location.hostname + ':35729/livereload'
    },
    shim: {
        'socketio': {
            exports: 'io'
        }
    }
});