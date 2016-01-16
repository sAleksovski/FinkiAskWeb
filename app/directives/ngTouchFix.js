(function() {
    app
        .directive('input', [
            function() {
                return {
                    restrict: 'E',
                    link: link
                };
            }
        ])

        .directive('textarea', [
            function() {
                return {
                    restrict: 'E',
                    link: link
                };
            }
        ]);

    function link(scope, elem) {
        console.log("strt");
        // bind the events iff this is an input/textarea within a modal
        if (elem.parents('.modal').length) {
            console.log("inside");
            elem.on('touchstart', function(e) {
                elem.focus();
                e.preventDefault();
                e.stopPropagation();
            });
        }
    }
})();