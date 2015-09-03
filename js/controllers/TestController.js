app.controller('TestController', function($scope, $rootScope, $cookieStore, $modal, $location, ApiService) {

    $rootScope.title = 'Test';
    $rootScope.show_send_test = true;
    $scope.show = 0;

    $scope.timer = 12 * 60 + 15;

    setInterval(function() {
        $scope.timer--;
        var min = Math.floor($scope.timer / 60);
        var sec = $scope.timer % 60;
        if (min < 10) {
            min = '0' + min;
        };
        if (sec < 10) {
            sec = '0' + sec;
        };

        $rootScope.timeleft = min + ':' + sec;
        $rootScope.$apply();
    }, 1000);

    $rootScope.icon_clicked = function() {
        $scope.show = 0;
        $rootScope.show_back_arrow = false;
    }

    $rootScope.finish_test_clicked = function() {
        console.log('Finish test');
    }

    $scope.save = function(question) {
        if (typeof question !== 'undefined') {
            question.answered = true;
            ApiService.saveAnswers($rootScope.globals.test.id, []).then(function(response) {
                console.log(response);
            }, function(response) {
                console.log(response);
            });
        };
        $cookieStore.put('globals', $rootScope.globals);
    }

    for (var i = 0; i < $rootScope.globals.test.questions.length; i++) {
        var question = $rootScope.globals.test.questions[i];
        if (question.type == "RADIO") {
            question.sel_ans = question.sel_ans || {};
        };

        if (question.type == "RANGE") {
            var answer = question.answers[0];
            var parts = answer.text.split(':');
            question.min = parseInt(parts[0]);
            question.max = parseInt(parts[1]);

            if (parts.length > 2) {
                question.value = parseInt(parts[2]);
            } else {
                question.value = parseInt(question.min);
            }
        };

        $scope.save();
    };

    $scope.sliderChanged = function(question) {
        var answer = question.answers[0];
        answer.text = question.min + ':' + question.max + ':' + question.value;
        $scope.save(question);
    }

    $scope.changeQuestion = function(id) {
        $scope.show = id;
        $rootScope.show_back_arrow = true;
    }

    angular.element(document).ready(function() {
        setTimeout(function() {
            window.material_init();
        }, 0);
    });

});