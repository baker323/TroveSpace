'use strict';

angular.module('myApp.register', ['ngRoute', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/register', {
    templateUrl: 'register/register.html',
    controller: 'RegisterCtrl'
  });
}])

.controller('RegisterCtrl', function($rootScope, $scope, $cookieStore) {
	if (window.location.href.includes('register') && $rootScope.loggedIn) {
		window.location.href = "#!/troves";
	}
	
	$scope.createAccount = function(username, email, password, confirmPassword) {
		if (password == confirmPassword) {
			firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
				user.sendEmailVerification().then(function() {
					console.log("Verification email sent");
					$rootScope.error("Verification email sent.");
					firebase.database().ref('users/' + user.uid).set({
						username: username,
						email: email
					});
					window.location.href = '#!/login';
				}).catch(function(error) {
				  console.log(error.message);
				  $rootScope.error(error.message);
				});
				return user.updateProfile({
					displayName: username
				});
			}).catch(function(error) {
			  var errorCode = error.code;
			  var errorMessage = error.message;
			  console.log(errorCode + ": " + errorMessage);
			  if (errorCode.includes("email-already-in-use")) {
				  $rootScope.error("User already exists.");
			  } else {
				  console.log(error.message);
				  $rootScope.error(error.message);
			  }
			});
		} else {
			$rootScope.error("Passwords do not match.");
		}
	}
});