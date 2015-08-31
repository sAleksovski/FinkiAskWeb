app.controller('HomeController', function($scope, $rootScope, ApiService) {

    $rootScope.title = 'Finki ASK';

    $scope.activeTab = 'TEST';
    $scope.tests = [];

    $scope.changeTab = function(tab) {
        $scope.activeTab = tab;
        ApiService.getTests(tab, function(response) {
            $scope.tests = response;
        });
    }

});