'use strict';

angular.module('myApp.createCollectible', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/createCollectible', {
    templateUrl: 'createCollectible/createCollectible.html',
    controller: 'CreateCollectibleCtrl'
  });
}])

.controller('CreateCollectibleCtrl', [function() {

}]);