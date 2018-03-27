
describe('TroveSpace Edit Item', function() {

    // const URL = 'https://baker323.github.io/#!/login';
    const URL = 'http://127.0.0.1:60788/#!/login';

    it('edit collection', function() {
        browser.get(URL);

        element.all(by.model('email')).first().sendKeys('test@test.com');
        element.all(by.model('password')).first().sendKeys('test18');

        element(by.name('login')).click();

        // add to wishlist
        browser.sleep(2000);
        element(by.name('viewTroves')).click();
        browser.sleep(2000);

        element(by.repeater('(key, value) in troves').row(0)).click();
        browser.sleep(2000);

        // editCollectibleButton
        element(by.name('editCollectibleButton')).click();
        browser.sleep(2000);

        // editDescription
        element.all(by.model('collectible.description')).clear();
        element.all(by.model('collectible.description')).first().sendKeys('hello world')
        browser.sleep(2000);

        element.all(by.name('editExtra')).clear();
        element.all(by.name('editExtra')).get(0).sendKeys('Hello World');
        element.all(by.name('editExtra')).get(1).sendKeys('Hello World');
        element.all(by.name('editExtra')).get(2).sendKeys('Hello World');
        browser.sleep(2000);

        element.all(by.model('multipleCount')).clear();
        element.all(by.model('multipleCount')).first().sendKeys(3);
        browser.sleep(2000);

        element(by.name('submitEditCollectible')).click();
        browser.sleep(2000);

        expect(element(by.name('errorMessage')).getText()).toEqual("Your edit has been submitted for approval.");
        element(by.name('confirm')).click();


        // disapproveButton
    });

    it('should deny edit', function() {
        browser.get(URL);

        element.all(by.model('email')).first().sendKeys('test@test.com');
        element.all(by.model('password')).first().sendKeys('test18');

        element(by.name('login')).click();

        // add to wishlist
        browser.sleep(2000);
        element(by.name('viewTroves')).click();
        browser.sleep(2000);

        element(by.repeater('(key, value) in troves').row(0)).click();
        browser.sleep(2000);

        // editCollectibleButton
        element(by.name('editCollectibleButton')).click();
        browser.sleep(2000);

        // editDescription
        element.all(by.model('collectible.description')).clear();
        element.all(by.model('collectible.description')).first().sendKeys('A baseball card of Mickey Mantle (Yankees)')
        browser.sleep(2000);

        element.all(by.name('editExtra')).clear();
        element.all(by.name('editExtra')).get(0).sendKeys('Mickey Mantle');
        element.all(by.name('editExtra')).get(1).sendKeys('Yankees');
        element.all(by.name('editExtra')).get(2).sendKeys('1968');
        browser.sleep(2000);

        element.all(by.model('multipleCount')).clear();
        element.all(by.model('multipleCount')).first().sendKeys(3);
        browser.sleep(2000);

        element(by.name('submitEditCollectible')).click();
        browser.sleep(2000);

        expect(element(by.name('errorMessage')).getText()).toEqual("Current edit is still pending.");
        element(by.name('confirm')).click();
        browser.sleep(2000);
    });

    it('should vote', function() {
        browser.get(URL);

        element.all(by.model('email')).first().sendKeys('test@test.com');
        element.all(by.model('password')).first().sendKeys('test18');

        element(by.name('login')).click();

        // add to wishlist
        browser.sleep(2000);
        element(by.name('viewTroves')).click();
        browser.sleep(2000);

        element(by.repeater('(key, value) in troves').row(0)).click();
        browser.sleep(2000);

        // editCollectibleButton
        element(by.name('editCollectibleButton')).click();
        browser.sleep(2000);

        element(by.name('disapproveButton')).click();
        browser.sleep(2000);

        expect(element(by.name('errorMessage')).getText()).toEqual("Vote recorded.");
        element(by.name('confirm')).click();
        browser.sleep(2000);
    });

    it('should deny vote', function() {
        browser.get(URL);

        element.all(by.model('email')).first().sendKeys('test@test.com');
        element.all(by.model('password')).first().sendKeys('test18');

        element(by.name('login')).click();

        // add to wishlist
        browser.sleep(2000);
        element(by.name('viewTroves')).click();
        browser.sleep(2000);

        element(by.repeater('(key, value) in troves').row(0)).click();
        browser.sleep(2000);

        // editCollectibleButton
        element(by.name('editCollectibleButton')).click();
        browser.sleep(2000);

        element(by.name('disapproveButton')).click();
        browser.sleep(2000);

        expect(element(by.name('errorMessage')).getText()).toEqual("You have already voted.");
        element(by.name('confirm')).click();
        browser.sleep(2000);
    });

});
