app.service('ApiService', ApiService);

function ApiService($window, $http, $rootScope) {

    $http.defaults.withCredentials = true;

    var service = {};

    service.getTests = getTests;
    service.startTest = startTest;
    service.finishTest = finishTest;
    service.saveAnswers = saveAnswers;

    service.host = "http://192.168.1.121:8080";
    service.get_test_url = service.host + "/ask/api/tests?type=";
    service.start_test = service.host + "/ask/api/tests/";
    service.save_answers = service.host + "/ask/api/tests/";

    return service;

    function getTests(type) {
        return $http.get(service.get_test_url + type);
    }

    function startTest(id, password) {
        return $http.get(service.start_test + id + '?password=' + password, {withCredentials: true});
    }

    function finishTest(id, answers) {
        return $http.post(service.save_answers + id + '?finish=true', answers, {withCredentials: true});
    }

    function saveAnswers(id, answers) {
        return $http.post(service.save_answers + id, answers, {withCredentials: true});
    }
}