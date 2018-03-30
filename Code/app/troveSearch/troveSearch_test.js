describe('troves module', function() {

    // const URL = 'https://baker323.github.io/#!/login';
    const URL = 'http://127.0.0.1:60788/#!/login';

    it('should search Trove', function() {
      // login
      browser.get(URL);

      element.all(by.model('email')).first().sendKeys('test@test.com');
      element.all(by.model('password')).first().sendKeys('test18');

      element(by.name('login')).click();

      browser.sleep(2000);
      // searchTextInput
      element(by.name('searchTextInput')).sendKeys('baseball');
      browser.sleep(2000);
      element(by.name('searchButton')).click();
      browser.sleep(2000);
    });

    it('should search Collectible', function() {
        browser.get(URL);

        element.all(by.model('email')).first().sendKeys('test@test.com');
        element.all(by.model('password')).first().sendKeys('test18');

        element(by.name('login')).click();

        browser.sleep(2000);
        // searchCategorySelector
        element(by.name('searchForCollectibles')).click();
        browser.sleep(2000);
        element(by.name('searchTextInput')).sendKeys('b');
        browser.sleep(2000);
        element(by.name('searchButton')).click();
        browser.sleep(2000);


    });

    it('should search myCollection but cannot fine', function() {
        browser.get(URL);

        element.all(by.model('email')).first().sendKeys('test@test.com');
        element.all(by.model('password')).first().sendKeys('test18');

        element(by.name('login')).click();

        browser.sleep(2000);
        element(by.name('searchForMyCollection')).click();
        browser.sleep(2000);
        // searchCategorySelector
        element(by.name('searchTextInput')).sendKeys('test');
        browser.sleep(2000);
        element(by.name('searchButton')).click();
        browser.sleep(2000);
        //
        expect(element(by.name('errorMessage')).getText()).toEqual("No results match your search");
        element(by.name('confirm')).click();
        browser.sleep(2000);
    });


});
