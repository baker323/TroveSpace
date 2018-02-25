'use strict';

angular.module('myApp.troves', ['ngRoute', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/troves', {
    templateUrl: 'troves/troves.html',
    controller: 'TroveCtrl'
  });
}])

.controller('TroveCtrl', function($rootScope, $scope, $cookieStore, $timeout) {
	$rootScope.loggedIn = $cookieStore.get('loggedIn');
	$rootScope.loggedInUser = $cookieStore.get('loggedInUser');
	if (!$rootScope.loggedIn) {
		window.location.href = '#!/login';
	}
	
	$scope.fetchAllTroves = function() {
		var user = firebase.auth().currentUser;
		
		$rootScope.unsubscribe = firebase.auth().onAuthStateChanged(function(user){
			if (user) {
				firebase.database().ref('troves').once('value').then(function(snapshot) {
					if (snapshot.val() == null) {
						$rootScope.error("There are not currently any troves.");
					} else {
						$scope.troves = snapshot.toJSON();
						$scope.$apply();
					}
				});
			}
			$rootScope.unsubscribe();
		});
	}
	
	$scope.fetchTrove = function(troveName) {
		
		$scope.troveName = troveName;
		firebase.database().ref('/troves/' + troveName).once('value').then(function(snapshot) {
			$scope.trove = snapshot.toJSON();
		});
	}
	
	$scope.fetchCollectiblesInTrove = function(troveName) {
		window.location.href = '#!/viewTrove?'+troveName;
	}
	
	$scope.$on('$viewContentLoaded', function() {
		$scope.fetchAllTroves();
		console.log("troves");
	});
});
