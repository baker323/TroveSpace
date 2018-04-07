'use strict';

angular.module('myApp.viewCollectible', ['ngRoute', 'ngCookies'])


.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/viewCollectible', {
    templateUrl: 'viewCollectible/viewCollectible.html',
    controller: 'ViewCollectibleCtrl'
  });
}])

.controller('ViewCollectibleCtrl', function($rootScope, $scope, $cookieStore, $timeout) {
	$rootScope.loggedIn = $cookieStore.get('loggedIn');
	$rootScope.loggedInUser = $cookieStore.get('loggedInUser');
	if (!$rootScope.loggedIn) {
		window.location.href = '#!/login';
	}
	
	$scope.fetchCollectible = function(collectibleName) {
		var user = $scope.currentUser;
		
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
	
	$scope.getMultipleCount = function(collectibleName) {
		var user = $scope.currentUser;
		
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
	
	$scope.setMultipleCount = function(collectibleName, multipleValue) {
		var user = $scope.currentUser;
		console.log("Set multiple count.");
		
				firebase.database().ref('collectibles/' + collectibleName + '/users/' + user.uid).set({
					multipleCount: multipleValue
				});
		$rootScope.error("Information saved.");
	}
	
	$scope.getVoteStartDate = function(collectibleName) {
		firebase.database().ref('/collectibles/' + collectibleName + '/votes/voteStartDate').once('value').then(function(snapshot) {
			$scope.voteStartDate = snapshot.toJSON();
			if (snapshot.val() != null) {
				var today = (new Date).getTime();
				// 1000*60*60*24 milliseconds in one day
				if (today-$scope.voteStartDate > 1000*60*60*24) {
					if ($scope.voteKeepEdit > $scope.voteRevertEdit) {
						$scope.switchPendingFields(collectibleName);
						// reset the votes
						$scope.resetVotes(collectibleName);
						$scope.pending = false;
					} else if ($scope.voteKeepEdit <= $scope.voteRevertEdit) {
						// make the pending fields blank
						$scope.blankPendingFields(collectibleName);
						// make the pending fields blank
						if ($scope.pendingimage != null) {
							$scope.blankPendingImage(collectibleName);
						}
						// reset the votes
						$scope.resetVotes(collectibleName);
						$scope.pending = false;
					}
				}
				$scope.$apply();
			}
		});
	}
	
	$scope.editCollectible = function(collectibleName) {
		console.log("Edit collectible");
		if (!$scope.pending) {
			var noChange = 0;
			var total = 0;
			for (var i in $scope.collectible) {
				if ($scope.collectible.hasOwnProperty(i)) {
					console.log(i);
					if (!i.includes('pending') && i!='users' && i!='votes') {
						total++;
						if ($scope.originalCollectible[i] == $scope.collectible[i]) {
							noChange++;
						} else {
							firebase.database().ref('collectibles/' + collectibleName).child('pending'+i).set($scope.collectible[i]);
							firebase.database().ref('collectibles/' + collectibleName).child('pendinglastEditedBy').set($scope.currentUser.displayName);
						}

					}
				}
			}
			if (noChange == total && $scope.file == document.getElementById('collectibleImage').files[0]) {
				$rootScope.error("No changes were made.");
			} else {
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
					firebase.database().ref('collectibles/' + collectibleName + '/votes').set({
						voteStartDate: (new Date).getTime()
					});
					$rootScope.error("Your edit has been submitted for approval.");
					$scope.uploadImage(collectibleName);
					firebase.database().ref('collectibles/' + collectibleName).child('pendinglastEditedBy').set($scope.currentUser.displayName);
					
					$scope.sendNotification(collectibleName);
				}
			}
			$scope.updateView();
		} else {
			$rootScope.error("Current edit is still pending.");
			$scope.updateView();
		}
	}
	
	$scope.sendNotification = function(collectibleName) {
		firebase.database().ref('collectibles/' + collectibleName + '/users').once('value').then(function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
				if (childSnapshot.key != $scope.currentUser.uid) {
					firebase.database().ref('users/' + childSnapshot.key + '/notifications').child(collectibleName).set({
						name: collectibleName,
						lastEditedBy: $scope.currentUser.displayName
					});
				}
			});
		});
	}
	
	$scope.incrementKeepVotes = function(collectibleName) {
		var user = $scope.currentUser;
		console.log("Increment keep votes.");
		
				if ($scope.keepVote == true || $scope.revertVote == true) {
						$rootScope.error("You have already voted.");
				} else {
					firebase.database().ref('collectibles/' + collectibleName + '/votes/keep/count').transaction(function(votes) {
						var newVotes = (votes || 0) + 1;
						return newVotes;
					}, function(error, committed, snapshot) {
						var newVotes = snapshot.val();
						$scope.getUserKeepVote($scope.collectibleName);
						$scope.getUserRevertVote($scope.collectibleName);
						
						console.log(newVotes);
						if (newVotes >= 5) {
							// make the pending fields the actual fields
							$scope.pending = false;
							$scope.$apply();
							$scope.switchPendingFields(collectibleName);
							// reset the votes
							$scope.resetVotes(collectibleName);
							$rootScope.error("Edit has been approved.");
							$scope.pending = false;
							$scope.$apply();
							return;
						} else {
							$rootScope.error("Vote recorded.");
							firebase.database().ref('collectibles/' + collectibleName + '/votes/keep/users/' + user.uid).set(true);
							$scope.voteKeepEdit = newVotes;
						}
					});
					$scope.updateView();
				}
	}
	
	$scope.incrementRevertVotes = function(collectibleName) {
		var user = $scope.currentUser;
		console.log("Increment revert votes.");
		
				if ($scope.keepVote == true || $scope.revertVote == true) {
						$rootScope.error("You have already voted.");
				} else {
					firebase.database().ref('collectibles/' + collectibleName + '/votes/revert/count').transaction(function(votes) {
						var newVotes = (votes || 0) + 1;
						return newVotes;
					}, function(error, committed, snapshot) {
						var newVotes = snapshot.val();
						$scope.getUserKeepVote($scope.collectibleName);
						$scope.getUserRevertVote($scope.collectibleName);
						
						console.log(newVotes);
						if (newVotes >= 5) {
							//make the pending fields blank
							$scope.blankPendingFields(collectibleName);
							// make the pending fields blank
							if ($scope.pendingimage != null) {
								$scope.blankPendingImage(collectibleName);
							}
							// reset the votes
							$scope.resetVotes(collectibleName);
							$rootScope.error("Edit has been removed.");
							$scope.pending = false;
							$scope.updateView();
							return;
						} else {
							$rootScope.error("Vote recorded.");
							firebase.database().ref('collectibles/' + collectibleName + '/votes/revert/users/' + user.uid).set(true);
							$scope.voteRevertEdit = newVotes;
						}
					});
				}
	}
	
	$scope.resetVotes = function(collectibleName) {
		var user = $scope.currentUser;
		
				firebase.database().ref('collectibles/' + collectibleName + '/votes/').remove()
				.then(function() {
					console.log("Votes reset.");
					$scope.pending = false;
					$scope.updateView();
				})
				.catch(function(error) {
					console.log("Vote reset failed: " + error.message);
				});
	}
	
	$scope.blankPendingFields = function(collectibleName) {
		var user = $scope.currentUser;
		console.log("Blank pending fields.");
		
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
	
	$scope.blankPendingImage = function(collectibleName) {
		console.log("Blank pending image.");
		// make the pending image blank
		firebase.storage().ref('collectibles/' + collectibleName + '/pendingimage').delete().then(function(snapshot) {
			$scope.pending = false;
			$scope.pendingimage = false;
			$scope.updateView();
		});
	}
	
	$scope.switchPendingFields = function(collectibleName) {
		var user = $scope.currentUser;
		console.log("Switch pending fields.");
				console.log($scope.pendingimage);
				if ($scope.pendingimage != null) {
					firebase.storage().ref('collectibles/' + collectibleName + '/pendingimage').getDownloadURL().then(function(url) {
						// get url of pending image
						var xhr = new XMLHttpRequest();
						xhr.responseType = 'blob';
						xhr.onload = function(event) {
							var blob = xhr.response;
							// store pending image in image
							firebase.storage().ref('collectibles/' + collectibleName + '/image').put(blob).then(function(snapshot) {
								console.log("Uploaded file.");
								$scope.getCollectibleImage($scope.collectibleName);
								$scope.blankPendingImage($scope.collectibleName);

								$scope.pending = false;
								$scope.$apply();
							}).catch(function(error) {
								console.log(error.message);
							});
						};
						xhr.open('GET', url);
						xhr.send();


					}).catch(function(error) {
						console.log(error.message);
					});
				}
				
				firebase.database().ref('collectibles/' + collectibleName).once('value').then(function(snapshot) {
					snapshot.forEach(function(childSnapshot) {
						if (childSnapshot.key.includes('pending')) {
							firebase.database().ref('collectibles/' + collectibleName + '/' + childSnapshot.key.slice(7)).set(childSnapshot.val());
						}
					});
					$scope.blankPendingFields(collectibleName);
					$scope.pending = false;
					$scope.updateView();
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
		var user = $scope.currentUser;
		
		firebase.database().ref('collectibles/' + collectibleName + '/votes/keep/users/' + user.uid).once('value').then(function(snapshot) {
			$scope.keepVote = snapshot.val();
			$scope.$apply();
		});
	}
	
	$scope.getUserRevertVote = function(collectibleName) {
		var user = $scope.currentUser;
		
		firebase.database().ref('collectibles/' + collectibleName + '/votes/revert/users/' + user.uid).once('value').then(function(snapshot) {
			$scope.revertVote = snapshot.val();
			$scope.$apply();
		});
	}
	
	$scope.goBack = function() {
		console.log("Back");
		window.location.href = '#!/viewTrove?'+$scope.collectible.category;
	}
	
	$scope.getDateAddedToCollection = function(collectibleName) {
		var user = $scope.currentUser;
		
		firebase.database().ref('users/' + user.uid + '/collection/' + collectibleName + '/dateAdded').once('value').then(function(snapshot) {
			$scope.dateAddedToCollection = snapshot.val();
			$scope.$apply();
		});
	}
	
	$scope.getDateAddedToWishlist = function(collectibleName) {
		var user = $scope.currentUser;
		
		firebase.database().ref('users/' + user.uid + '/wishlist/' + collectibleName + '/dateAdded').once('value').then(function(snapshot) {
			$scope.dateAddedToWishlist = snapshot.val();
			$scope.$apply();
		});
	}
	
	$scope.getCollectibleImage = function(collectibleName) {
		console.log(collectibleName);
		firebase.storage().ref('collectibles/' + collectibleName + '/image').getDownloadURL().then(function(url) {
			$scope.image = url;
			$scope.$apply();
		}).catch(function(error) {
			$scope.image = "no_image_available.jpg";
			$scope.$apply();
		});
	}
	
	$scope.getPendingImage = function(collectibleName) {
		console.log(collectibleName);
		firebase.storage().ref('collectibles/' + collectibleName + '/pendingimage').getDownloadURL().then(function(url) {
			$scope.pendingimage = url;
			$scope.pending = true;
			$scope.$apply();
		}).catch(function(error) {
			$scope.pendingimage = null;
			$scope.$apply();
		});
	}
	
	$scope.updateView = function() {
		$scope.fetchCollectible($scope.collectibleName);
		$scope.getCollectibleImage($scope.collectibleName);
		$scope.getPendingImage($scope.collectibleName);
		$scope.getMultipleCount($scope.collectibleName);
		$scope.getDateAddedToCollection($scope.collectibleName);
		$scope.getDateAddedToWishlist($scope.collectibleName);
			
		$scope.getUserKeepVote($scope.collectibleName);
		$scope.getUserRevertVote($scope.collectibleName);
		$scope.getKeepVotes($scope.collectibleName);
		$scope.getRevertVotes($scope.collectibleName);
		
		$scope.fetchCollectUsers($scope.collectibleName);
		$scope.fetchWishlistUsers($scope.collectibleName);
		$scope.fetchComments($scope.collectibleName);
	}
	
	$scope.getCurrentUser = function() {
		$rootScope.unsubscribe = firebase.auth().onAuthStateChanged(function(user){
			if (user && window.location.href.includes('viewCollectible')) {
				$scope.currentUser = user;
				$scope.updateView();
			}
			$rootScope.unsubscribe();
		});
	}
	
	$scope.fetchAllCollectibles = function() {
		var user = $scope.currentUser;
		firebase.database().ref('collectibles').once('value').then(function(snapshot) {
			if (snapshot.val() == null) {
				$rootScope.error("There are not currently any collectibles.");
			} else {
				$scope.collectibles = snapshot.toJSON();
				$scope.$apply();
				snapshot.forEach(function(childSnapshot) {
					if (childSnapshot.key != $scope.collectibleName) {
						$scope.duplicateCollectibleName = childSnapshot.key;
						return true;
					}
				});
			}
		});
	}
	
	$scope.voteForDuplicate = function() {
		firebase.database().ref('collectibles/' + $scope.collectibleName + '/duplicateUsers/' + $scope.currentUser.uid).once('value').then(function(snapshot) {
			if (snapshot.val() == null) {
				$timeout(function() {
					$('#duplicateCollectibleModal').modal('show');
				});
			} else {
				$rootScope.error("You have already voted.");
			}
		});
	}
	
	$scope.voteDuplicateCollectible = function(collectibleName) {
		firebase.database().ref('collectibles/' + $scope.collectibleName + '/duplicateYes').transaction(function(votes) {
			var newVotes = (votes || 0) + 1;
			return newVotes;
		}, function(error, committed, snapshot) {
			var newVotes = snapshot.val();
						
			console.log(newVotes);
			if (newVotes >= 5) {
				//remove the collectible
				firebase.database().ref('collectibles/' + $scope.collectibleName).remove()
				.then(function() {					
					firebase.database().ref('troves/' + $scope.collectible.category + '/collectibles/' + $scope.collectibleName).remove();
					firebase.database().ref('users').once('value').then(function(snapshot) {
						snapshot.forEach(function(childSnapshot) {
							
							firebase.database().ref('users/' + childSnapshot.key + '/collection/' + $scope.collectibleName).remove();
							
							firebase.database().ref('users/' + childSnapshot.key + '/wishlist/' + $scope.collectibleName).remove();
							
							firebase.database().ref('users/' + childSnapshot.key + '/folders').once('value').then(function(snapshot2) {
								snapshot2.forEach(function(childSnapshot2) {									
									firebase.database().ref('users/' + childSnapshot.key + '/folders/' + childSnapshot2.key + '/collectibles/' + $scope.collectibleName).remove();
								});
							});
						});
					});
					
					firebase.storage().ref('collectibles/' + $scope.collectibleName + '/image').delete();
					
					firebase.storage().ref('collectibles/' + $scope.collectibleName + '/pendingimage').delete();
					
					$rootScope.error("Collectible has received the required amount of votes for removal.");
					window.location.href = '#!/viewTrove?'+$scope.collectible.category;
					
				}).catch(function(error) {
					console.log(error.message);
					$rootScope.error("Collectible has received the required amount of votes for removal.");
					window.location.href = '#!/viewTrove?'+$scope.collectible.category;
				});				
				return;
			} else {
				firebase.database().ref('collectibles/' + $scope.collectibleName + '/duplicateUsers').child($scope.currentUser.uid).set(true);
			
				firebase.database().ref('collectibles/' + $scope.collectibleName + '/duplicateName').set(collectibleName);
			
				$rootScope.error("Vote recorded.");
			}
		});
	}
	
	$scope.voteNotDuplicateCollectible = function(collectibleName) {
		firebase.database().ref('collectibles/' + $scope.collectibleName + '/duplicateNo').transaction(function(votes) {
			var newVotes = (votes || 0) + 1;
			return newVotes;
		}, function(error, committed, snapshot) {
			var newVotes = snapshot.val();
						
			console.log(newVotes);
			if (newVotes >= 5) {
				//reset the vote
				firebase.database().ref('collectibles/' + $scope.collectibleName + '/duplicateName').remove();
				
				firebase.database().ref('collectibles/' + $scope.collectibleName + '/duplicateYes').remove();
				
				firebase.database().ref('collectibles/' + $scope.collectibleName + '/duplicateNo').remove();
				
				firebase.database().ref('collectibles/' + $scope.collectibleName + '/duplicateUsers').remove();
				
				$rootScope.error("Vote recorded.");
				
				return;
			} else {
				firebase.database().ref('collectibles/' + $scope.collectibleName + '/duplicateUsers').child($scope.currentUser.uid).set(true);
			
				firebase.database().ref('collectibles/' + $scope.collectibleName + '/duplicateName').set(collectibleName);
			
				$rootScope.error("Vote recorded.");
			}
		});
	}
	
	$scope.uploadImage = function(collectibleName) {
		var file = document.getElementById('collectibleImage').files[0];
		if (file != null) {
			console.log(file);
			firebase.storage().ref('collectibles/' + collectibleName + '/pendingimage').put(file).then(function(snapshot) {
				console.log("Uploaded file.");
				$scope.getPendingImage($scope.collectibleName);
				$scope.file = file;
			}).catch(function(error) {
				console.log(error.message);
			});
		}
	}
	
	$scope.fetchCollectUsers = function(collectibleName) {
		firebase.database().ref('collectibles/' + collectibleName + '/collectUsers').once('value').then(function(snapshot) {
			$scope.collectUsers = snapshot.toJSON();
			$scope.$apply();
		});
	}
	
	$scope.fetchWishlistUsers = function(collectibleName) {
		firebase.database().ref('collectibles/' + collectibleName + '/wishlistUsers').once('value').then(function(snapshot) {
			$scope.wishlistUsers = snapshot.toJSON();
			$scope.$apply();
		});
	}
	
	$scope.viewCollectUser = function(userId) {
		$timeout(function() {
			$('#viewUserListModal').modal('hide');
			window.location.href = '#!/viewProfile?'+userId;
		});
	}
	
	$scope.viewWishlistUser = function(userId) {
		$timeout(function() {
			$('#viewWishlistModal').modal('hide');
			window.location.href = '#!/viewProfile?'+userId;
		});
	}
	
	$scope.sendComment = function(comment) {
		var newPostKey = firebase.database().ref('collectibles/' + $scope.collectibleName + '/comments').push().key;
		firebase.database().ref('collectibles/' + $scope.collectibleName + '/comments/' + newPostKey).update({
			text: comment,
			dateAdded: (new Date).getTime(),
			user: $scope.currentUser.displayName,
			upvotes: 0,
			downvotes: 0,
			key: newPostKey
		}).then(function() {
			$rootScope.error("Comment sent.");
			$scope.comment = null;
			$scope.fetchComments($scope.collectibleName);
		}).catch(function(error) {
			$rootScope.error(error.message);
		});
	}
	
	$scope.fetchComments = function(collectibleName) {
		firebase.database().ref('collectibles/' + collectibleName + '/comments').once('value').then(function(snapshot) {
			$scope.comments = snapshot.toJSON();
			$scope.$apply();
		});
	}
	
	$scope.sendReply = function(reply, comment) {
		var newPostKey = firebase.database().ref('collectibles/' + $scope.collectibleName + '/comments/' + comment + '/replies').push().key;
		firebase.database().ref('collectibles/' + $scope.collectibleName + '/comments/' + comment + '/replies/' + newPostKey).update({
			text: reply,
			dateAdded: (new Date).getTime(),
			user: $scope.currentUser.displayName,
			key: newPostKey
		}).then(function() {
			$rootScope.error("Reply sent.");
			$scope.textareashow[comment] = false;
			$scope.reply = null;
			$scope.fetchComments($scope.collectibleName);
		}).catch(function(error) {
			$rootScope.error(error.message);
		});
	}
	
	$scope.deleteComment = function(comment) {
		firebase.database().ref('collectibles/' + $scope.collectibleName + '/comments/' + comment).remove().then(function() {
			$rootScope.error("Comment deleted.");
			$scope.fetchComments($scope.collectibleName);
		});
	}
	
	$scope.deleteReply = function(reply, comment) {
		firebase.database().ref('collectibles/' + $scope.collectibleName + '/comments/' + comment + '/replies/' + reply).remove().then(function() {
			$rootScope.error("Reply deleted.");
			$scope.fetchComments($scope.collectibleName);
		});
	}
	
	$scope.upvoteComment = function(comment) {
		firebase.database().ref('collectibles/' + $scope.collectibleName + '/comments/' + comment + '/upvoteUsers/' + $scope.currentUser.uid).once('value').then(function(snapshot) {
			$scope.upvote = snapshot.val();
			console.log($scope.upvote);
			firebase.database().ref('collectibles/' + $scope.collectibleName + '/comments/' + comment + '/upvotes').transaction(function(votes) {
				var newVotes = votes;
				if ($scope.upvote == true) {
					newVotes = votes-1;
				} else if ($scope.upvote == false || $scope.upvote == null) {
					newVotes = votes+1;
				}
				return newVotes;
			}, function(error, committed, snapshot) {
				var newVotes = snapshot.val();
				if ($scope.upvote == true) {
					firebase.database().ref('collectibles/' + $scope.collectibleName + '/comments/' + comment + '/upvoteUsers/' + $scope.currentUser.uid).remove();
				} else if ($scope.upvote == null) {
					firebase.database().ref('collectibles/' + $scope.collectibleName + '/comments/' + comment + '/upvoteUsers/' + $scope.currentUser.uid).set(true);
				} else if ($scope.upvote == false) {
					firebase.database().ref('collectibles/' + $scope.collectibleName + '/comments/' + comment + '/upvoteUsers/' + $scope.currentUser.uid).set(true);
					
					firebase.database().ref('collectibles/' + $scope.collectibleName + '/comments/' + comment + '/downvotes').transaction(function(votes) {
						var newVotes = votes-1;
						return newVotes;
					});
				}
				$scope.fetchComments($scope.collectibleName);
				$scope.$apply();
			});
		});
	}
	
	$scope.downvoteComment = function(comment) {
		firebase.database().ref('collectibles/' + $scope.collectibleName + '/comments/' + comment + '/upvoteUsers/' + $scope.currentUser.uid).once('value').then(function(snapshot) {
			$scope.upvote = snapshot.val();
			console.log($scope.upvote);
			firebase.database().ref('collectibles/' + $scope.collectibleName + '/comments/' + comment + '/downvotes').transaction(function(votes) {
				var newVotes = votes;
				if ($scope.upvote == true || $scope.upvote == null) {
					newVotes = votes+1;
				} else if ($scope.upvote == false) {
					newVotes = votes-1;
				}
				return newVotes;
			}, function(error, committed, snapshot) {
				var newVotes = snapshot.val();
				if ($scope.upvote == null) {
					firebase.database().ref('collectibles/' + $scope.collectibleName + '/comments/' + comment + '/upvoteUsers/' + $scope.currentUser.uid).set(false);
				} else if ($scope.upvote == false) {
					firebase.database().ref('collectibles/' + $scope.collectibleName + '/comments/' + comment + '/upvoteUsers/' + $scope.currentUser.uid).remove();
				} else if ($scope.upvote == true) {
					firebase.database().ref('collectibles/' + $scope.collectibleName + '/comments/' + comment + '/upvoteUsers/' + $scope.currentUser.uid).set(false);
					
					firebase.database().ref('collectibles/' + $scope.collectibleName + '/comments/' + comment + '/upvotes').transaction(function(votes) {
						var newVotes = votes-1;
						return newVotes;
					});
				}
				$scope.fetchComments($scope.collectibleName);
				$scope.$apply();
			});
		});
	}

	$scope.$on('$viewContentLoaded', function() {
		if (window.location.href.includes('viewCollectible')) {
			var a = window.location.href;
			var b = a.substring(a.indexOf("?")+1);
			$scope.collectibleName = decodeURIComponent(b);
			if (a.indexOf("?") == -1) {
				window.location.href = '#';
			} else {
				$scope.getCurrentUser();
				$scope.textareashow = [];
				$scope.collapseReplies = [];
				$scope.reply = [];
				$scope.fetchAllCollectibles();
				$scope.getVoteStartDate($scope.collectibleName);
			}
		}
	});
});
