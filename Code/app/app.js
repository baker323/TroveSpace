'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'ngRoute',
  'ngCookies',
  'myApp.view1',
  'myApp.view2',
  'myApp.login',
  'myApp.register',
  'myApp.createCollectible',
  'myApp.createTrove',
  'myApp.collection',
  'myApp.wishlist',
  'myApp.troves',
  'myApp.accinfo',
  'myApp.createCollectible',
  'myApp.viewCollectible',
  'myApp.createTrove',
  'myApp.viewTrove',
  'myApp.collectibleSearch',
  'myApp.troveSearch',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/troves'});
}]);

app.run(function($rootScope, $cookieStore, $timeout, $route) {
	$rootScope.logout = function() {
		firebase.auth().signOut().then(function() {
			$rootScope.loggedIn = false;
			$cookieStore.put('loggedIn', false);
			console.log("User logged out.");
			window.location.href = '#!/login';
			$rootScope.unsubscribe();
			if($rootScope.autoCompleteSearch) {
				$rootScope.initialized = false;
				
				$rootScope.autoCompleteSearch.autocomplete.destroy();
				$rootScope.autoCompleteSearch = null;
			}
		}).catch(function(error) {
			console.log(error.message);
		});
	}
	
	$rootScope.changePassword = function(oldPassword, newPassword) {

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
			  $rootScope.error(errorMessage);
			});
		}).catch(function(error) {
			console.log(error.message);
			$rootScope.error(error.message);
		});
		$rootScope.oldPassword = null;
		$rootScope.newPassword = null;
	}
	
	$rootScope.searchComplete = function(indexToSearch) {
		if (indexToSearch.includes("users")) {
			$rootScope.searchUserCollection(indexToSearch);
		} else if (indexToSearch.includes("troves/")) {
			$rootScope.searchSpecificTrove(indexToSearch);
		} else {
			var client = algoliasearch('03WT83UTVG', 'f17eb4043a0173ea0f172f57b2636b6e');
			var index = client.initIndex(indexToSearch);
			index.clearIndex(function(err, content) {
				if (err) console.log(err);
			});

			firebase.database().ref('/'+indexToSearch).once('value', contacts => {
			  // Build an array of all records to push to Algolia
			  const records = [];
			  contacts.forEach(contact => {
				// get the key and data from the snapshot
				const childKey = contact.key;
				const childData = contact.val();
				// We set the Algolia objectID as the Firebase .key
				childData.objectID = childKey;
				// Add object for indexing
				records.push(childData);
			  });
			  // Add or update new objects
			  index
				.saveObjects(records)
				.then(() => {
				  console.log(indexToSearch+' imported into Algolia');
				  	//initialize autocomplete on search input (ID selector must match)
					if (!$rootScope.initialized) {
						$rootScope.autoCompleteSearch = autocomplete('#aa-search-input',
						{ hint: false }, {
							source: autocomplete.sources.hits(index, {hitsPerPage: 5}),
							//value to be displayed in input control after user's suggestion selection
							displayKey: 'name',
							//hash of templates used when rendering dataset
							templates: {
								//'suggestion' templating function used to render a single suggestion
								suggestion: function(suggestion) {
								  return '<span>' +
									suggestion._highlightResult.name.value + '</span>';
								}
							}
						});
						$rootScope.initialized = true;
					}
				})
				.catch(error => {
				  console.error('Error when importing '+indexToSearch+' into Algolia', error);
				});
			}).catch(function(error) {
				console.log(error.message);
			});
		}
	}
	
	$rootScope.searchUserCollection = function(indexToSearch) {
		var newIndex = indexToSearch;
		indexToSearch = "collection";
		var client = algoliasearch('03WT83UTVG', 'f17eb4043a0173ea0f172f57b2636b6e');
		var index = client.initIndex(indexToSearch);
		index.clearIndex(function(err, content) {
			if (err) console.log(err);
		});

		firebase.database().ref('/'+newIndex).once('value', contacts => {
		  // Build an array of all records to push to Algolia
		  const records = [];
		  contacts.forEach(contact => {
			// get the key and data from the snapshot
			const childKey = contact.key;
			const childData = contact.val();
			// We set the Algolia objectID as the Firebase .key
			childData.objectID = childKey;
			// Add object for indexing
			records.push(childData);
		  });
		  // Add or update new objects
		  index
			.saveObjects(records)
			.then(() => {
			  console.log(indexToSearch+' imported into Algolia');
			  	//initialize autocomplete on search input (ID selector must match)
				if (!$rootScope.initialized) {
					$rootScope.autoCompleteSearch = autocomplete('#aa-search-input',
					{ hint: false }, {
						source: autocomplete.sources.hits(index, {hitsPerPage: 5}),
						//value to be displayed in input control after user's suggestion selection
						displayKey: 'name',
						//hash of templates used when rendering dataset
						templates: {
							//'suggestion' templating function used to render a single suggestion
							suggestion: function(suggestion) {
							  return '<span>' +
								suggestion._highlightResult.name.value + '</span>';
							}
						}
					});
					$rootScope.initialized = true;
				}
			})
			.catch(error => {
			  console.error('Error when importing '+indexToSearch+' into Algolia', error);
			});
		}).catch(function(error) {
			console.log(error.message);
		});
	}
	
	$rootScope.searchSpecificTrove = function(indexToSearch) {
		var newIndex = indexToSearch;
		indexToSearch = "trove";
		var client = algoliasearch('03WT83UTVG', 'f17eb4043a0173ea0f172f57b2636b6e');
		var index = client.initIndex(indexToSearch);
		index.clearIndex(function(err, content) {
			if (err) console.log(err);
		});

		firebase.database().ref('/'+newIndex).once('value', contacts => {
		  // Build an array of all records to push to Algolia
		  const records = [];
		  contacts.forEach(contact => {
			// get the key and data from the snapshot
			const childKey = contact.key;
			const childData = contact.val();
			// We set the Algolia objectID as the Firebase .key
			childData.objectID = childKey;
			// Add object for indexing
			records.push(childData);
		  });
		  // Add or update new objects
		  index
			.saveObjects(records)
			.then(() => {
			  console.log(indexToSearch+' imported into Algolia');
			  	//initialize autocomplete on search input (ID selector must match)
				if (!$rootScope.initialized) {
					$rootScope.autoCompleteSearch = autocomplete('#aa-search-input',
					{ hint: false }, {
						source: autocomplete.sources.hits(index, {hitsPerPage: 5}),
						//value to be displayed in input control after user's suggestion selection
						displayKey: 'name',
						//hash of templates used when rendering dataset
						templates: {
							//'suggestion' templating function used to render a single suggestion
							suggestion: function(suggestion) {
							  return '<span>' +
								suggestion._highlightResult.name.value + '</span>';
							}
						}
					});
					$rootScope.initialized = true;
				}
			})
			.catch(error => {
			  console.error('Error when importing '+indexToSearch+' into Algolia', error);
			});
		}).catch(function(error) {
			console.log(error.message);
		});
	}
	
	$rootScope.searchIndex = function(query, indexToSearch) {
		if (query != null) {
			if (indexToSearch.includes("users")) {
				$rootScope.searchCollection(query, indexToSearch);
			} else if (indexToSearch.includes("troves/")) {
				$rootScope.searchCurrentTrove(query, indexToSearch);
			} else {
				var client = algoliasearch('03WT83UTVG', 'f17eb4043a0173ea0f172f57b2636b6e');
				var index = client.initIndex(indexToSearch);

				// Get all contacts from Firebase
				firebase.database().ref('/'+indexToSearch).once('value', contacts => {
				  // Build an array of all records to push to Algolia
				  const records = [];
				  contacts.forEach(contact => {
					// get the key and data from the snapshot
					const childKey = contact.key;
					const childData = contact.val();
					// We set the Algolia objectID as the Firebase .key
					childData.objectID = childKey;
					// Add object for indexing
					records.push(childData);
				  });

				  // Add or update new objects
				  index
					.saveObjects(records)
					.then(() => {
					  console.log(indexToSearch+' imported into Algolia');
					  index.search({ query: query }, function searchDone(err, content) {
						  if (err) {
							console.error(err);
							return;
						  }

						  for (var h in content.hits) {
							console.log(content.hits[h].objectID);
						  }
						  if (content.hits.length == 0) {
							  $rootScope.error("No results match your search");
							  $rootScope.searchQuery = null;
							  $rootScope.autoCompleteSearch.autocomplete.setVal('');
							  
						  } else {
							  $rootScope.searchResults = content.hits;
							  console.log($rootScope.searchResults);
							  if (indexToSearch == "troves") {
								  window.location.href = '#!/troveSearch?'+query;
							  } else if (indexToSearch == "collectibles") {
								  window.location.href = '#!/collectibleSearch?'+query;
							  }
						  }
						});
					})
					.catch(error => {
					  console.error('Error when importing '+indexToSearch+' into Algolia', error);
					});
				});
				$rootScope.searchQuery = null;
				$rootScope.autoCompleteSearch.autocomplete.setVal('');
			}
		}
	}
	
	$rootScope.searchCollection = function(query, indexToSearch) {
		var newIndex = indexToSearch;
		indexToSearch = "collection";
		var client = algoliasearch('03WT83UTVG', 'f17eb4043a0173ea0f172f57b2636b6e');
		var index = client.initIndex(indexToSearch);
		
		// Get all contacts from Firebase
		firebase.database().ref('/'+newIndex).once('value', contacts => {
		  // Build an array of all records to push to Algolia
		  const records = [];
		  contacts.forEach(contact => {
			// get the key and data from the snapshot
			const childKey = contact.key;
			const childData = contact.val();
			// We set the Algolia objectID as the Firebase .key
			childData.objectID = childKey;
			// Add object for indexing
			records.push(childData);
		  });

		  // Add or update new objects
		  index
			.saveObjects(records)
			.then(() => {
			  console.log(indexToSearch+' imported into Algolia');
			  index.search({ query: query }, function searchDone(err, content) {
				  if (err) {
					console.error(err);
					return;
				  }

				  for (var h in content.hits) {
					console.log(content.hits[h].objectID);
				  }
				  if (content.hits.length == 0) {
				  	$rootScope.error("No results match your search");
					$rootScope.searchQuery = null;
					$rootScope.autoCompleteSearch.autocomplete.setVal('');
				  } else {
				  	$rootScope.searchResults = content.hits;
				  	window.location.href = '#!/collectibleSearch?'+query;
				  }
				});
			})
			.catch(error => {
			  console.error('Error when importing '+indexToSearch+' into Algolia', error);
			});
		});
		$rootScope.searchQuery = null;
		$rootScope.autoCompleteSearch.autocomplete.setVal('');
	}
	
	$rootScope.searchCurrentTrove = function(query, indexToSearch) {
		var newIndex = indexToSearch;
		indexToSearch = "trove";
		var client = algoliasearch('03WT83UTVG', 'f17eb4043a0173ea0f172f57b2636b6e');
		var index = client.initIndex(indexToSearch);
		
		// Get all contacts from Firebase
		firebase.database().ref('/'+newIndex).once('value', contacts => {
		  // Build an array of all records to push to Algolia
		  const records = [];
		  contacts.forEach(contact => {
			// get the key and data from the snapshot
			const childKey = contact.key;
			const childData = contact.val();
			// We set the Algolia objectID as the Firebase .key
			childData.objectID = childKey;
			// Add object for indexing
			records.push(childData);
		  });

		  // Add or update new objects
		  index
			.saveObjects(records)
			.then(() => {
			  console.log(indexToSearch+' imported into Algolia');
			  index.search({ query: query }, function searchDone(err, content) {
				  if (err) {
					console.error(err);
					return;
				  }

				  for (var h in content.hits) {
					console.log(content.hits[h].objectID);
				  }
				  if (content.hits.length == 0) {
				  	$rootScope.error("No results match your search");
					$rootScope.searchQuery = null;
					$rootScope.autoCompleteSearch.autocomplete.setVal('');
				  } else {
				  	$rootScope.searchResults = content.hits;
				  	window.location.href = '#!/collectibleSearch?'+query;
				  }
				});
			})
			.catch(error => {
			  console.error('Error when importing '+indexToSearch+' into Algolia', error);
			});
		});
		$rootScope.searchQuery = null;
		$rootScope.autoCompleteSearch.autocomplete.setVal('');
	}
	
	$rootScope.searchSelection = function(searchIn) {
		var user = firebase.auth().currentUser;
		
		$rootScope.unsubscribe = firebase.auth().onAuthStateChanged(function(user){
			if (user) {
				if (searchIn == "Troves") {
					console.log("troves");
					$rootScope.searchCategory = "troves";
					if ($rootScope.autoCompleteSearch) {
						$rootScope.initialized = false;
						$rootScope.searchQuery = null;
						$rootScope.autoCompleteSearch.autocomplete.setVal('');
						$rootScope.autoCompleteSearch.autocomplete.destroy();
						$rootScope.autoCompleteSearch = null;
					}
					$rootScope.searchComplete("troves");
				} else if (searchIn == "Collectibles") {
					console.log("collectibles");
					$rootScope.searchCategory = "collectibles";
					if ($rootScope.autoCompleteSearch) {
						$rootScope.initialized = false;
						$rootScope.searchQuery = null;
						$rootScope.autoCompleteSearch.autocomplete.setVal('');
						$rootScope.autoCompleteSearch.autocomplete.destroy();
						$rootScope.autoCompleteSearch = null;
					}
					$rootScope.searchComplete("collectibles");
				} else if (searchIn == "My Collection") {
					console.log("collection");
					$rootScope.searchCategory = "users/"+user.uid+"/collection";
					if ($rootScope.autoCompleteSearch) {
						$rootScope.initialized = false;
						$rootScope.searchQuery = null;
						$rootScope.autoCompleteSearch.autocomplete.setVal('');
						$rootScope.autoCompleteSearch.autocomplete.destroy();
						$rootScope.autoCompleteSearch = null;
					}
					$rootScope.searchComplete("users/"+user.uid+"/collection");
				} else if (searchIn == "Current Trove") {
					console.log($rootScope.searchTroveName);
					if ($rootScope.searchTroveName == null) {
						$rootScope.searchTroveName = $rootScope.currentTrove;
					}
					$rootScope.searchCategory = "troves/"+$rootScope.searchTroveName+"/collectibles";
					if ($rootScope.autoCompleteSearch) {
						$rootScope.initialized = false;
						$rootScope.searchQuery = null;
						$rootScope.autoCompleteSearch.autocomplete.setVal('');
						$rootScope.autoCompleteSearch.autocomplete.destroy();
						$rootScope.autoCompleteSearch = null;
					}
					$rootScope.searchComplete("troves/"+$rootScope.searchTroveName+"/collectibles");
				}
			}
			$rootScope.unsubscribe();
		});
	}
	
	$rootScope.getNotifications = function() {
		console.log("Get notifications.");
		$rootScope.unsubscribe = firebase.auth().onAuthStateChanged(function(user){
			$rootScope.currentUser = user;
			if (user) {
				firebase.database().ref('users/' + $rootScope.currentUser.uid + '/notifications').once('value').then(function(snapshot) {
					$rootScope.notifications = snapshot.toJSON();
					$rootScope.$apply();
				});
			}
			$rootScope.unsubscribe();
		});
	}
	
	$rootScope.viewNotification = function(collectibleName) {
		console.log(collectibleName);
		$rootScope.removeNotification(collectibleName);
		window.location.href = '#!/viewCollectible?'+collectibleName;
	}
	
	$rootScope.removeNotification = function(collectibleName) {
		console.log(collectibleName);
		firebase.database().ref('users/' + $rootScope.currentUser.uid + '/notifications').child(collectibleName).remove()
		.then(function() {
			console.log("Notification removed.");
			$rootScope.getNotifications();
		})
		.catch(function(error) {
			console.log("Remove failed: " + error.message);
		});
	}
	
	$rootScope.error = function(errorMessage) {
    	$rootScope.errorMessage = errorMessage;
		$timeout(function() {
			$('#errorModal').modal('show');
		});
    };
	
	$rootScope.$on('$viewContentLoaded', function() {
		$rootScope.getNotifications();
		if (!window.location.href.includes('troves') && 
			!window.location.href.includes('collection') &&
			!window.location.href.includes('viewTrove') &&
		    !window.location.href.includes('troveSearch') &&
		    !window.location.href.includes('collectibleSearch')
		   ) {
			if ($rootScope.loggedIn) {
				$rootScope.searchCategory = "troves";
				$rootScope.searchIn = "Troves";
				if ($rootScope.autoCompleteSearch) {
					$rootScope.initialized = false;
					$rootScope.autoCompleteSearch.autocomplete.destroy();
					$rootScope.autoCompleteSearch = null;
				}
				$rootScope.searchComplete("troves");
			}
		}
	});
});