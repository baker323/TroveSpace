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
		
		firebase.auth().onAuthStateChanged(function(user){
			firebase.database().ref('users/' + user.uid + '/wishlist/').once('value').then(function(snapshot) {
				$scope.wishlist = snapshot.toJSON();
				$scope.$apply();
			});
		});
	}
	
	$scope.removeFromWishlist = function(collectibleName) {
		var user = firebase.auth().currentUser;
		
		firebase.auth().onAuthStateChanged(function(user){
			firebase.database().ref('users/' + user.uid + '/wishlist').child(collectibleName).remove()
			  .then(function() {
				console.log("Remove succeeded.");
				$scope.fetchWishlist();
			  })
			  .catch(function(error) {
				console.log("Remove failed: " + error.message);
			  });
		});
	}
	
	$scope.$on('$viewContentLoaded', function() {
		$scope.fetchWishlist();
	});
});