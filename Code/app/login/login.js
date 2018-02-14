'use strict';

angular.module('myApp.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', function($scope) {
	
	$scope.login = function(email, password) {
		firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  console.log(errorCode + ": " + errorMessage);
		});
		
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				console.log("User logged in.");
			}
		});
	}
	
	$scope.forgotPassword = function(email) {
		var auth = firebase.auth();

		if (email == null) {
			alert("Please enter your email.");
		} else {
			auth.sendPasswordResetEmail(email).then(function() {
			  console.log("Password reset email sent.");
			}).catch(function(error) {
			  console.log(error.message);
			});
		}
	}
	
});