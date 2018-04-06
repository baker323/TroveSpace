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
		if (collectibleName == null) {
			$rootScope.error("Title is required.");
		} else if (collectibleName.includes('.') || collectibleName.includes('#') || collectibleName.includes('$') || collectibleName.includes('[') || collectibleName.includes(']')) {
			$rootScope.error("Title cannot contain special characters.");
		} else if (description == undefined) {
			description = null;
		} else {
			var user = firebase.auth().currentUser;

			firebase.database().ref('collectibles/' + collectibleName).once('value').then(function(snapshot) {
				if (snapshot.val() == null) {
					var file = document.getElementById('collectibleImage').files[0];
					var fileExtension = null;
					var fileSize = null;
					if (file != null) {
						fileSize = file.size;
						fileExtension = file.name.split('.')[file.name.split('.').length-1].toLowerCase();
					}

					if (fileSize != null && file.size > 100 * 1024 * 1024) {
						$rootScope.error("File size must be less than 100MB.");
					} else if (fileExtension != null && fileExtension != "png" && fileExtension != "jpg" && fileExtension != "jpeg" && fileExtension != "jpe" && fileExtension != "jfif" && fileExtension != "tif" && fileExtension != "tiff" && fileExtension != "gif" && fileExtension != "bmp" && fileExtension != "dib") {
						$rootScope.error("File type must be an image.");
					} else {
						firebase.database().ref('collectibles').child(collectibleName).set({
							name: collectibleName,
							description: description,
							category: troveName,
							lastEditedBy: user.displayName,
							collectCount: 0,
							wishlistCount: 0
						});

						// set custom fields
						for (var i in fieldValues) {
							if (fieldValues.hasOwnProperty(i)) {
								firebase.database().ref('collectibles/' + collectibleName).child(i).set(fieldValues[i]);
							}
						}

						// add to trove
						firebase.database().ref('troves/' + troveName + '/collectibles/' + collectibleName).set({
							dateAdded: (new Date).getTime(),
							name: collectibleName,
							category: troveName
						});

						$scope.uploadImage(collectibleName);
					}

				} else {
					$rootScope.error("Collectible with that name already exists.");
				}
			});
		}
	}
	
	$scope.uploadImage = function(collectibleName) {
		var file = document.getElementById('collectibleImage').files[0];
		if (file != null) {
			firebase.storage().ref('collectibles/' + collectibleName + '/image').put(file).then(function(snapshot) {
				console.log("Uploaded file.");
				$scope.file = file;
				window.location.href = '#!/viewTrove?'+$scope.troveName;
			}).catch(function(error) {
				console.log(error.message);
			});
		} else {
			window.location.href = '#!/viewTrove?'+$scope.troveName;
		}
	}
	
	$scope.cancel = function() {
		window.location.href = '#!/viewTrove?'+$scope.troveName;
	}

	$scope.$on('$viewContentLoaded', function() {
		var a = window.location.href;
		var b = a.substring(a.indexOf("?")+1);
		$scope.fieldValues = [];
		$scope.description = null;
		$scope.troveName = decodeURIComponent(b);
		if (a.indexOf("?") == -1) {
			window.location.href = '#!/troves';
		} else {
			$scope.fetchTrove($scope.troveName);
		}
	});
});
