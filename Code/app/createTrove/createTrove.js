'use strict';

angular.module('myApp.createTrove', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/createTrove', {
    templateUrl: 'createTrove/createTrove.html',
    controller: 'CreateTroveCtrl'
  });
}])

.controller('CreateTroveCtrl', function($rootScope, $scope) {

  $scope.choices = [{id: 'field1'}, {id: 'field2'}];
  
  $scope.addNewChoice = function() {
    var newItemNo = $scope.choices.length+1;
    $scope.choices.push({'id':'field'+newItemNo});
  };
    
  $scope.removeChoice = function() {
    var lastItem = $scope.choices.length-1;
    $scope.choices.splice(lastItem);
  };

});