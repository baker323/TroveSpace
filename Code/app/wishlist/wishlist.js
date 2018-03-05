'use strict';

angular.module('myApp.wishlist', ['ngRoute', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/wishlist', {
    templateUrl: 'wishlist/wishlist.html',
    controller: 'WishlistCtrl'
  });
}])

.controller('WishlistCtrl', function($rootScope, $scope, $cookieStore) {
	$rootScope.loggedIn = $cookieStore.get('loggedIn');
	$rootScope.loggedInUser = $cookieStore.get('loggedInUser');
	if (!$rootScope.loggedIn) {
		window.location.href = '#!/login';
	}
	
	$scope.fetchWishlist = function() {
		console.log("Fetch wishlist");
		var user = firebase.auth().currentUser;
		
		$rootScope.unsubscribe = firebase.auth().onAuthStateChanged(function(user){
			if (user) {
				firebase.database().ref('users/' + user.uid + '/wishlist/').once('value').then(function(snapshot) {
					if (snapshot.val() == null) {
						$rootScope.error("There are currently no collectibles on your wishlist.");
					}
					$scope.wishlist = snapshot.toJSON();
					$scope.$apply();
					snapshot.forEach(function(childSnapshot) {
						$scope.getCollectibleImage(childSnapshot.key);
					});
				});
			}
			$rootScope.unsubscribe();
		});
	}
	
	$scope.removeFromWishlist = function(collectibleName) {
		var user = firebase.auth().currentUser;
		
		$rootScope.unsubscribe = firebase.auth().onAuthStateChanged(function(user){
			if (user) {
				firebase.database().ref('users/' + user.uid + '/wishlist').child(collectibleName).remove()
				.then(function() {
					console.log("Remove succeeded.");
					$scope.fetchWishlist();
				})
				.catch(function(error) {
					console.log("Remove failed: " + error.message);
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
		}).catch(function(error) {
			$scope.images[collectibleName] = "no_image_available.jpg";
			$scope.$apply();
		});
	}
	
	$scope.viewCollectible = function(troveName) {
		window.location.href = '#!/viewCollectible?'+troveName;
	}
	
	$scope.$on('$viewContentLoaded', function() {
		$scope.images = [];
		$scope.fetchWishlist();
	});
});
