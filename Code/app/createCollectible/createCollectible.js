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
		});
	}

	$scope.createCollectible = function(collectibleName, description, troveName, customFields, fieldValues) {
		console.log(troveName,collectibleName, description);
		var user = firebase.auth().currentUser;

		firebase.database().ref('collectibles/' + collectibleName).once('value').then(function(snapshot) {
			if (snapshot.val() == null) {
				firebase.database().ref('collectibles').child(collectibleName).set({
					description: description,
					category: troveName,
					lastEditedBy: user.displayName
				});

				// set custom fields
				for (var i=0; i < customFields.length; i++) {
					firebase.database().ref('collectibles/' + collectibleName).child(customFields[i]).set(fieldValues[i]);
				}

				// add to trove
				firebase.database().ref('troves/' + troveName + '/collectibles/' + collectibleName).set(true);

			} else {
				$rootScope.error("Collectible with that name already exists.");
			}
			window.location.href = '#!/viewTrove?'+troveName;
		});
	}

	$scope.$on('$viewContentLoaded', function() {
		var a = window.location.href;
		var b = a.substring(a.indexOf("?")+1);
		$scope.troveName = decodeURIComponent(b);
	});
});
