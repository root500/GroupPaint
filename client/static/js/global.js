define(['jquery'], function($) {
    var $win = $(window),
        $doc = $(document),

        tmpl = {
            cursor: _.template($('#tmpl-cursor').html())
        };

    return {
        $win: $win,
        $doc: $doc,
        tmpl: tmpl,
        width: function() {
            return $win.width()
        },
        height: function() {
            return $win.height()
        }
    };
});