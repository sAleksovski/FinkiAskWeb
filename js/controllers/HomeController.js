app.controller('HomeController', function($scope, $rootScope, $modal, ApiService) {

    $rootScope.title = 'Finki ASK';

    $scope.activeTab = 'TEST';
    $scope.tests = [];

    $scope.changeTab = function(tab) {
        $scope.activeTab = tab;
        ApiService.getTests(tab, function(response) {
            $scope.tests = response;
        });
    }

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