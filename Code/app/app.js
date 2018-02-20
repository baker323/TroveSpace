'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'ngRoute',
  'ngCookies',
  'myApp.view1',
  'myApp.view2',
  'myApp.login',
  'myApp.register',
  'myApp.createCollectible',
  'myApp.createTrove',
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

app.run(function($rootScope, $cookieStore, $timeout) {
    $rootScope.logout = function() {
		firebase.auth().signOut().then(function() {
			$rootScope.loggedIn = false;
			$cookieStore.put('loggedIn', false);
			console.log("User logged out.");
			window.location.href = '#!/login';
			firebase.database().goOffline();
		}).catch(function(error) {
			console.log(error.message);
		});
	}
	
	$rootScope.changePassword = function(oldPassword, newPassword) {
		var user = firebase.auth().currentUser;

		var user = firebase.auth().currentUser;
		var credential = firebase.auth.EmailAuthProvider.credential(
			user.email,
			oldPassword
		);
		user.reauthenticateWithCredential(credential).then(function() {
			console.log("Reauthentication successful.");
			user.updatePassword(newPassword).then(function() {
			  console.log("Password changed.");
			  $rootScope.error("Password successfully changed.");
			}).catch(function(error) {
			  var errorCode = error.code;
			  var errorMessage = error.message;
			  console.log(errorCode + ": " + errorMessage);
			});
		}).catch(function(error) {
			console.log(error.message);
		});
	}
	
	$rootScope.error = function(errorMessage) {
    	$rootScope.errorMessage = errorMessage;
		$timeout(function() {
			$('#errorModal').modal('show');
		});
    };
});