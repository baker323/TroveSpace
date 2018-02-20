'use strict';

<<<<<<< HEAD
angular.module('myApp.createTrove', ['ngRoute'])
=======
angular.module('myApp.createTrove', ['ngRoute', 'ngCookies'])
>>>>>>> master

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/createTrove', {
    templateUrl: 'createTrove/createTrove.html',
    controller: 'CreateTroveCtrl'
  });
}])

<<<<<<< HEAD
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

=======
.controller('CreateTroveCtrl', function($rootScope, $scope, $cookieStore) {
	$rootScope.loggedIn = $cookieStore.get('loggedIn');
	$rootScope.loggedInUser = $cookieStore.get('loggedInUser');
	if (!$rootScope.loggedIn) {
		window.location.href = '#!/login';
	}
	
	$scope.createTrove = function(troveName, description, customFields) {
		var user = firebase.auth().currentUser;
		
		firebase.database().ref('troves').child(troveName)
		.set({
			description: description
		});
		for (var i=0; i < customFields.length; i++) {
			firebase.database().ref('troves/' + troveName).child(customFields[i]).set(true);
		}
		window.location.href = '#!/troves';
	}
>>>>>>> master
});