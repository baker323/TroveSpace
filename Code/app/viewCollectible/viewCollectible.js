'use strict';

angular.module('myApp.viewCollectible', ['ngRoute', 'ngCookies'])


.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/viewCollectible', {
    templateUrl: 'viewCollectible/viewCollectible.html',
    controller: 'ViewCollectibleCtrl'
  });
}])

.controller('ViewCollectibleCtrl', function($rootScope, $scope, $cookieStore) {
	$rootScope.loggedIn = $cookieStore.get('loggedIn');
	$rootScope.loggedInUser = $cookieStore.get('loggedInUser');
	if (!$rootScope.loggedIn) {
		window.location.href = '#!/login';
	}
	
	$scope.fetchCollectible = function(collectibleName) {
		var user = firebase.auth().currentUser;
		
		$rootScope.unsubscribe = firebase.auth().onAuthStateChanged(function(user){
			if (user) {
				firebase.database().ref('collectibles/' + collectibleName).once('value').then(function(snapshot) {
					$scope.collectible = snapshot.toJSON();
					$scope.$apply();
				});
			}
			$rootScope.unsubscribe();
		});
	}
	
	$scope.getMultipleCount = function(collectibleName) {
		var user = firebase.auth().currentUser;
		
		$rootScope.unsubscribe = firebase.auth().onAuthStateChanged(function(user){
			if (user) {
				firebase.database().ref('/collectibles/' + collectibleName + '/users/' + user.uid + '/multipleCount').once('value').then(function(snapshot) {
					if (snapshot.val() == null) {
						$scope.multipleCount = 0;
						$scope.$apply();
					} else {
						$scope.multipleCount = snapshot.toJSON();
						$scope.$apply();
					}
				});
			}
			$rootScope.unsubscribe();
		});
	}
	
	$scope.setMultipleCount = function(collectibleName, multipleValue) {
		var user = firebase.auth().currentUser;
		console.log("Set multiple count.");
		
		$rootScope.unsubscribe = firebase.auth().onAuthStateChanged(function(user){
			if (user) {
				firebase.database().ref('collectibles/' + collectibleName + '/users/' + user.uid).set({
					multipleCount: multipleValue});
			}
			$rootScope.unsubscribe();
		});
	}
	
	$scope.goBack = function() {
		console.log("Back");
		window.location.href = '#!/viewTrove?'+$scope.collectible.category;
	}

	$scope.$on('$viewContentLoaded', function() {
		var a = window.location.href;
		var b = a.substring(a.indexOf("?")+1);
		$scope.collectibleName = decodeURIComponent(b);
		if (a.indexOf("?") == -1) {
			window.location.href = '#';
		} else {
			$scope.fetchCollectible($scope.collectibleName);
			$scope.getMultipleCount($scope.collectibleName);
		}
	});
});
