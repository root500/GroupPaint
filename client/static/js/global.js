define(['jquery'], function($) {
    var $win = $(window),
        $doc = $(document);

    return {
        $win: $win,
        $doc: $doc,
        width: function() {
            return $win.width()
        },
        height: function() {
            return $win.height()
        }
    };
});