'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', function($scope) {
	
	$scope.createAccount = function(username, email, password) {
		
		firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
			return user.updateProfile({
				displayName: username
			});
		}).catch(function(error) {
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  console.log(errorCode + ": " + errorMessage);
		  if (errorCode.includes("email-already-in-use")) {
			  $rootScope.error("User already exists.");
		  } else {
			  console.log(error.message);
		  }
		});
		
		firebase.auth().onAuthStateChanged(function(user) {
		  if (user && !user.emailVerified) {
			  
			user.sendEmailVerification().then(function() {
			  	console.log("Verification email sent");
			  	$rootScope.error("Verification email sent.");
				firebase.database().ref('users/' + user.uid).set({
					username: username,
					email: email
				});
			}).catch(function(error) {
			  console.log(error.message);
			});
		  }
		});
	}

	$scope.login = function(email, password) {
		firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  console.log(errorCode + ": " + errorMessage);
		});
		
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				console.log("User logged in.");
			}
		});
	}
	
	$scope.logout = function() {
		firebase.auth().signOut().then(function() {
			console.log("User logged out.");
		}).catch(function(error) {
			console.log(error.message);
		});
	}
	
	$scope.changePassword = function(oldPassword, newPassword) {
		var user = firebase.auth().currentUser;

		var user = firebase.auth().currentUser;
		var credential = firebase.auth.EmailAuthProvider.credential(
			user.email,
			oldPassword
		);
		user.reauthenticateWithCredential(credential).then(function() {
			console.log("Reauthentication successful.");
			user.updatePassword(newPassword).then(function() {
			  console.log("Password changed.");
			  $rootScope.error("Password successfully changed.");
			}).catch(function(error) {
			  var errorCode = error.code;
			  var errorMessage = error.message;
			  console.log(errorCode + ": " + errorMessage);
			});
		}).catch(function(error) {
			console.log(error.message);
		});
	}
	
	$scope.forgotPassword = function(email) {
		var auth = firebase.auth();

		auth.sendPasswordResetEmail(email).then(function() {
		  console.log("Password reset email sent.");
		}).catch(function(error) {
		  console.log(error.message);
		});
	}
	
	$scope.deleteAccount = function(password) {
		var user = firebase.auth().currentUser;
		var credential = firebase.auth.EmailAuthProvider.credential(
			user.email,
			password
		);
		user.reauthenticateWithCredential(credential).then(function() {
			console.log("Reauthentication successful.");
			
			firebase.database().ref('users/' + user.uid).set(null);
			user.delete().then(function() {
			  console.log("Account successfully deleted.");
			  $rootScope.error("Account successfully deleted");
			}).catch(function(error) {
			  console.log(error.message);
			});	
		}).catch(function(error) {
			console.log(error.message);
		});
	}
	
	$scope.createFolder = function(folderName, troveName) {
		var user = firebase.auth().currentUser;
		
		firebase.database().ref('users/' + user.uid + '/folders').child(folderName)
		.set({
			creationDate: (new Date).getTime(),
			category: troveName
		});
	}
	
	$scope.renameFolder = function(oldName, newName) {
		var user = firebase.auth().currentUser;

		firebase.database().ref('users/' + user.uid + '/folders').child(oldName).once('value').then(function(snapshot) {
		  var data = snapshot.val();
		  var update = {};
		  update[oldName] = null;
		  update[newName] = data;
		  return firebase.database().ref('users/' + user.uid + '/folders').update(update);
		});
	}
	
	$scope.deleteFolder = function(folderName) {
		var user = firebase.auth().currentUser;
		
		firebase.database().ref('users/' + user.uid + '/folders').child(folderName).remove()
		  .then(function() {
			console.log("Remove succeeded.");
		  })
		  .catch(function(error) {
			console.log("Remove failed: " + error.message);
		  });
	}
	
	$scope.fetchAllCollections = function() {
		var user = firebase.auth().currentUser;
		
		firebase.database().ref('/users/' + user.uid + '/folders').once('value').then(function(snapshot) {
			$scope.collections = snapshot.toJSON();
		});
	}
	
	$scope.fetchCollection = function(folderName) {
		var user = firebase.auth().currentUser;
		
		firebase.database().ref('/users/' + user.uid + '/folders').child(folderName).once('value').then(function(snapshot) {
			$scope.collection = snapshot.toJSON();
		});
	}
	
	$scope.createTrove = function(troveName, description, customFields) {
		var user = firebase.auth().currentUser;
		
		firebase.database().ref('troves').child(troveName)
		.set({
			description: description,
			followerCount: 0
		});
		for (var i=0; i < customFields.length; i++) {
			firebase.database().ref('troves/' + troveName).child(customFields[i]).set(true);
		}
	}
	
	$scope.fetchTrove = function(troveName) {
		
		firebase.database().ref('/troves/' + troveName).once('value').then(function(snapshot) {
			$scope.trove = snapshot.toJSON();
		});
	}
	
	$scope.fetchAllTroves = function() {
		
		firebase.database().ref('troves').once('value').then(function(snapshot) {
			$scope.troves = snapshot.toJSON();
		});
	}
	
	$scope.createCollectible = function(collectibleName, description, troveName, customFields, fieldValues) {
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
		});
	}
	
	$scope.fetchCollectible = function(collectibleName) {
		
		firebase.database().ref('collectibles/' + collectibleName).once('value').then(function(snapshot) {
			$scope.collectible = snapshot.toJSON();
		});
	}
	
	$scope.addToCollection = function(collectibleName, folderName) {
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
	
	$scope.addToWishlist = function(collectibleName) {
		var user = firebase.auth().currentUser;
		
		firebase.database().ref('users/' + user.uid + '/wishlist/').child(collectibleName).set(true);
	}
	
	$scope.fetchWishlist = function() {
		var user = firebase.auth().currentUser;
		
		firebase.database().ref('users/' + user.uid + '/wishlist/').once('value').then(function(snapshot) {
			$scope.wishlist = snapshot.toJSON();
		});
	}
	
	$scope.getMultipleCount = function(collectibleName, folderName) {
		var user = firebase.auth().currentUser;
		
		firebase.database().ref('users/' + user.uid + '/folders/' + folderName + '/collectibles/').child(collectibleName + '/multipleCount').once('value').then(function(snapshot) {
			$scope.multipleCount = snapshot.val();
		});
	}
	
	$scope.setMultipleCount = function(collectibleName, folderName, multipleValue) {
		var user = firebase.auth().currentUser;
		
		firebase.database().ref('users/' + user.uid + '/folders/' + folderName + '/collectibles/').child(collectibleName).set({
			multipleCount: multipleValue});
	}
	
});