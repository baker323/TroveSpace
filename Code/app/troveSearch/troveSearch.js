'use strict';

angular.module('myApp.troveSearch', ['ngRoute', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/troveSearch', {
    templateUrl: 'troveSearch/troveSearch.html',
    controller: 'TroveSearchCtrl'
  });
}])

.controller('TroveSearchCtrl', function($rootScope, $scope, $cookieStore, $timeout) {
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
						snapshot.forEach(function(childSnapshot) {
							$scope.fetchCollectibles(childSnapshot.key);
						});
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
	
	$scope.fetchCollectibles = function(troveName) {
		var user = firebase.auth().currentUser;
		
		$rootScope.unsubscribe = firebase.auth().onAuthStateChanged(function(user){
			if (user) {
		
				$scope.troveName = troveName;
				firebase.database().ref('/collectibles').orderByChild('category').equalTo(troveName).limitToFirst(1).once('value').then(function(snapshot) {
					console.log(snapshot.val());
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
			$rootScope.unsubscribe();
		});
	}
	
	$scope.getCollectibleImage = function(collectibleName, troveName) {
		firebase.storage().ref('collectibles/' + collectibleName + '/image').getDownloadURL().then(function(url) {
			$scope.images[troveName] = url;
			$scope.$apply();
			console.log($scope.images[troveName]);
		}).catch(function(error) {
			$scope.images[troveName] = "no_image_available.jpg";
			$scope.$apply();
		});
	}
	
	$scope.$on('$viewContentLoaded', function() {
		var a = window.location.href;
		var b = a.substring(a.indexOf("?")+1);
		var query = decodeURIComponent(b);
		if (a.indexOf("?") == -1) {
			window.location.href = '#';
		} else {
			$scope.images = [];
			if($rootScope.searchResults == null) {
				window.location.href = '#';
			}
			for (var i in $rootScope.searchResults) {
				console.log($rootScope.searchResults[i].collectibles);
				var collectibles = $rootScope.searchResults[i].collectibles;
				for (var j in collectibles) {
					$scope.getCollectibleImage(collectibles[j].name, $rootScope.searchResults[i].name);
				}
			}
		}
	});
});
