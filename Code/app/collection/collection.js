'use strict';

angular.module('myApp.collection', ['ngRoute', 'ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/collection', {
    templateUrl: 'collection/collection.html',
    controller: 'CollectionCtrl'
  });
}])

.controller('CollectionCtrl', function($rootScope, $scope, $cookieStore) {
	$rootScope.loggedIn = $cookieStore.get('loggedIn');
	$rootScope.loggedInUser = $cookieStore.get('loggedInUser');
	if (!$rootScope.loggedIn) {
		window.location.href = '#!/login';
	}
	
	$scope.createFolder = function(folderName, troveName) {
		var user = firebase.auth().currentUser;
		
		firebase.database().ref('users/' + user.uid + '/folders').child(folderName).once('value').then(function(snapshot) {
			if (snapshot.val() == null) {
				firebase.database().ref('users/' + user.uid + '/folders').child(folderName)
				.set({
					creationDate: (new Date).getTime(),
					category: troveName
				});
				$scope.folderName = null;
				$scope.troveName = null;
				$scope.fetchAllCollections();
			} else {
				$rootScope.error("Folder with that name already exists.");
				$scope.folderName = null;
				$scope.troveName = null;
			}
		});
	}
	
	$scope.renameFolder = function(oldName, newName) {
		console.log(oldName, newName);
		var user = firebase.auth().currentUser;
		
		firebase.database().ref('users/' + user.uid + '/folders').child(newName).once('value').then(function(snapshot) {
			if (snapshot.val() == null) {
				firebase.database().ref('users/' + user.uid + '/folders').child(oldName).once('value').then(function(snapshot) {
				  var data = snapshot.val();
				  var update = {};
				  update[oldName] = null;
				  update[newName] = data;
				  $scope.fetchAllTroves();
				  $scope.fetchAllCollections();
				  $scope.newName = null;
				  $rootScope.error("Folder successfully renamed.");
				  return firebase.database().ref('users/' + user.uid + '/folders').update(update);
				});
			} else {
				$rootScope.error("Folder with that name already exists.");
				$scope.newName = null;
			}
		});
	}
	
	$scope.deleteFolder = function(folderName) {
		var user = firebase.auth().currentUser;
		
		firebase.database().ref('users/' + user.uid + '/folders').child(folderName).remove()
		  .then(function() {
			console.log("Remove succeeded.");
			$rootScope.error("Remove succeeded.");
			$scope.fetchAllTroves();
			$scope.fetchAllCollections();
			$scope.fetchCollectiblesInCollection($scope.currentFolder);
			$rootScope.error("Folder successfully deleted.");
		  })
		  .catch(function(error) {
			console.log("Remove failed: " + error.message);
			$rootScope.error(error.message);
		  });
	}
	
	$scope.fetchAllCollections = function() {
		console.log("Fetch all collections.");
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
						$scope.fetchCollectiblesInCollection($scope.currentFolder);
						$scope.$apply();
					});
				});
			}
		});
	}
	
	$scope.fetchCollectiblesInCollection = function(folderName) {
		console.log(folderName);
		var user = firebase.auth().currentUser;
		
		firebase.database().ref('/users/' + user.uid + '/folders/' + folderName + '/collectibles').once('value').then(function(snapshot) {
			if (snapshot.val() == null) {
				$scope.collection = snapshot.toJSON();
				$scope.$apply();
				$rootScope.error("There are currently no collectibles in this folder.");
			} else {
				$scope.collection = snapshot.toJSON();
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
	
	$scope.removeFromCollection = function(collectibleName, folderName) {
		var user = firebase.auth().currentUser;
		
		firebase.auth().onAuthStateChanged(function(user){
			if (user) {
				firebase.database().ref('users/' + user.uid + '/folders/' + folderName + '/collectibles').child(collectibleName).remove()
				.then(function() {
					console.log("Remove succeeded.");
					$scope.fetchCollectiblesInCollection(folderName);
				})
				.catch(function(error) {
					console.log("Remove failed: " + error.message);
				});
			}
		});
	}
	
	$scope.viewCollectible = function(troveName) {
		window.location.href = '#!/viewCollectible?'+troveName;
	}
	
	$scope.$on('$viewContentLoaded', function() {
		$scope.fetchAllTroves();
		$scope.fetchAllCollections();
	});
});