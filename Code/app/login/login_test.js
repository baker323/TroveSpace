describe('TroveSpace Login', function() {

    it('should deny incorrect password', function() {
        browser.get('http://127.0.0.1:60788/#!/login');

        element.all(by.model('email')).first().sendKeys('test@test.com');
        element.all(by.model('password')).first().sendKeys('test');

        element(by.name('login')).click();

        browser.sleep(2000);
        expect(element(by.name('errorMessage')).getText()).toEqual("The password is invalid or the user does not have a password.");
        element(by.name('confirm')).click();

    });

    it('should deny user does not exist', function() {
        browser.get('http://127.0.0.1:60788/#!/login');

        element.all(by.model('email')).first().sendKeys('blahblahblah@test.com');
        element.all(by.model('password')).first().sendKeys('blahblahblah');

        element(by.name('login')).click();

        browser.sleep(2000);
        expect(element(by.name('errorMessage')).getText()).toEqual("There is no user record corresponding to this identifier. The user may have been deleted.");
        element(by.name('confirm')).click();
    });

    // logout checking too
    it('should successfully login', function() {
        browser.get('http://127.0.0.1:60788/#!/login');

        element.all(by.model('email')).first().sendKeys('user5@test.com');
        element.all(by.model('password')).first().sendKeys('hellothere');
        element(by.name('login')).click();
        browser.sleep(1000);
        //expect(browser.getCurrentUrl()).toContain("profile");
        //expect(element(by.name('greeting')).getText()).toEqual('Hello user5@test.com!');
        //element(by.name('account')).click();
        //element(by.name('logout')).click();

    });
});
