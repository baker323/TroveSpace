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
		var user = firebase.auth().currentUser;
		
		$rootScope.unsubscribe = firebase.auth().onAuthStateChanged(function(user){
			if (user) {
		
				$scope.troveName = troveName;
				firebase.database().ref('/collectibles').orderByChild('category').equalTo(troveName).once('value').then(function(snapshot) {
					console.log(snapshot.val());
					if (snapshot.val() == null) {
						$rootScope.error("There are currently no collectibles in this trove.");
					} else {
						$scope.troveCollectibles = snapshot.toJSON();
						$scope.$apply();
						snapshot.forEach(function(childSnapshot) {
							$scope.getCollectibleImage(childSnapshot.key);
						});
					}
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
	
	$scope.addToFolder = function(collectibleName) {
		console.log(collectibleName);
		$scope.collectibleName = collectibleName;
		$timeout(function() {
			$('#addToCollectionModal').modal('show');
		});
	}
	
	$scope.fetchAllCollections = function(troveName) {
		$scope.currentUser = firebase.auth().currentUser;
		
		$rootScope.unsubscribe = firebase.auth().onAuthStateChanged(function(user){
			if (user && window.location.href.includes('viewTrove')) {
				firebase.database().ref('/users/' + user.uid + '/folders').orderByChild('category').equalTo(troveName).once('value').then(function(snapshot) {
					$scope.collections = snapshot.toJSON();
					$scope.$apply();
				});
				
				firebase.database().ref('/users/' + user.uid + '/folders').orderByChild('category').equalTo(troveName).limitToFirst(1).once('value').then(function(snapshot) {
					snapshot.forEach(function(childSnapshot) {
						console.log(childSnapshot.key);
						$scope.currentFolder = childSnapshot.key;
						$scope.addToFolderName = childSnapshot.key;
						$scope.$apply();
					});
				});
			}
			$rootScope.unsubscribe();
		});
	}
	
	$scope.createNewCollectible = function(collectibleName) {
		window.location.href = '#!/createCollectible?'+collectibleName;
	}
	
	$scope.viewCollectible = function(troveName) {
		window.location.href = '#!/viewCollectible?'+troveName;
	}
	
	$scope.$on('$viewContentLoaded', function() {
		if (window.location.href.includes('viewTrove')) {
			var a = window.location.href;
			var b = a.substring(a.indexOf("?")+1);
			var troveName = decodeURIComponent(b);
			$rootScope.currentTrove = troveName;
			if (a.indexOf("?") == -1) {
				window.location.href = '#';
			} else {
				$scope.images = [];
				$scope.fetchAllCollections(troveName);
				$scope.fetchCollectibles(troveName);
				$rootScope.onTrovePage = true;
				$rootScope.searchTroveName = troveName;

				if ($rootScope.loggedIn) {				
					console.log($rootScope.searchTroveName);
					$rootScope.searchCategory = "troves/"+$rootScope.searchTroveName+"/collectibles";
					$rootScope.searchIn = "Current Trove";
					if ($rootScope.autoCompleteSearch) {
						$rootScope.initialized = false;
						$rootScope.autoCompleteSearch.autocomplete.destroy();
						$rootScope.autoCompleteSearch = null;
					}
					$rootScope.searchComplete("troves/"+$rootScope.searchTroveName+"/collectibles");
				}
			}
		}
	});
	
	$scope.$on('$locationChangeStart', function(event, next, current) {
    	$rootScope.onTrovePage = false;
		if (!next.includes('collection') && !next.includes('collectibleSearch')) {
			$rootScope.searchIn = "Troves";
		}
	});
	
});