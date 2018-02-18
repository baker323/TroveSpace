'use strict';

angular.module('myApp.register', ['ngRoute', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/register', {
    templateUrl: 'register/register.html',
    controller: 'RegisterCtrl'
  });
}])

.controller('RegisterCtrl', function($rootScope, $scope, $cookieStore) {
	$scope.createAccount = function(username, email, password, confirmPassword) {
		if (password == confirmPassword) {
			firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
				user.sendEmailVerification().then(function() {
					console.log("Verification email sent");
					alert("Verification email sent.");
					firebase.database().ref('users/' + user.uid).set({
						username: username,
						email: email
					});
					window.location.href = '#!/login';
				}).catch(function(error) {
				  console.log(error.message);
				  alert(error.message);
				});
				return user.updateProfile({
					displayName: username
				});
			}).catch(function(error) {
			  var errorCode = error.code;
			  var errorMessage = error.message;
			  console.log(errorCode + ": " + errorMessage);
			  if (errorCode.includes("email-already-in-use")) {
				  alert("User already exists.");
			  } else {
				  console.log(error.message);
				  alert(error.message);
			  }
			});
		} else {
			alert("Passwords do not match.");
		}
	}
});