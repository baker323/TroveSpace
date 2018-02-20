'use strict';

angular.module('myApp.createTrove', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/createTrove', {
    templateUrl: 'createTrove/createTrove.html',
    controller: 'CreateTroveCtrl'
  });
}])

.controller('CreateTroveCtrl', [function() {

}]);