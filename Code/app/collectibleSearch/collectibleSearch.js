'use strict';

angular.module('myApp.collectibleSearch', ['ngRoute', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/collectibleSearch', {
    templateUrl: 'collectibleSearch/collectibleSearch.html',
    controller: 'CollectibleSearchCtrl'
  });
}])

.controller('CollectibleSearchCtrl', function($rootScope, $scope, $cookieStore, $timeout) {
	$rootScope.loggedIn = $cookieStore.get('loggedIn');
	$rootScope.loggedInUser = $cookieStore.get('loggedInUser');
	if (!$rootScope.loggedIn) {
		window.location.href = '#!/login';
	}
	
	$scope.fetchWishlist = function() {
		console.log("Fetch wishlist");
		var user = firebase.auth().currentUser;
		
		$rootScope.unsubscribe = firebase.auth().onAuthStateChanged(function(user){
			if (user) {
				firebase.database().ref('users/' + user.uid + '/wishlist/').once('value').then(function(snapshot) {
					if (snapshot.val() == null) {
						$rootScope.error("There are currently no collectibles on your wishlist.");
					}
					$scope.wishlist = snapshot.toJSON();
					$scope.$apply();
					snapshot.forEach(function(childSnapshot) {
						$scope.getCollectibleImage(childSnapshot.key);
					});
				});
			}
			$rootScope.unsubscribe();
		});
	}
	
	$scope.fetchAllCollections = function(troveName) {
		var user = firebase.auth().currentUser;
		
		$rootScope.unsubscribe = firebase.auth().onAuthStateChanged(function(user){
			if (user) {
				firebase.database().ref('/users/' + user.uid + '/folders').orderByChild('category').equalTo(troveName).once('value').then(function(snapshot) {
					$scope.collections[troveName] = snapshot.toJSON();
					$scope.$apply();
				});
				
				firebase.database().ref('/users/' + user.uid + '/folders').orderByChild('category').equalTo(troveName).limitToFirst(1).once('value').then(function(snapshot) {
					snapshot.forEach(function(childSnapshot) {
						console.log(childSnapshot.key);
						$scope.currentFolder = childSnapshot.key;
						$scope.addToFolderName[troveName] = childSnapshot.key;
						$scope.$apply();
					});
				});
			}
			$rootScope.unsubscribe();
		});
	}
	
	$scope.getCollectibleImage = function(collectibleName) {
		console.log(collectibleName);
		firebase.storage().ref('collectibles/' + collectibleName + '/image').getDownloadURL().then(function(url) {
			$scope.images[collectibleName] = url;
			$scope.$apply();
		}).catch(function(error) {
			$scope.images[collectibleName] = "no_image_available.jpg";
			$scope.$apply();
		});
	}
	
	$scope.addToWishlist = function(collectibleName, troveName) {
		var user = firebase.auth().currentUser;
		
		firebase.database().ref('users/' + user.uid + '/wishlist/' + collectibleName).once('value').then(function(snapshot) {
			if (snapshot.val() == null) {
				firebase.database().ref('users/' + user.uid + '/wishlist/').child(collectibleName).set({
					dateAdded: (new Date).getTime(),
					name: collectibleName,
					category: troveName
				});

				firebase.database().ref('collectibles/' + collectibleName + '/wishlistCount').transaction(function(votes) {
					var newVotes = (votes || 0) + 1;
					return newVotes;
				}, function(error, committed, snapshot) {

				});

				firebase.database().ref('collectibles/' + collectibleName + '/wishlistUsers').child($scope.currentUser.uid).set(user.displayName);
				
				$rootScope.error("Item successfully added.");
			} else {
				$rootScope.error("This item is already on your wishlist.");
			}
			
		});
	}
	
	$scope.addToCollection = function(collectibleName, folderName, troveName) {
		var user = firebase.auth().currentUser;
		
		firebase.database().ref('users/' + user.uid + '/collection/' + collectibleName).once('value').then(function(snapshot) {
			if (snapshot.val() == null) {
				firebase.database().ref('users/' + user.uid + '/collection/').child(collectibleName).set({
					dateAdded: (new Date).getTime(),
					name: collectibleName,
					category: troveName
				});
				
				firebase.database().ref('collectibles/' + collectibleName + '/users/' + user.uid).set({
					multipleCount: 1
				});
				
				firebase.database().ref('collectibles/' + collectibleName + '/collectCount').transaction(function(votes) {
					var newVotes = (votes || 0) + 1;
					return newVotes;
				}, function(error, committed, snapshot) {

				});

				firebase.database().ref('collectibles/' + collectibleName + '/collectUsers').child($scope.currentUser.uid).set(user.displayName);
			}
		});
		
		firebase.database().ref('users/' + user.uid + '/folders/' + folderName + '/collectibles/' + collectibleName).once('value').then(function(snapshot) {
			if (snapshot.val() == null) {
				firebase.database().ref('users/' + user.uid + '/folders/' + folderName + '/collectibles/' + collectibleName).set({
					dateAdded: (new Date).getTime(),
					name: collectibleName,
					category: troveName
				});

				$rootScope.error("Item successfully added.");
			} else {
				$rootScope.error("This item is already in your "+folderName+" folder.");
			}
		});
	}
	
	$scope.addToFolder = function(collectibleName, troveName) {
		console.log(collectibleName);
		$scope.collectibleName = collectibleName;
		$scope.addToFolderTrove = troveName;
		$timeout(function() {
			$('#addToCollectionModal').modal('show');
		});
	}
	
	$scope.viewCollectible = function(troveName) {
		window.location.href = '#!/viewCollectible?'+troveName;
	}
	
	$scope.$on('$viewContentLoaded', function() {
		var a = window.location.href;
		var b = a.substring(a.indexOf("?")+1);
		var query = decodeURIComponent(b);
		if (a.indexOf("?") == -1) {
			window.location.href = '#';
		} else {
			$scope.images = [];
			$scope.collections = [];
			$scope.addToFolderName = [];
			if($rootScope.searchResults == null) {
				window.location.href = '#';
			}
			for (var i in $rootScope.searchResults) {
				console.log($rootScope.searchResults[i].category);
				$scope.getCollectibleImage($rootScope.searchResults[i].name);
				$scope.fetchAllCollections($rootScope.searchResults[i].category);
			}
		}
	});
});
