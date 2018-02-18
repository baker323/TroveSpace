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
});