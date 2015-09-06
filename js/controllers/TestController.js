app.controller('TestController', function($scope, $rootScope, $cookieStore, $modal, $location, ApiService) {

    $rootScope.title = 'Test';
    $rootScope.show_send_test = true;
    $scope.show = 0;

    var now = parseInt(new Date().getTime() / 1000);
    var to_end = parseInt(new Date($rootScope.globals.test.timer_end) / 1000);

    $scope.timer = to_end - now;
    
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

        if ($scope.timer == 0) {
            delete $rootScope.globals.test;
            $cookieStore.put('globals', $rootScope.globals);
            $location.path('/');
        };

    }, 1000);

    $rootScope.icon_clicked = function() {
        $scope.show = 0;
        $rootScope.show_back_arrow = false;
    }

    $rootScope.finish_test_clicked = function() {
        console.log('Finish test');
    }

    function generateAnswersToSave(question) {
        if (question.type == 'SINGLE') {
            var selected = question.sel_ans;
            var answers = [];
            for (var i = 0; i < question.answers.length; i++) {
                var answer = angular.copy(question.answers[i]);
                answer.isChecked = false;
                if (answer.id == selected) {
                    answer.isChecked = true;
                };
                answers.push(answer);
            };
            return answers;
        }
        else if (question.type == 'MULTIPLE') {
            var answers = [];
            for (var i = 0; i < question.answers.length; i++) {
                var answer = angular.copy(question.answers[i]);
                answer.isChecked = false;
                if (answer.selected == true) {
                    answer.isChecked = true;
                };
                delete answer.selected;
                answers.push(answer);
            };
            return answers;
        }
        else if (question.type == 'TEXT') {
            var answers = [];
            var answer = angular.copy(question.answers[0]);
            answer.isChecked = false;
            answers.push(answer);
            return answers;
        }
        else if (question.type == 'RANGE') {
            var answers = [];
            var answer = angular.copy(question.answers[0]);
            answer.isChecked = false;
            answers.push(answer);
            return answers;
        };
        return [];
    }

    $scope.save = function(question) {
        if (typeof question !== 'undefined') {
            question.answered = true;
            var answers = generateAnswersToSave(question);
            console.log(answers);
            ApiService.saveAnswers($rootScope.globals.test.id, answers).then(function(response) {
                // console.log(response);
                // console.log('success');
            }, function(response) {
                // console.log(response);
                // console.log('fail');
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