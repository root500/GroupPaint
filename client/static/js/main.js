requirejs(['config'], function() {
    requirejs(['jquery', 'underscore', 'stage', 'socket'], function($, _, stage) {
        require(['livereload']);

        $(function() {
            stage.init();
        });
    });
});