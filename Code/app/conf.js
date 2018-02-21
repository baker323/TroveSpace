exports.config = {
    framework: 'jasmine',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: [
        //'register/register_test.js',
        //'login/login_test.js',
        'troves/troves_test.js'
    ]
}
