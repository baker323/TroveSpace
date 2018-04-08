'use strict';

angular.module('myApp.viewProfile', ['ngRoute', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/viewProfile', {
    templateUrl: 'viewProfile/viewProfile.html',
    controller: 'ViewProfileCtrl'
  });
}])

.controller('ViewProfileCtrl', function($rootScope, $scope, $cookieStore, $timeout) {
	$rootScope.loggedIn = $cookieStore.get('loggedIn');
	$rootScope.loggedInUser = $cookieStore.get('loggedInUser');
	if (!$rootScope.loggedIn) {
		window.location.href = '#!/login';
	}
	
	$scope.fetchAllCollections = function() {
		console.log("Fetch all collections.");
		var user = $scope.otherUser;
		
				firebase.database().ref('/users/' + $scope.userId + '/folders').once('value').then(function(snapshot) {
					if (snapshot.val() == null) {
						$rootScope.error($scope.otherUser.username+" doesn't have any folders.");
						$scope.collections = snapshot.toJSON();
						$scope.$apply();
					} else {
						$scope.collections = snapshot.toJSON();
						$scope.$apply();
					}
				});
				firebase.database().ref('/users/' + $scope.userId + '/folders').limitToFirst(1).once('value').then(function(snapshot) {
					if (snapshot.val() != null) {
						snapshot.forEach(function(childSnapshot) {
							console.log(childSnapshot.key);
							$scope.currentFolder = childSnapshot.key;
							$scope.fetchCollectiblesInCollection($scope.currentFolder);
							$scope.$apply();
						});
					}
				});
	}
	
	$scope.fetchUserCollections = function(troveName) {
		var user = $scope.currentUser;
		
		firebase.database().ref('/users/' + user.uid + '/folders').orderByChild('category').equalTo(troveName).once('value').then(function(snapshot) {
			$scope.userCollections[troveName] = snapshot.toJSON();
			$scope.$apply();
		});
				
		firebase.database().ref('/users/' + user.uid + '/folders').orderByChild('category').equalTo(troveName).limitToFirst(1).once('value').then(function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
				console.log(childSnapshot.key);
				$scope.addToFolderName[troveName] = childSnapshot.key;
				$scope.$apply();
			});
		});
	}
	
	$scope.fetchWishlist = function() {
		console.log("Fetch wishlist");
		var user = $scope.otherUser;
		
		firebase.database().ref('users/' + $scope.userId + '/wishlist/').once('value').then(function(snapshot) {
			if (snapshot.val() == null) {
				$rootScope.error($scope.otherUser.username+"'s wishlist is empty.");
				$scope.wishlist = true;
				$scope.collection = snapshot.toJSON();
				$scope.$apply();
			} else {
				$scope.collection = snapshot.toJSON();
				$scope.wishlist = snapshot.toJSON();
				$scope.$apply();
				snapshot.forEach(function(childSnapshot) {
					$scope.getCollectibleImage(childSnapshot.key);
				});
			}
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
	
	$scope.fetchCollectiblesInCollection = function(folderName) {
		console.log(folderName);
		if (folderName != null && folderName != $scope.removingFolder) {
			if (folderName == 'wishlist') {
				$scope.fetchWishlist();
			} else {
				var user = $scope.otherUser;
				$scope.wishlist = null;
		
				firebase.database().ref('/users/' + $scope.userId + '/folders/' + folderName + '/collectibles').once('value').then(function(snapshot) {
					if (snapshot.val() == null) {
						$scope.collection = snapshot.toJSON();
						$scope.$apply();
						$rootScope.error("There are currently no collectibles in this folder.");
					} else {
						$scope.collection = snapshot.toJSON();
						$scope.$apply();
						snapshot.forEach(function(childSnapshot) {
							$scope.getCollectibleImage(childSnapshot.key);
							$scope.getForSaleCollectibles(childSnapshot.key);
							$scope.fetchUserCollections(childSnapshot.val().category);
						});
					}
				});
			}
		} else {
			$rootScope.error($scope.otherUser.username+" doesn't have any folders.");
			$scope.collections = null;
			$scope.wishlist = false;
		}
		$scope.removingFolder = null;
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
	
	$scope.getForSaleCollectibles = function(collectibleName) {
		firebase.database().ref('collectibles/' + collectibleName + '/forSaleUsers/' + $scope.userId).once('value').then(function(snapshot) {
			if (snapshot.val() != null) {
				$scope.forSaleCollectibles[collectibleName] = snapshot.val().dateAdded;
				$scope.$apply();
			}
		});
	}
	
	$scope.fetchAllTroves = function() {
		firebase.database().ref('troves').once('value').then(function(snapshot) {
			$scope.troves = snapshot.toJSON();
			$scope.$apply();
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
				}).then(function() {
					firebase.database().ref('users/' + user.uid + '/wishlist/' + collectibleName).once('value').then(function(snapshot) {
						if (snapshot.val() != null) {
							firebase.database().ref('users/' + user.uid + '/wishlist/' + collectibleName).remove();
				
							firebase.database().ref('collectibles/' + collectibleName + '/wishlistCount').transaction(function(votes) {
								var newVotes = votes - 1;
								return newVotes;
							});

							firebase.database().ref('collectibles/' + collectibleName + '/wishlistUsers').child($scope.currentUser.uid).remove();
						}
					});
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
	
	$scope.getCurrentUser = function() {
		$rootScope.unsubscribe = firebase.auth().onAuthStateChanged(function(user){
			if (user && window.location.href.includes('viewProfile')) {
				$scope.currentUser = user;
				$scope.getOtherUser($scope.userId);
			}
			$rootScope.unsubscribe();
		});
	}
	
	$scope.viewCollectible = function(troveName) {
		window.location.href = '#!/viewCollectible?'+troveName;
	}
	
	$scope.getOtherUser = function(userId) {
		firebase.database().ref('users/' + userId).once('value').then(function(snapshot) {
			if (snapshot.val() != null) {
				$scope.otherUser = snapshot.toJSON();
				if ($scope.userId == $scope.currentUser.uid) {
					window.location.href = '#!/collection';
				} else {
					$scope.fetchAllTroves();
					$scope.fetchAllCollections();
					$scope.$apply();
				}
			} else {
				window.location.href = '#';
			}
		});
	}
	
	$scope.$on('$viewContentLoaded', function() {
		if (window.location.href.includes('viewProfile')) {
			var a = window.location.href;
			var b = a.substring(a.indexOf("?")+1);
			$scope.userId = decodeURIComponent(b);
			if (a.indexOf("?") == -1) {
				window.location.href = '#';
			} else {
				$scope.images = [];
				$scope.userCollections = [];
				$scope.forSaleCollectibles = [];
				$scope.addToFolderName = [];
				$scope.getCurrentUser();
			}
		}
	});
});