'use strict';

angular.module('myApp.createTrove', ['ngRoute', 'ngCookies'])


.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/createTrove', {
    templateUrl: 'createTrove/createTrove.html',
    controller: 'CreateTroveCtrl'
  });
}])

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
	
	$scope.addNewChoice = function() {
		console.log("Add new choice");
	}

});
