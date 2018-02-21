describe('troves module', function() {

    it('should successfully added to wishlist and remove from wishlist', function() {
        // login
        browser.get('http://127.0.0.1:60788/#!/login');

        element.all(by.model('email')).first().sendKeys('test@test.com');
        element.all(by.model('password')).first().sendKeys('test18');

        element(by.name('login')).click();

        // add
        browser.sleep(2000);
        element(by.name('viewTroves')).click();
        browser.sleep(2000);
        element(by.name('collectibles')).click();
        browser.sleep(2000);
        element(by.name('addButton')).click();
        browser.sleep(2000);
        element(by.name('addToWishlist')).click();
        browser.sleep(2000);
        expect(element(by.name('errorMessage')).getText()).toEqual("Item successfully added.");
        element(by.name('confirm')).click();
        browser.sleep(2000);

        // remove
        element(by.name('myWishlist')).click();
        browser.sleep(2000);
        element(by.name('removeFromWishlist')).click();
        browser.sleep(2000);
        expect(element(by.name('errorMessage')).getText()).toEqual("There are currently no collectibles on your wishlist.");
        element(by.name('confirm')).click();
        browser.sleep(2000);
    });

});
