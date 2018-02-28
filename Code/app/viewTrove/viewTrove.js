'use strict';

angular.module('myApp.viewTrove', ['ngRoute', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/viewTrove', {
    templateUrl: 'viewTrove/viewTrove.html',
    controller: 'ViewTroveCtrl'
  });
}])

.controller('ViewTroveCtrl', function($rootScope, $scope, $cookieStore, $timeout) {
	$rootScope.loggedIn = $cookieStore.get('loggedIn');
	$rootScope.loggedInUser = $cookieStore.get('loggedInUser');
	if (!$rootScope.loggedIn) {
		window.location.href = '#!/login';
	}
	
	$scope.fetchCollectibles = function(troveName) {
		var user = firebase.auth().currentUser;
		
		$rootScope.unsubscribe = firebase.auth().onAuthStateChanged(function(user){
			if (user) {
		
				$scope.troveName = troveName;
				firebase.database().ref('/collectibles').orderByChild('category').equalTo(troveName).once('value').then(function(snapshot) {
					console.log(snapshot.val());
					if (snapshot.val() == null) {
						$rootScope.error("There are currently no collectibles in this trove.");
					} else {
						$scope.troveCollectibles = snapshot.toJSON();
						$scope.$apply();
						snapshot.forEach(function(childSnapshot) {
							$scope.getCollectibleImage(childSnapshot.key);
						});
					}
				});
			}
			$rootScope.unsubscribe();
		});
	}
	
	$scope.getCollectibleImage = function(collectibleName) {
		console.log(collectibleName);
		firebase.storage().ref('collectibles/' + collectibleName + '/image').getDownloadURL().then(function(url) {
			$scope.images[collectibleName] = url;
			$scope.$apply();
			console.log($scope.images[collectibleName]);
		}).catch(function(error) {
			$scope.images[collectibleName] = "no_image.jpg";
			$scope.$apply();
		});
	}
	
	$scope.addToWishlist = function(collectibleName) {
		var user = firebase.auth().currentUser;
		
		firebase.database().ref('users/' + user.uid + '/wishlist/').child(collectibleName).set(true);
		$rootScope.error("Item successfully added.");
	}
	
	$scope.addToCollection = function(collectibleName, folderName) {
		var user = firebase.auth().currentUser;
		
		firebase.database().ref('collectibles/' + collectibleName + '/users/' + user.uid).set({
			multipleCount: 1
		});
		firebase.database().ref('users/' + user.uid + '/folders/' + folderName + '/collectibles/' + collectibleName).set(true);
		$rootScope.error("Item successfully added.");
	}
	
	$scope.addToFolder = function(collectibleName) {
		console.log(collectibleName);
		$scope.collectibleName = collectibleName;
		$timeout(function() {
			$('#addToCollectionModal').modal('show');
		});
	}
	
	$scope.fetchAllCollections = function(troveName) {
		var user = firebase.auth().currentUser;
		
		$rootScope.unsubscribe = firebase.auth().onAuthStateChanged(function(user){
			if (user) {
				firebase.database().ref('/users/' + user.uid + '/folders').orderByChild('category').equalTo(troveName).once('value').then(function(snapshot) {
					$scope.collections = snapshot.toJSON();
					$scope.$apply();
				});
				
				firebase.database().ref('/users/' + user.uid + '/folders').orderByChild('category').equalTo(troveName).limitToFirst(1).once('value').then(function(snapshot) {
					snapshot.forEach(function(childSnapshot) {
						console.log(childSnapshot.key);
						$scope.currentFolder = childSnapshot.key;
						$scope.addToFolderName = childSnapshot.key;
						$scope.$apply();
					});
				});
			}
			$rootScope.unsubscribe();
		});
	}
	
	$scope.createNewCollectible = function(collectibleName) {
		window.location.href = '#!/createCollectible?'+collectibleName;
	}
	
	$scope.viewCollectible = function(troveName) {
		window.location.href = '#!/viewCollectible?'+troveName;
	}
	
	$scope.$on('$viewContentLoaded', function() {
		var a = window.location.href;
		var b = a.substring(a.indexOf("?")+1);
		var troveName = decodeURIComponent(b);
		if (a.indexOf("?") == -1) {
			window.location.href = '#';
		} else {
			$scope.images = [];
			$scope.getCollectibleImage('Collectible1');
			$scope.fetchAllCollections(troveName);
			$scope.fetchCollectibles(troveName);
		}
	});
	
});