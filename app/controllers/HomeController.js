app.controller('HomeController', function($scope, $rootScope, $cookieStore, $modal, $location, ApiService) {

    $rootScope.title = 'Finki ASK';
    $rootScope.show_back_arrow = false;
    $rootScope.show_send_test = false;

    window.clearInterval($rootScope.interval_timer);

    $rootScope.icon_clicked = function() {};

    $scope.activeTab = $rootScope.globals.activeTab || 'TEST';
    $scope.tests = [];

    $scope.changeTab = function(tab) {
        $scope.activeTab = tab;
        $rootScope.globals.activeTab = tab;
        $cookieStore.put('globals', $rootScope.globals);
        ApiService.getTests(tab).then(function(response) {
            $scope.tests = response.data;
        }, function(response) {
            $scope.tests = [];
        });
    };

    $scope.changeTab($scope.activeTab);

    $scope.swipeLeft = function() {
        if ($scope.activeTab == 'TEST') {
            $scope.changeTab('ANONYMOUSTEST');
        }
        else if ($scope.activeTab == 'ANONYMOUSTEST') {
            $scope.changeTab('SURVEY');
        };
    };

    $scope.swipeRight = function() {
        if ($scope.activeTab == 'ANONYMOUSTEST') {
            $scope.changeTab('TEST');
        }
        else if ($scope.activeTab == 'SURVEY') {
            $scope.changeTab('ANONYMOUSTEST');
        };
    };

    $scope.open = function(id) {

        if (id == $scope.active) {
            var now = parseInt(new Date().getTime() / 1000);
            var to_end = parseInt(new Date($rootScope.globals.test.timer_end) / 1000);

            if (to_end - now < 0) {
                var index = -1;
                for (var i = 0; i < $scope.tests.length; i++) {
                    if ($scope.tests[i].id == id) {
                        index = i;
                    }
                }

                if (index > -1) {
                    $scope.tests.splice(index, 1);
                }

                delete $scope.active;
                delete $rootScope.globals.test;
                $cookieStore.put('globals', $rootScope.globals);
            } else {
                $location.path('/test');
            }

            return;
        }

        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'passwordModalContent.html',
            controller: 'PasswordModalInstanceCtrl'
        });

        modalInstance.result.then(function(password) {
            $scope.password = password;
            ApiService.startTest(id, password).then(function(response) {
                if (response.data.responseStatus == 'SUCCESS') {
                    delete $rootScope.question;
                    $rootScope.globals.test = response.data.data;
                    var endTime = new Date();
                    endTime.setMinutes(endTime.getMinutes() + $rootScope.globals.test.duration);
                    $rootScope.globals.test.timer_end = endTime;
                    $cookieStore.put('globals', $rootScope.globals);
                    $location.path('/test');
                } else if (response.data.responseStatus == 'ERROR') {
                    alert(response.data.description);
                }
            }, function(response) {

            })
        }, function() {});
    };

    if (typeof $rootScope.globals.test !== 'undefined') {
        var now = parseInt(new Date().getTime() / 1000);
        var to_end = parseInt(new Date($rootScope.globals.test.timer_end) / 1000);

        if (to_end - now < 0) {
            delete $scope.active;
            delete $rootScope.globals.test;
            delete $rootScope.globals.test;
            $cookieStore.put('globals', $rootScope.globals);
        } else {
            $scope.active = $rootScope.globals.test.id;
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'testInProgressModalContent.html',
                controller: 'TestInProgressModalInstanceCtrl'
            });
        }

        $scope.timer = to_end - now;
    }

});

angular.module('finkiAskApp').controller('PasswordModalInstanceCtrl', function($scope, $modalInstance) {
    $scope.ok = function() {
        $modalInstance.close($scope.inputPassword);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});

angular.module('finkiAskApp').controller('TestInProgressModalInstanceCtrl', function($scope, $rootScope, $modalInstance, $location) {

    var now = parseInt(new Date().getTime() / 1000);
    var to_end = parseInt(new Date($rootScope.globals.test.timer_end) / 1000);

    $scope.minutes = parseInt((to_end - now) / 60) + 1;

    $scope.ok = function() {
        $location.path('/test');
        $modalInstance.dismiss('cancel');
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});