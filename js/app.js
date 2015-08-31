var app = angular.module('finkiAskApp', ['ngRoute','ngCookies']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/', {
            controller: 'HomeController',
            templateUrl: 'templates/home.html'
        }).
        when('/login', {
            controller: 'LoginController',
            templateUrl: 'templates/login.html'
        }).
        otherwise({
            redirectTo: '/'
        });
}]);

app.run(function run($rootScope, $cookieStore){
    // Preserve globals after page refresh
    $rootScope.globals = $cookieStore.get('globals') || {};
    // $cookieStore.put('globals', $rootScope.globals);
});
