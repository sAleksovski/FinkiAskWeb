app.controller('TestController', function($scope, $rootScope, $cookieStore, $modal, $location, ApiService) {

    $rootScope.title = 'Test';
    $rootScope.show_send_test = true;
    $scope.show = 0;

    if (typeof $rootScope.globals.test === 'undefined') {
        $location.path('/');
        return;
    };

    var now = parseInt(new Date().getTime() / 1000);
    var to_end = parseInt(new Date($rootScope.globals.test.timer_end) / 1000);

    $scope.timer = to_end - now;
    
    $rootScope.interval_timer = setInterval(function() {
        $scope.timer--;
        var min = Math.floor($scope.timer / 60);
        var sec = $scope.timer % 60;
        if (min < 0) {
            min = 0;
        }
        if (sec < 0) {
            sec = 0;
        }
        if (min < 10) {
            min = '0' + min;
        };
        if (sec < 10) {
            sec = '0' + sec;
        };

        $rootScope.timeleft = min + ':' + sec;
        $rootScope.$apply();

        if ($scope.timer == 0) {
            $scope.timer += 1;
            $rootScope.finish_test_clicked();
        } else if ($scope.timer < 0) {
            $location.path('/');
        }

    }, 1000);

    $rootScope.icon_clicked = function() {
        $scope.show = 0;
        $rootScope.show_back_arrow = false;
        $rootScope.save($rootScope.question);
    }

    $rootScope.finish_test_clicked = function() {

        if (typeof $rootScope.question != "undefined" ) {
            $rootScope.save($rootScope.question, function() {
                finishTest();
            });
            return;
        };
        finishTest();
    }

    $scope.queue = [];

    function finishTest() {
        var key;
        var allFinished = 0;
        for (key in $scope.queue) {
            if ($scope.queue.hasOwnProperty(key)  &&        // These are explained
                /^0$|^[1-9]\d*$/.test(key) &&    // and then hidden
                key <= 4294967294                // away below
                ) {
                allFinished += $scope.queue[key].length;
            }
        }

        if (allFinished == 0) {
            ApiService.finishTest($rootScope.globals.test.id, []).then(function (response) {
                console.log(response.data.data);
                $rootScope.globals.result = response.data.data;
                $rootScope.globals.type = $rootScope.globals.test.type;
                delete $rootScope.globals.test;
                $cookieStore.put('globals', $rootScope.globals);
                window.clearInterval($rootScope.interval_timer);
                $location.path('/result');
            }, function (response) {
                delete $rootScope.globals.test;
                $cookieStore.put('globals', $rootScope.globals);
                window.clearInterval($rootScope.interval_timer);
                $location.path('/');
            });
        } else {
            setTimeout(finishTest, 1000);
        }
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

    $rootScope.save = function(question, callback) {
        if (typeof question !== 'undefined') {
            question.answered = true;

            if (typeof $scope.queue[question.id] === "undefined") {
                $scope.queue[question.id] = [];
            };
            $scope.queue[question.id].push(question);

            if ($scope.queue[question.id].length == 1) {
                callSaveAnswers(question, callback);
            }

        };
        $cookieStore.put('globals', $rootScope.globals);
    }

    function callSaveAnswers(question, callback) {
        var answers = generateAnswersToSave(question);
        ApiService.saveAnswers($rootScope.globals.test.id, answers).then(function(response) {
            if (response.data.responseStatus == "ERROR") {
                if (response.data.description == "Session does not exist.") {
                    alert("Your session has expired.");
                    delete $rootScope.globals.test;
                    $cookieStore.put('globals', $rootScope.globals);
                    window.clearInterval($rootScope.interval_timer);
                    $location.path('/');
                }
            };
            $scope.queue[question.id].splice(0, 1);
            if ($scope.queue[question.id].length > 0) {
                var newQuestion = $scope.queue[question.id][$scope.queue[question.id].length - 1];
                $scope.queue[question.id] = [];
                $rootScope.save(newQuestion);
            };
            if (typeof callback != "undefined") {
                callback();
            };
        }, function(response) {
            $scope.queue[question.id].splice(0, 1);
            if ($scope.queue[question.id].length > 0) {
                var newQuestion = $scope.queue[question.id][$scope.queue[question.id].length - 1];
                $scope.queue[question.id] = [];
                $rootScope.save(newQuestion);
            };
            if (typeof callback != "undefined") {
                callback();
            };
        });
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

        $rootScope.save();
    };

    $scope.sliderChanged = function(question) {
        var answer = question.answers[0];
        answer.text = question.min + ':' + question.max + ':' + question.value;
    }

    $scope.changeQuestion = function(id) {
        $scope.show = id;
        for (var i = 0; i < $rootScope.globals.test.questions.length; i++) {
            if ($rootScope.globals.test.questions[i].id == id) {
                $rootScope.question = $rootScope.globals.test.questions[i];
            }
        };
        $rootScope.show_back_arrow = true;
    }

    angular.element(document).ready(function() {
        setTimeout(function() {
            window.material_init();
        }, 0);
    });

});