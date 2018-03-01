'use strict';

angular.module('myApp.viewCollectible', ['ngRoute', 'ngCookies'])


.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/viewCollectible', {
    templateUrl: 'viewCollectible/viewCollectible.html',
    controller: 'ViewCollectibleCtrl'
  });
}])

.controller('ViewCollectibleCtrl', function($rootScope, $scope, $cookieStore) {
	$rootScope.loggedIn = $cookieStore.get('loggedIn');
	$rootScope.loggedInUser = $cookieStore.get('loggedInUser');
	if (!$rootScope.loggedIn) {
		window.location.href = '#!/login';
	}
	
	$scope.fetchCollectible = function(collectibleName) {
		var user = firebase.auth().currentUser;
		
		$rootScope.unsubscribe = firebase.auth().onAuthStateChanged(function(user){
			if (user) {
				firebase.database().ref('collectibles/' + collectibleName).once('value').then(function(snapshot) {
					$scope.collectible = snapshot.toJSON();
					$scope.originalCollectible = snapshot.toJSON();
					snapshot.forEach(function(childSnapshot) {
						if (childSnapshot.key.includes('pending')) {
							$scope.pending = true;
							if (childSnapshot.val() == $scope.collectible[childSnapshot.key.slice(7)]) {
								$scope.collectible[childSnapshot.key] = null;
							} else {
								$scope.collectible[childSnapshot.key] = "Suggested Edit: "+childSnapshot.val();
							}
						}
					});
					
					$scope.$apply();
				});
			}
			$rootScope.unsubscribe();
		});
	}
	
	$scope.getMultipleCount = function(collectibleName) {
		var user = firebase.auth().currentUser;
		
		$rootScope.unsubscribe = firebase.auth().onAuthStateChanged(function(user){
			if (user) {
				firebase.database().ref('/collectibles/' + collectibleName + '/users/' + user.uid + '/multipleCount').once('value').then(function(snapshot) {
					if (snapshot.val() == null) {
						$scope.multipleCount = 0;
						$scope.$apply();
					} else {
						$scope.multipleCount = snapshot.toJSON();
						$scope.$apply();
					}
				});
			}
			$rootScope.unsubscribe();
		});
	}
	
	$scope.setMultipleCount = function(collectibleName, multipleValue) {
		var user = firebase.auth().currentUser;
		console.log("Set multiple count.");
		
		$rootScope.unsubscribe = firebase.auth().onAuthStateChanged(function(user){
			if (user) {
				firebase.database().ref('collectibles/' + collectibleName + '/users/' + user.uid).set({
					multipleCount: multipleValue});
			}
			$rootScope.unsubscribe();
		});
		$rootScope.error("Information saved.");
	}
	
	$scope.editCollectible = function(collectibleName) {
		console.log("Edit collectible");
		if (!$scope.pending) {
			var noChange = 0;
			var total = 0;
			for (var i in $scope.collectible) {
				if ($scope.collectible.hasOwnProperty(i)) {
					if (!i.includes('pending') && i!='users' && i!='votes') {
						total++;
						if ($scope.originalCollectible[i] == $scope.collectible[i]) {
							noChange++;
						} else {
							firebase.database().ref('collectibles/' + collectibleName).child('pending'+i).set($scope.collectible[i]);
						}

					}
				}
			}
			if (noChange == total && $scope.file == document.getElementById('collectibleImage').files[0]) {
				$rootScope.error("No changes were made.");
			} else {
				$rootScope.error("Your edit has been submitted for approval.");
				$scope.uploadImage(collectibleName);
			}
			$scope.updateView();
		} else {
			$rootScope.error("Current edit is still pending.");
		}
	}
	
	$scope.incrementKeepVotes = function(collectibleName) {
		var user = firebase.auth().currentUser;
		console.log("Increment keep votes.");
		
		$rootScope.unsubscribe = firebase.auth().onAuthStateChanged(function(user){
			if (user) {
				if ($scope.keepVote == true || $scope.revertVote == true) {
						$rootScope.error("You have already voted.");
				} else {
					firebase.database().ref('collectibles/' + collectibleName + '/votes/keep/count').transaction(function(votes) {
						var newVotes = (votes || 0) + 1;
						if (newVotes >= 10) {
							// make the pending fields the actual fields
							$scope.switchPendingFields(collectibleName);
							// make the pending fields blank
							$scope.blankPendingFields(collectibleName);
							// reset the votes
							$scope.resetVotes(collectibleName);
							$rootScope.error("Edit has reached the required amount of votes for approval.");
							$scope.pending = false;
							return;
						} else {
							$rootScope.error("Vote recorded.");
						}
						return newVotes;
					});
					
					firebase.database().ref('collectibles/' + collectibleName + '/votes/keep/users/' + user.uid).set(true);
					
					$scope.updateView();
				}
			}
			$rootScope.unsubscribe();
		});
	}
	
	$scope.resetVotes = function(collectibleName) {
		var user = firebase.auth().currentUser;
		
		$rootScope.unsubscribe = firebase.auth().onAuthStateChanged(function(user){
			if (user) {
				firebase.database().ref('collectibles/' + collectibleName + '/votes/').remove()
				.then(function() {
					console.log("Votes reset.");
					$scope.updateView();
				})
				.catch(function(error) {
					console.log("Vote reset failed: " + error.message);
				});
			}
			$rootScope.unsubscribe();
		});
	}
	
	$scope.blankPendingFields = function(collectibleName) {
		var user = firebase.auth().currentUser;
		console.log("Increment keep votes.");
		
		$rootScope.unsubscribe = firebase.auth().onAuthStateChanged(function(user){
			if (user) {
				firebase.database().ref('collectibles/' + collectibleName).once('value').then(function(snapshot) {
					snapshot.forEach(function(childSnapshot) {
						if (childSnapshot.key.includes('pending')) {
							firebase.database().ref('collectibles/' + collectibleName + '/' + childSnapshot.key).set(null);
							$scope.pending = false;
							$scope.updateView();
						}
					});
				});
			}
			$rootScope.unsubscribe();
		});
	}
	
	$scope.switchPendingFields = function(collectibleName) {
		var user = firebase.auth().currentUser;
		console.log("Increment keep votes.");
		
		$rootScope.unsubscribe = firebase.auth().onAuthStateChanged(function(user){
			if (user) {
				firebase.database().ref('collectibles/' + collectibleName).once('value').then(function(snapshot) {
					snapshot.forEach(function(childSnapshot) {
						if (childSnapshot.key.includes('pending')) {
							firebase.database().ref('collectibles/' + collectibleName + '/' + childSnapshot.key.slice(7)).set(childSnapshot.val());
							$scope.updateView();
						}
					});
				});
			}
			$rootScope.unsubscribe();
		});
	}
	
	$scope.incrementRevertVotes = function(collectibleName) {
		var user = firebase.auth().currentUser;
		console.log("Increment revert votes.");
		
		$rootScope.unsubscribe = firebase.auth().onAuthStateChanged(function(user){
			if (user) {
				if ($scope.keepVote == true || $scope.revertVote == true) {
						$rootScope.error("You have already voted.");
				} else {
					firebase.database().ref('collectibles/' + collectibleName + '/votes/revert/count').transaction(function(votes) {
						var newVotes = (votes || 0) + 1;
						if (newVotes >= 10) {
							// make the pending fields blank
							$scope.blankPendingFields(collectibleName);
							// reset the votes
							$scope.resetVotes(collectibleName);
							$rootScope.error("Edit has reached the required amount of votes for removal.");
							$scope.pending = false;
							return;
						} else {
							$rootScope.error("Vote recorded.");
						}
						return newVotes;
					});
					
					firebase.database().ref('collectibles/' + collectibleName + '/votes/revert/users/' + user.uid).set(true);
					
					$scope.updateView();
				}
			}
			$rootScope.unsubscribe();
		});
	}
	
	$scope.getKeepVotes = function(collectibleName) {
		firebase.database().ref('collectibles/' + collectibleName + '/votes/keep/count').once('value').then(function(snapshot) {
			$scope.voteKeepEdit = snapshot.val();
			$scope.$apply();
		});
	}
	
	$scope.getRevertVotes = function(collectibleName) {
		firebase.database().ref('collectibles/' + collectibleName + '/votes/revert/count').once('value').then(function(snapshot) {
			$scope.voteRevertEdit = snapshot.val();
			$scope.$apply();
		});
	}
		
	$scope.getUserKeepVote = function(collectibleName) {
		var user = firebase.auth().currentUser;
		
		$rootScope.unsubscribe = firebase.auth().onAuthStateChanged(function(user){
			if (user) {
				firebase.database().ref('collectibles/' + collectibleName + '/votes/keep/users/' + user.uid).once('value').then(function(snapshot) {
					$scope.keepVote = snapshot.val();
					console.log("Keep vote: "+$scope.keepVote);
					$scope.$apply();
				});
			}
			$rootScope.unsubscribe();
		});
	}
	
	$scope.getUserRevertVote = function(collectibleName) {
		var user = firebase.auth().currentUser;
		
		$rootScope.unsubscribe = firebase.auth().onAuthStateChanged(function(user){
			if (user) {
				firebase.database().ref('collectibles/' + collectibleName + '/votes/revert/users/' + user.uid).once('value').then(function(snapshot) {
					$scope.revertVote = snapshot.val();
					console.log("Revert vote: "+$scope.revertVote);
					$scope.$apply();
				});
			}
			$rootScope.unsubscribe();
		});
	}
	
	$scope.goBack = function() {
		console.log("Back");
		window.location.href = '#!/viewTrove?'+$scope.collectible.category;
	}
	
	$scope.updateView = function() {
		$scope.fetchCollectible($scope.collectibleName);
		$scope.getMultipleCount($scope.collectibleName);
			
		$scope.getUserKeepVote($scope.collectibleName);
		$scope.getUserRevertVote($scope.collectibleName);
		$scope.getKeepVotes($scope.collectibleName);
		$scope.getRevertVotes($scope.collectibleName);
	}
	
	$scope.uploadImage = function(collectibleName) {
		var file = document.getElementById('collectibleImage').files[0];
		console.log(file);
		if (file != null) {
			firebase.storage().ref('collectibles/' + collectibleName + '/image').put(file).then(function(snapshot) {
				console.log("Uploaded file.");
				$scope.file = file;
			}).catch(function(error) {
				console.log(error.message);
			});
		}
	}

	$scope.$on('$viewContentLoaded', function() {
		var a = window.location.href;
		var b = a.substring(a.indexOf("?")+1);
		$scope.collectibleName = decodeURIComponent(b);
		if (a.indexOf("?") == -1) {
			window.location.href = '#';
		} else {
			$scope.updateView();
		}
	});
});
