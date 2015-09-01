app.service('ApiService', ApiService);
function ApiService($window, $http, $rootScope) {
    var service = {};

    service.getTests = getTests;

    service.host = "http://192.168.0.109:8080";
    service.get_test_url = service.host + "/ask/api/tests?type="

    return service;

    function getTests(type) {
        return $http.get(service.get_test_url + type);
    }
}