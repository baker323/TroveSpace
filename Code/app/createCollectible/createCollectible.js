'use strict';


angular.module('myApp.createCollectible', ['ngRoute', 'ngCookies'])


.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/createCollectible', {
    templateUrl: 'createCollectible/createCollectible.html',
    controller: 'CreateCollectibleCtrl'
  });
}])

.controller('CreateCollectibleCtrl', function($rootScope, $scope, $cookieStore) {
	$rootScope.loggedIn = $cookieStore.get('loggedIn');
	$rootScope.loggedInUser = $cookieStore.get('loggedInUser');
	if (!$rootScope.loggedIn) {
		window.location.href = '#!/login';
	}

	$scope.fetchTrove = function(troveName) {

		firebase.database().ref('/troves/' + troveName).once('value').then(function(snapshot) {
			$scope.trove = snapshot.toJSON();
			$scope.$apply();
		});
	}

	$scope.createCollectible = function(collectibleName, description, troveName, fieldValues) {
		
		var user = firebase.auth().currentUser;

		firebase.database().ref('collectibles/' + collectibleName).once('value').then(function(snapshot) {
			if (snapshot.val() == null) {
				firebase.database().ref('collectibles').child(collectibleName).set({
					description: description,
					category: troveName,
					lastEditedBy: user.displayName
				});

				// set custom fields
				for (var i in fieldValues) {
					if (fieldValues.hasOwnProperty(i)) {
						firebase.database().ref('collectibles/' + collectibleName).child(i).set(fieldValues[i]);
					}
				}

				// add to trove
				firebase.database().ref('troves/' + troveName + '/collectibles/' + collectibleName).set(true);

			} else {
				$rootScope.error("Collectible with that name already exists.");
			}
			window.location.href = '#!/viewTrove?'+troveName;
		});
	}
	
	$scope.cancel = function() {
		window.location.href = '#!/viewTrove?'+$scope.troveName;
	}

	$scope.$on('$viewContentLoaded', function() {
		var a = window.location.href;
		var b = a.substring(a.indexOf("?")+1);
		$scope.fieldValues = [];
		$scope.troveName = decodeURIComponent(b);
		if (a.indexOf("?") == -1) {
			window.location.href = '#!/troves';
		} else {
			$scope.fetchTrove($scope.troveName);
		}
	});
});
