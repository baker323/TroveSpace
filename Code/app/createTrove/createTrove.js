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
		console.log(customFields);
		var array = [];
		for (var i=0; i<customFields.length; i++) {
			array.push(customFields[i].name);
		}
		customFields = array;
		var user = firebase.auth().currentUser;

		firebase.database().ref('troves').child(troveName)
		.set({
			name: troveName,
			description: description
		});
		for (var i=0; i < customFields.length; i++) {
			firebase.database().ref('troves/' + troveName).child(customFields[i]).set(true);
		}
		window.location.href = '#!/viewTrove?'+troveName;
	}
	
	$scope.choices = [];
  
  	$scope.addNewChoice = function() {
    	var newItemNo = $scope.choices.length+1;
    	$scope.choices.push({'id':'choice'+newItemNo});
  	};
    
  	$scope.removeChoice = function() {
    	var lastItem = $scope.choices.length-1;
    	$scope.choices.splice(lastItem);
  	};

});
