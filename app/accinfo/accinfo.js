'use strict';

angular.module('myApp.accinfo', ['ngRoute', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/accinfo', {
    templateUrl: 'accinfo/accinfo.html',
    controller: 'ProfileCtrl'
  });
}])

.controller('ProfileCtrl', function($rootScope, $scope, $cookieStore) {
	$rootScope.loggedIn = $cookieStore.get('loggedIn');
	$rootScope.loggedInUser = $cookieStore.get('loggedInUser');
	if (!$rootScope.loggedIn) {
		window.location.href = '#!/login';
	}
	
	$scope.fetchUserInfo = function() {
		console.log("Fetch user info");
		var user = firebase.auth().currentUser;
		
		firebase.auth().onAuthStateChanged(function(user){
			if (user) {
				firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) {
					$scope.userInfo = snapshot.toJSON();
					$scope.$apply();
				});
			}
		});
	}
	
	$scope.updateUserInfo = function(email, username, firstName, lastName) {
		console.log("Update user info");
		var user = firebase.auth().currentUser;
		
		firebase.auth().onAuthStateChanged(function(user){
			if (user) {
				firebase.database().ref('users/' + user.uid).set({
					username: username,
					email: email,
					firstName: firstName,
					lastName: lastName
				});
				$rootScope.error("Information saved.");
			}
		});
	}
	
	$scope.deleteAccount = function(password) {
		
		var user = firebase.auth().currentUser;
		var credential = firebase.auth.EmailAuthProvider.credential(
			user.email,
			password
		);
		user.reauthenticateWithCredential(credential).then(function() {
			console.log("Reauthentication successful.");

			firebase.database().ref('users/' + user.uid).set(null);
			user.delete().then(function() {
			  console.log("Account successfully deleted.");
			  $rootScope.error("Account successfully deleted.");
			  $rootScope.loggedIn = false;
			  $cookieStore.put('loggedIn', false);
			  firebase.database().goOffline();
			  window.location.href = '#!/login';
			}).catch(function(error) {
			  console.log(error.message);
			  $rootScope.error(error.message);
			});	
		}).catch(function(error) {
			console.log(error.message);
			$rootScope.error(error.message);
		});
	}
	
	$scope.$on('$viewContentLoaded', function() {
		$scope.fetchUserInfo();
	});
});