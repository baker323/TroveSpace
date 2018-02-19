describe('TroveSpace Signup', function() {
    it('should successfully sign up', function() {
        //browser.get('http://127.0.0.1:60788/login'); // for Mac
        browser.get('http://127.0.0.1:60788/#!/register'); // for Windows

        element.all(by.model('username')).sendKeys('test0');
        element.all(by.model('email')).sendKeys('blahblahblah4@test.com');
        element.all(by.model('password')).sendKeys('blahblahblah');
        element.all(by.model('confirmPassword')).sendKeys('blahblahblah');


        element(by.name('register')).click();
        browser.sleep(1000);

    });
});
