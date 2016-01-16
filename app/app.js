var app = angular.module('finkiAskApp', ['ui.router', 'ngCookies', 'ui.bootstrap', 'nouislider', 'angular-svg-round-progress']);

app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider

        .state('home', {
            url: '/',
            controller: 'HomeController',
            templateUrl: 'templates/home.html'
        })

        .state('login', {
            url: '/login',
            controller: 'LoginController',
            templateUrl: 'templates/login.html'
        })

        .state('test', {
            url: '/test',
            controller: 'TestController',
            templateUrl: 'templates/test.html'
        })

        .state('result', {
            url: '/result',
            controller: 'ResultController',
            templateUrl: 'templates/result.html'
        });
});

app.run(function run($rootScope, $cookieStore) {
    // Preserve globals after page refresh
    $rootScope.globals = $cookieStore.get('globals') || {};
    // $cookieStore.put('globals', $rootScope.globals);
});