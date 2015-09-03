app.controller('TestController', function($scope, $rootScope, $cookieStore, $modal, $location, ApiService) {

    $rootScope.title = 'Test';

    $scope.save = function(question) {
        $cookieStore.put('globals', $rootScope.globals);
        if (typeof question !== 'undefined') {
            ApiService.saveAnswers($rootScope.globals.test.id, []).then(function(response) {
                console.log(response);
            }, function(response) {
                console.log(response);
            });
        };
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

    angular.element(document).ready(function() {
        setTimeout(function() {
            window.material_init();
        }, 0);
    });

});