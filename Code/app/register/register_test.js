describe('TroveSpace Signup', function() {
    it('should successfully sign up', function() {
        browser.get('http://127.0.0.1:60788/#!/register');

        element.all(by.model('username')).sendKeys('test0');
        element.all(by.model('email')).sendKeys('blahblahblah4@test.com');
        element.all(by.model('password')).sendKeys('blahblahblah');
        element.all(by.model('confirmPassword')).sendKeys('blahblahblah');

        element(by.name('register')).click();
        browser.sleep(1000);
        element(by.name('confirm')).click();

    });

    it('should deny email already exists', function() {
        browser.get('http://127.0.0.1:60788/#!/register');

        element.all(by.model('username')).sendKeys('test1');
        element.all(by.model('email')).sendKeys('blahblahblah4@test.com');
        element.all(by.model('password')).sendKeys('blahblahblah');
        element.all(by.model('confirmPassword')).sendKeys('blahblahblah');

        element(by.name('register')).click();

        browser.sleep(2000);
        expect(element(by.name('errorMessage')).getText()).toEqual("User already exists.");
        element(by.name('confirm')).click();
    });

    it('should deny invalid email', function() {
        browser.get('http://127.0.0.1:60788/#!/register');

        element.all(by.model('username')).sendKeys('test2');
        element.all(by.model('email')).sendKeys('hello');
        element.all(by.model('password')).sendKeys('blahblahblah');
        element.all(by.model('confirmPassword')).sendKeys('blahblahblah');

        element(by.name('register')).click();

        browser.sleep(2000);
        //expect(element(by.name('errorMessage')).getText()).toEqual("Looks like you didn't enter a valid email. Please enter an email as your username.");
        //element(by.name('confirm')).click();
    });

    it('should deny too short email', function() {
        browser.get('http://127.0.0.1:60788/#!/register');

        element.all(by.model('username')).sendKeys('test3');
        element.all(by.model('email')).sendKeys('@.');
        element.all(by.model('password')).sendKeys('blahblahblah');
        element.all(by.model('confirmPassword')).sendKeys('blahblahblah');

        element(by.name('register')).click();

        browser.sleep(2000);
        //expect(element(by.name('errorMessage')).getText()).toEqual("Please enter a username that is between 3 and 254 characters.");
        //element(by.name('confirm')).click();
    });

    it('should deny too long email', function() {
        browser.get('http://127.0.0.1:60788/#!/register');

        element.all(by.model('username')).sendKeys('test4');
        element.all(by.model('email')).sendKeys('abbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb@id.com');
        element.all(by.model('password')).sendKeys('blahblahblah');
        element.all(by.model('confirmPassword')).sendKeys('blahblahblah');

        element(by.name('register')).click();

        browser.sleep(2000);
        expect(element(by.name('errorMessage')).getText()).toEqual("Please enter a username that is between 3 and 254 characters.");
        element(by.name('confirm')).click();
    });

    it('should deny too short password', function() {
        browser.get('http://127.0.0.1:60788/#!/register');

        element.all(by.model('username')).sendKeys('test5');
        element.all(by.model('email')).sendKeys('blahblahblah4@test.com');
        element.all(by.model('password')).sendKeys('1234567');
        element.all(by.model('confirmPassword')).sendKeys('1234567');

        element(by.name('signup')).click();

        browser.sleep(2000);
        expect(element(by.name('errorMessage')).getText()).toEqual("Please enter a password that is between 8 and 30 characters.");
        element(by.name('register')).click();
    });

    it('should deny too long password', function() {
        browser.get('http://127.0.0.1:60788/#!/register');

        element.all(by.model('username')).sendKeys('test6');
        element.all(by.model('email')).sendKeys('blahblahblah4@test.com');
        element.all(by.model('password')).sendKeys('1234567890123456789012345678901');
        element.all(by.model('confirmPassword')).sendKeys('1234567890123456789012345678901');

        element(by.name('register')).click();

        browser.sleep(2000);
        expect(element(by.name('errorMessage')).getText()).toEqual("Please enter a password that is between 8 and 30 characters.");
        element(by.name('confirm')).click();
    });

    it('should deny passwords do not match', function() {
        browser.get('http://127.0.0.1:60788/#!/register');

        element.all(by.model('username')).sendKeys('test7');
        element.all(by.model('email')).sendKeys('blahblahblah4@test.com');
        element.all(by.model('password')).sendKeys('blahblahblah');
        element.all(by.model('confirmPassword')).sendKeys('blagblagblag');

        element(by.name('register')).click();

        browser.sleep(2000);
        expect(element(by.name('errorMessage')).getText()).toEqual("Oops! Looks like those passwords don't match. Please try typing them in again.");
        element(by.name('confirm')).click();
    });

});
