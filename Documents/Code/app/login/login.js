'use strict';

angular.module('myApp.login', ['ngRoute', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', function($rootScope, $scope, $cookieStore) {
	if (window.location.href.includes('login') && $rootScope.loggedIn) {
		window.location.href = "#!/troves";
	}
	
	$scope.login = function(email, password) {
		firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
			if (user) {
				console.log("User logged in.");
				$rootScope.loggedIn = true;
				$cookieStore.put('loggedIn', true);
				$cookieStore.put('loggedInUser', user.displayName);
				window.location.href = '#!/troves';
			}
		}).catch(function(error) {
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  console.log(errorCode + ": " + errorMessage);
		  $rootScope.error(errorMessage);
		});
	}
	
	$scope.forgotPassword = function(email) {		
		var auth = firebase.auth();

		if (email == null) {
			$rootScope.error("Please enter your email.");
		} else {
			auth.sendPasswordResetEmail(email).then(function() {
			  console.log("Password reset email sent.");
			  $rootScope.error("Password reset email sent.");
			  $scope.forgotPasswordEmail = null;
			}).catch(function(error) {
			  console.log(error.message);
			  $rootScope.error(error.message);
			  $scope.forgotPasswordEmail = null;
			});
		}
	}	
});