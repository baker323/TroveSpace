'use strict';

angular.module('myApp.viewTrove', ['ngRoute', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/viewTrove', {
    templateUrl: 'viewTrove/viewTrove.html',
    controller: 'ViewTroveCtrl'
  });
}])

.controller('ViewTroveCtrl', function($rootScope, $scope, $cookieStore, $timeout) {
	$rootScope.loggedIn = $cookieStore.get('loggedIn');
	$rootScope.loggedInUser = $cookieStore.get('loggedInUser');
	if (!$rootScope.loggedIn) {
		window.location.href = '#!/login';
	}
	
	$scope.fetchCollectibles = function(troveName) {
		$scope.troveName = troveName;
		firebase.database().ref('/collectibles').orderByChild('category').equalTo(troveName).once('value').then(function(snapshot) {
			$scope.troveCollectibles = snapshot.toJSON();
			$scope.$apply();
		});
	}
	
	$scope.addToWishlist = function(collectibleName) {
		var user = firebase.auth().currentUser;
		
		firebase.database().ref('users/' + user.uid + '/wishlist/').child(collectibleName).set(true);
	}
	
	$scope.addToCollection = function(collectibleName, folderName) {
		console.log(collectibleName, folderName);
		var user = firebase.auth().currentUser;
		
		firebase.database().ref('/users/' + user.uid + '/folders').child(folderName).once('value').then(function(snapshot) {
			
			firebase.database().ref('collectibles/' + collectibleName).once('value').then(function(childSnapshot) {
				if (snapshot.val().category != childSnapshot.val().category) {
					$rootScope.error("Item trove does not match folder.");
				}
				else {
					firebase.database().ref('users/' + user.uid + '/folders/' + folderName + '/collectibles/').child(collectibleName).set({
						multipleCount: 1
					});
				}
			});
		});
	}
	
	$scope.addToFolder = function(collectibleName) {
		console.log(collectibleName);
		$scope.collectibleName = collectibleName;
		$timeout(function() {
			$('#addToCollectionModal').modal('show');
		});
	}
	
	$scope.fetchAllCollections = function() {
		var user = firebase.auth().currentUser;
		
		firebase.auth().onAuthStateChanged(function(user){
			if (user) {
				firebase.database().ref('/users/' + user.uid + '/folders').once('value').then(function(snapshot) {
					$scope.collections = snapshot.toJSON();
					$scope.$apply();
				});
				firebase.database().ref('/users/' + user.uid + '/folders').limitToFirst(1).once('value').then(function(snapshot) {
					snapshot.forEach(function(childSnapshot) {
						console.log(childSnapshot.key);
						$scope.currentFolder = childSnapshot.key;
						$scope.addToFolderName = childSnapshot.key;
						$scope.$apply();
					});
				});
			}
		});
	}
	
	$scope.createNewCollectible = function(troveName) {
		window.location.href = '#!/createCollectible?'+troveName;
	}
	
	$scope.$on('$viewContentLoaded', function() {
		var a = window.location.href;
		var b = a.substring(a.indexOf("?")+1);
		var troveName = decodeURIComponent(b);
		$scope.fetchAllCollections();
		$scope.fetchCollectibles(troveName);
	});
	
});