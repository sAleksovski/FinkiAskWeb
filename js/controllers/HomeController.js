app.controller('HomeController', function($scope, $rootScope, $cookieStore, $modal, $location, ApiService) {

    $rootScope.title = 'Finki ASK';
    $rootScope.show_back_arrow = false;
    $rootScope.show_send_test = false;

    $rootScope.icon_clicked = function() {}

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
    }

    $scope.changeTab($scope.activeTab);

    $scope.open = function(id) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'passwordModalContent.html',
            controller: 'PasswordModalInstanceCtrl'
        });

        modalInstance.result.then(function(password) {
            $scope.password = password;
            ApiService.startTest(id, password).then(function(response) {
                if (response.data.responseStatus == 'SUCCESS') {
                    $rootScope.globals.test = response.data.data;
                    console.log(response.data.data);
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

});

angular.module('finkiAskApp').controller('PasswordModalInstanceCtrl', function($scope, $modalInstance) {
    $scope.ok = function() {
        $modalInstance.close($scope.inputPassword);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});