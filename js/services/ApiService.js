app.service('ApiService', ApiService);

function ApiService($window, $http, $rootScope) {
    var service = {};

    service.getTests = getTests;
    service.startTest = startTest;
    service.saveAnswers = saveAnswers;

    service.host = "http://192.168.1.67:8080";
    service.get_test_url = service.host + "/ask/api/tests?type="
    service.start_test = service.host + "/ask/api/tests/"
    service.save_answers = service.host + "/ask/api/tests/"

    return service;

    function getTests(type) {
        return $http.get(service.get_test_url + type);
    }

    function startTest(id, password) {
        return $http.get(service.start_test + id + '?password=' + password);
    }

    function saveAnswers(id, answers) {
        // TODO
        // Add cookie
        return $http.post(service.save_answers + id, answers);
    }
}