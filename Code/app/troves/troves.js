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
		var user = $scope.currentUser;
		firebase.database().ref('troves').once('value').then(function(snapshot) {
			if (snapshot.val() == null) {
				$rootScope.error("There are not currently any troves.");
			} else {
				$scope.troves = snapshot.toJSON();
				$scope.$apply();
				snapshot.forEach(function(childSnapshot) {
					$scope.fetchCollectibles(childSnapshot.key);
				});
			}
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
	
	$scope.fetchCollectibles = function(troveName) {
		var user = $scope.currentUser;
		
		$scope.troveName = troveName;
		firebase.database().ref('/collectibles').orderByChild('category').equalTo(troveName).limitToFirst(1).once('value').then(function(snapshot) {
			if (snapshot.val() == null) {
				$scope.getCollectibleImage(snapshot.val(), troveName);
			} else {
				$scope.troveCollectibles = snapshot.toJSON();
				$scope.$apply();
				snapshot.forEach(function(childSnapshot) {
					$scope.getCollectibleImage(childSnapshot.key, troveName);
				});
			}
		});
	}
	
	$scope.getCollectibleImage = function(collectibleName, troveName) {
		firebase.storage().ref('collectibles/' + collectibleName + '/image').getDownloadURL().then(function(url) {
			$scope.images[troveName] = url;
			$scope.$apply();
		}).catch(function(error) {
			$scope.images[troveName] = "no_image_available.jpg";
			$scope.$apply();
		});
	}
	
	$scope.getCurrentUser = function() {
		$rootScope.unsubscribe = firebase.auth().onAuthStateChanged(function(user){
			if (user) {
				$scope.currentUser = user;
				$scope.fetchAllTroves();
			}
			$rootScope.unsubscribe();
		});
	}
	
	$scope.$on('$viewContentLoaded', function() {
		if ($rootScope.loggedIn) {
			$scope.images = [];
			$scope.getCurrentUser();
			
			$rootScope.searchCategory = "troves";
			$rootScope.searchIn = "Troves";
			if ($rootScope.autoCompleteSearch) {
				$rootScope.initialized = false;
				$rootScope.autoCompleteSearch.autocomplete.destroy();
				$rootScope.autoCompleteSearch = null;
			}
			$rootScope.searchComplete("troves");
		}
	});
});
