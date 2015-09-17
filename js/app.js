var app = angular.module('finkiAskApp', ['ngRoute', 'ngCookies', 'ui.bootstrap', 'nouislider', 'angular-svg-round-progress']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'HomeController',
            templateUrl: 'templates/home.html'
        })
        .when('/login', {
            controller: 'LoginController',
            templateUrl: 'templates/login.html'
        })
        .when('/test', {
            controller: 'TestController',
            templateUrl: 'templates/test.html'
        })
        .when('/result', {
            controller: 'ResultController',
            templateUrl: 'templates/result.html'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

app.run(function run($rootScope, $cookieStore) {
    // Preserve globals after page refresh
    $rootScope.globals = $cookieStore.get('globals') || {};
    // $cookieStore.put('globals', $rootScope.globals);
});