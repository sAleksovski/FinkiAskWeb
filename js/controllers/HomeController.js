app.controller('HomeController', function($scope, $rootScope, $cookieStore, $modal, ApiService) {

    $rootScope.title = 'Finki ASK';

    $scope.activeTab = $rootScope.globals.activeTab || 'TEST';
    $scope.tests = [];

    $scope.changeTab = function(tab) {
        $scope.activeTab = tab;
        $rootScope.globals.activeTab = tab;
        $cookieStore.put('globals', $rootScope.globals);
        ApiService.getTests(tab, function(response) {
            $scope.tests = response.data;
        });
    }

    $scope.changeTab($scope.activeTab);

    $scope.open = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'passwordModalContent.html',
            controller: 'PasswordModalInstanceCtrl'
        });

        modalInstance.result.then(function (password) {
            $scope.password = password;
        }, function () {
        });
    };

});

angular.module('finkiAskApp').controller('PasswordModalInstanceCtrl', function ($scope, $modalInstance) {
    $scope.ok = function () {
        $modalInstance.close($scope.inputPassword);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});