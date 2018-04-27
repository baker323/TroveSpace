/*
  Access to firebase
  username: trovespace407
  password: trovespacey123
*/

exports.config = {
    framework: 'jasmine',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: [
        //'register/register_test.js', // done
        //'login/login_test.js', // done
        'troves/troves_test.js', // done
        'viewCollectible/viewCollectible_test.js', // done
        //'troveSearch/troveSearch_test.js' // done
    ]
}
