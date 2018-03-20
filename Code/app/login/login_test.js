describe('TroveSpace Login', function() {

    // const URL = 'https://baker323.github.io/#!/login';
    const URL = 'http://127.0.0.1:60788/#!/login';

    it('should deny incorrect password', function() {
        browser.get(URL);

        element.all(by.model('email')).first().sendKeys('test@test.com');
        element.all(by.model('password')).first().sendKeys('testtest');

        element(by.name('login')).click();

        browser.sleep(2000);
        expect(element(by.name('errorMessage')).getText()).toEqual("The password is invalid or the user does not have a password.");
        element(by.name('confirm')).click();

    });

    it('should deny user does not exist', function() {
        browser.get(URL);

        element.all(by.model('email')).first().sendKeys('testtest@test.com');
        element.all(by.model('password')).first().sendKeys('blahblahblah');

        element(by.name('login')).click();

        browser.sleep(2000);
        expect(element(by.name('errorMessage')).getText()).toEqual("There is no user record corresponding to this identifier. The user may have been deleted.");
        element(by.name('confirm')).click();
    });

    // logout checking too
    it('should successfully login', function() {
        browser.get(URL);

        element.all(by.model('email')).first().sendKeys('test@test.com');
        element.all(by.model('password')).first().sendKeys('test18');
        element(by.name('login')).click();
        browser.sleep(2000);
        element(by.name('settings')).click();
        browser.sleep(2000);
        element(by.name('pwChange')).click();
        browser.sleep(2000);
        // change Password
        element.all(by.model('oldPassword')).first().sendKeys('test18');
        element.all(by.model('newPassword')).first().sendKeys('TEST18');
        element(by.name('submitPW')).click();
        browser.sleep(2000);
        expect(element(by.name('errorMessage')).getText()).toEqual("Password successfully changed.");
        element(by.name('confirm')).click();
        browser.sleep(2000);
        element(by.name('settings')).click();
        browser.sleep(2000);
        element(by.name('logout')).click();
        browser.sleep(2000);

        element.all(by.model('email')).first().sendKeys('test@test.com');
        element.all(by.model('password')).first().sendKeys('TEST18');
        element(by.name('login')).click();
        browser.sleep(2000);
        element(by.name('settings')).click();
        browser.sleep(2000);
        element(by.name('pwChange')).click();
        browser.sleep(2000);

        // change Password
        element.all(by.model('oldPassword')).first().sendKeys('TEST18');
        element.all(by.model('newPassword')).first().sendKeys('test18');
        element(by.name('submitPW')).click();
        browser.sleep(2000);
        expect(element(by.name('errorMessage')).getText()).toEqual("Password successfully changed.");
        element(by.name('confirm')).click();
        browser.sleep(2000);
        element(by.name('settings')).click();
        browser.sleep(2000);
        element(by.name('logout')).click();
    });


    // change Account Information
    it('should successfully change the account information', function() {
        browser.get(URL);
        element.all(by.model('email')).first().sendKeys('test@test.com');
        element.all(by.model('password')).first().sendKeys('test18');
        element(by.name('login')).click();
        browser.sleep(2000);
        element(by.name('settings')).click();
        browser.sleep(2000);
        element(by.name('account')).click();
        browser.sleep(2000);
        element.all(by.model('userInfo.firstName')).first().sendKeys('test');
        element.all(by.model('userInfo.lastName')).first().sendKeys('test');
        element(by.name('updateUserInfo')).click();
        browser.sleep(10000);

    });


});
