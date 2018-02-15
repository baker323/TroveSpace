// conf.js

// Download Protractor at http://www.protractortest.org/#/tutorial

exports.config = {
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: [
    'register/register_test.js',
	  'login/login_test.js',
    'settings/settings_test.js', // changing password & delete account
    'collection/collection_test.js', // creation & viewing & renaming & deletion
    'collectibles/duplication_test.js', // update & showing
    'collectibles/creation_test.js',
    'collectibles/addingToCollections_test.js',
    'collectibles/addingToWishlist_test.js',
    'trove/creation_test.js',
    'trove/view_test.js',
    'trove/viewAll_test.js',
	  'trove/editName_test.js'
  ]
}
