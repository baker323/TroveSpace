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
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/troves'});
}]);

app.run(function($rootScope, $cookieStore, $timeout) {
    $rootScope.logout = function() {
		firebase.auth().signOut().then(function() {
			$rootScope.loggedIn = false;
			$cookieStore.put('loggedIn', false);
			console.log("User logged out.");
			window.location.href = '#!/login';
			$rootScope.unsubscribe();
		}).catch(function(error) {
			console.log(error.message);
		});
	}
	
	$rootScope.changePassword = function(oldPassword, newPassword) {
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
			  $rootScope.error(errorMessage);
			});
		}).catch(function(error) {
			console.log(error.message);
			$rootScope.error(error.message);
		});
		$rootScope.oldPassword = null;
		$rootScope.newPassword = null;
	}
	
	$rootScope.searchComplete = function() {
		var client = algoliasearch('03WT83UTVG', 'f17eb4043a0173ea0f172f57b2636b6e');
		var index = client.initIndex('troves');
		index.clearIndex(function(err, content) {
			if (err) console.log(err);
		});

		firebase.database().ref('/troves').once('value', contacts => {
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
			  console.log('Troves imported into Algolia');
			})
			.catch(error => {
			  console.error('Error when importing Troves into Algolia', error);
			});
		});

		//initialize autocomplete on search input (ID selector must match)
		if (!$rootScope.initialized) {
			autocomplete('#aa-search-input',
			{ hint: false }, {
				source: autocomplete.sources.hits(index, {hitsPerPage: 5}),
				//value to be displayed in input control after user's suggestion selection
				displayKey: 'name',
				//hash of templates used when rendering dataset
				templates: {
					//'suggestion' templating function used to render a single suggestion
					suggestion: function(suggestion) {
					  console.log(suggestion);
					  return '<span>' +
						suggestion._highlightResult.name.value + '</span>';
					}
				}
			});
			$rootScope.initialized = true;
		}
	}
	
	$rootScope.searchTroves = function(query) {
		var client = algoliasearch('03WT83UTVG', 'f17eb4043a0173ea0f172f57b2636b6e');
		var index = client.initIndex('troves');
		
		// Get all contacts from Firebase
		firebase.database().ref('/troves').once('value', contacts => {
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
			  console.log('Troves imported into Algolia');
			  index.search({ query: query }, function searchDone(err, content) {
				  if (err) {
					console.error(err);
					return;
				  }

				  for (var h in content.hits) {
					console.log(content.hits[h].objectID);
				  }
				  $rootScope.troveResults = content.hits;
				});
			})
			.catch(error => {
			  console.error('Error when importing Troves into Algolia', error);
			});
		});
		$rootScope.searchQuery = null;
	}
	
	$rootScope.error = function(errorMessage) {
    	$rootScope.errorMessage = errorMessage;
		$timeout(function() {
			$('#errorModal').modal('show');
		});
    };
	
	$rootScope.$on('$viewContentLoaded', function() {
		$rootScope.searchComplete();
	});
});