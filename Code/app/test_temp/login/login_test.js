describe('TroveSpace Login', function() {

    it('should deny incorrect password', function() {
		// Login Page URL
		//browser.get('http://127.0.0.1:60788/login'); // for Mac
        browser.get('http://127.0.0.1:60788/app/index.html#!/login') // for Windows


        element.all(by.model('username')).first().sendKeys('test@test.com');
        element.all(by.model('password')).first().sendKeys('test');

        element(by.name('login')).click();

        browser.sleep(2000);
        expect(element(by.name('errorMessage')).getText()).toEqual("Looks like you typed your username or password incorrectly. Please try again.");
        element(by.name('thanks')).click();

    });

    it('should deny user does not exist', function() {
        //browser.get('http://127.0.0.1:60788/login'); // for Mac
        browser.get('http://127.0.0.1:60788/app/index.html#!/login') // for Windows

        element.all(by.model('username')).first().sendKeys('blahblahblah@test.com');
        element.all(by.model('password')).first().sendKeys('blahblahblah');

        element(by.name('login')).click();

        browser.sleep(2000);
        expect(element(by.name('errorMessage')).getText()).toEqual("Sorry, looks like that user doesn't exist. Please create account a new account.");
        element(by.name('thanks')).click();
    });

    // logout checking too
    it('should successfully login', function() {
        //browser.get('http://127.0.0.1:60788/login'); // for Mac
        browser.get('http://127.0.0.1:60788/app/index.html#!/login') // for Windows

        element.all(by.model('username')).first().sendKeys('user5@test.com');
        element.all(by.model('password')).first().sendKeys('hellothere');
        element(by.name('login')).click();
        browser.sleep(1000);
        expect(browser.getCurrentUrl()).toContain("profile");
        expect(element(by.name('greeting')).getText()).toEqual('Hello user5@test.com!');
        element(by.name('account')).click();
        element(by.name('logout')).click();

    });
});
