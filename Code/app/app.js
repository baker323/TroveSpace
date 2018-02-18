'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'ngRoute',
  'ngCookies',
  'myApp.view1',
  'myApp.view2',
  'myApp.login',
  'myApp.register',
  'myApp.collection',
  'myApp.wishlist',
  'myApp.troves',
  'myApp.accinfo',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/troves'});
}]);

app.run(function($rootScope, $cookieStore) {
    $rootScope.logout = function() {
		firebase.auth().signOut().then(function() {
			$rootScope.loggedIn = false;
			$cookieStore.put('loggedIn', false);
			console.log("User logged out.");
			window.location.href = '#!/login';
		}).catch(function(error) {
			console.log(error.message);
		});
	}
});