app.service('ApiService', ApiService);
function ApiService($window, $http, $rootScope) {
    var service = {};

    service.getTests = getTests;

    service.host = "http://192.168.1.67:8080";
    service.get_test_url = service.host + "/ask/api/tests?type="

    return service;

    function getTests(type, callback) {
        $http.get(service.get_test_url + type).then(function(response) {
            callback(response);
        }, function(response) {
            callback([]);
        });
    }
}