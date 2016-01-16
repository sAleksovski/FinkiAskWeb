app.controller('ResultController', function($scope, $rootScope, $location, $interval, roundProgressService) {
    // console.log($rootScope.globals.score);
    if (typeof $rootScope.globals.result === 'undefined') {
        $location.path('/');
        return;
    }

    $rootScope.title = 'Finki ASK';
    $rootScope.show_back_arrow = false;
    $rootScope.show_send_test = false;

    // redirect to home on icon clicked
    $rootScope.icon_clicked = function() {
        delete $rootScope.globals.result;
        delete $rootScope.globals.type;
        $location.path('/');
    };

    $scope.getGrade = function() {
        var grade = Math.ceil($rootScope.globals.result / 10);
        grade = Math.max(grade, 5);
        var letter = String.fromCharCode('A'.charCodeAt(0) + (10 - grade));
        return letter;
    };

    $scope.getStyle = function(){
        var transform = 'translateY(-50%) ' + 'translateX(-50%)';

        return {
            'top': '50%',
            'bottom': 'auto',
            'left': '50%',
            'transform': transform,
            '-moz-transform': transform,
            '-webkit-transform': transform,
            'font-size': 100/2.0 + 'px'
        };
    };

});
