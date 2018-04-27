describe('troves module', function() {

    // const URL = 'https://baker323.github.io/#!/login';
    const URL = 'http://127.0.0.1:60788/#!/login';
/*
    it('should successfully added to wishlist', function() {
        // login
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
        //element(by.repeater('(key, value) in troveCollectibles').row(1).element(by.name('addButton')).click());
        //browser.sleep(12000);
        element(by.name('addButton')).click();
        browser.sleep(2000);
        element(by.name('addToWishlist')).click();
        browser.sleep(2000);
        expect(element(by.name('errorMessage')).getText()).toEqual("Item successfully added.");
        element(by.name('confirm')).click();
        browser.sleep(2000);
        element(by.name('viewTroves')).click();
        browser.sleep(2000);
        element(by.repeater('(key, value) in troves').row(1)).click();
        browser.sleep(2000);
        element(by.name('addButton')).click();
        browser.sleep(2000);
        element(by.name('addToWishlist')).click();
        browser.sleep(2000);
        expect(element(by.name('errorMessage')).getText()).toEqual("Item successfully added.");
        element(by.name('confirm')).click();
        browser.sleep(2000);
    });
    it('should successfully remove all wishlist', function() {
        browser.get(URL);
        element.all(by.model('email')).first().sendKeys('test@test.com');
        element.all(by.model('password')).first().sendKeys('test18');
        element(by.name('login')).click();
        browser.sleep(2000);
        element(by.name('myWishlist')).click();
        browser.sleep(2000);
        element(by.repeater('(key, value) in wishlist').row(0)).click();
        browser.sleep(2000);
        element(by.name('removeFromWishlist')).click();
        browser.sleep(2000);
        // remove
        element(by.repeater('(key, value) in wishlist').row(0)).click();
        browser.sleep(2000);
        element(by.name('removeFromWishlist')).click();
        browser.sleep(2000);
        expect(element(by.name('errorMessage')).getText()).toEqual("There are currently no collectibles on your wishlist.");
        element(by.name('confirm')).click();
        browser.sleep(2000);
    });
    it('should deny for adding to collection', function() {
        // login
        browser.get(URL);
        element.all(by.model('email')).first().sendKeys('test@test.com');
        element.all(by.model('password')).first().sendKeys('test18');
        element(by.name('login')).click();
        // add
        browser.sleep(2000);
        element(by.name('viewTroves')).click();
        browser.sleep(2000);
        element(by.repeater('(key, value) in troves').row(0)).click();
        browser.sleep(2000);
        element(by.name('addButton')).click();
        browser.sleep(2000);
        element(by.name('error_addToFolder')).click();
        browser.sleep(2000);
        expect(element(by.name('errorMessage')).getText()).toEqual("There are no folders that match this collectible. Please create a folder.");
        element(by.name('confirm')).click();
        browser.sleep(2000);
    });
    it('should successfully make folder', function() {
        // login
        browser.get(URL);
        element.all(by.model('email')).first().sendKeys('test@test.com');
        element.all(by.model('password')).first().sendKeys('test18');
        element(by.name('login')).click();
        // myCollection
        browser.sleep(2000);
        element(by.name('myCollection')).click();
        browser.sleep(2000);
        expect(element(by.name('errorMessage')).getText()).toEqual("You currently don't have any folders.");
        element(by.name('confirm')).click();
        browser.sleep(2000);
        element(by.name('newFolder')).click();
        browser.sleep(2000);
        element.all(by.model('folderName')).first().sendKeys('test');
        element(by.repeater('(key, value) in troves').row(0)).click();
        browser.sleep(2000);
        element(by.name('confirmFolder')).click();
        browser.sleep(2000);
        expect(element(by.name('errorMessage')).getText()).toEqual("There are currently no collectibles in this folder.");
        element(by.name('confirm')).click();
        browser.sleep(2000);
    });
    it('should rename the folder', function() {
        // login
        browser.get(URL);
        element.all(by.model('email')).first().sendKeys('test@test.com');
        element.all(by.model('password')).first().sendKeys('test18');
        element(by.name('login')).click();
        browser.sleep(2000);
        element(by.name('myCollection')).click();
        browser.sleep(2000);
        expect(element(by.name('errorMessage')).getText()).toEqual("There are currently no collectibles in this folder.");
        element(by.name('confirm')).click();
        browser.sleep(2000);
        element(by.name('renameFolder')).click();
        browser.sleep(2000);
        element.all(by.model('newName')).first().sendKeys('TEST');
        element(by.name('confirmNewName')).click();
        browser.sleep(2000);
        expect(element(by.name('errorMessage')).getText()).toEqual("There are currently no collectibles in this folder.");
        element(by.name('confirm')).click();
        browser.sleep(2000);
    });
    it('should add new collectives', function() {
        // login
        browser.get(URL);
        element.all(by.model('email')).first().sendKeys('test@test.com');
        element.all(by.model('password')).first().sendKeys('test18');
        element(by.name('login')).click();
        browser.sleep(2000);
        element(by.name('viewTroves')).click();
        browser.sleep(2000);
        element(by.repeater('(key, value) in troves').row(0)).click();
        browser.sleep(2000);
        element(by.name('addButton')).click();
        browser.sleep(2000);
        element(by.name('addToFolder')).click();
        browser.sleep(2000);
        element(by.name('confirmAddToCollection')).click();
        browser.sleep(2000);
        expect(element(by.name('errorMessage')).getText()).toEqual("Item successfully added.");
        element(by.name('confirm')).click();
        browser.sleep(2000);
    });
    it('should create another folder', function() {
        // login
        browser.get(URL);
        element.all(by.model('email')).first().sendKeys('test@test.com');
        element.all(by.model('password')).first().sendKeys('test18');
        element(by.name('login')).click();
        // myCollection
        browser.sleep(2000);
        element(by.name('myCollection')).click();
        browser.sleep(2000);
        element(by.name('newFolder')).click();
        browser.sleep(2000);
        element.all(by.model('folderName')).first().sendKeys('hats');
        element(by.repeater('(key, value) in troves').row(1)).click();
        browser.sleep(2000);
        element(by.name('confirmFolder')).click();
        browser.sleep(2000);
        //expect(element(by.name('errorMessage')).getText()).toEqual("There are currently no collectibles in this folder.");
        //element(by.name('confirm')).click();
        //browser.sleep(2000);
    });
    it('should deny creating the same folder', function() {
        // login
        browser.get(URL);
        element.all(by.model('email')).first().sendKeys('test@test.com');
        element.all(by.model('password')).first().sendKeys('test18');
        element(by.name('login')).click();
        // myCollection
        browser.sleep(2000);
        element(by.name('myCollection')).click();
        browser.sleep(2000);
        element(by.name('newFolder')).click();
        browser.sleep(2000);
        element.all(by.model('folderName')).first().sendKeys('hats');
        element(by.repeater('(key, value) in troves').row(1)).click();
        browser.sleep(2000);
        element(by.name('confirmFolder')).click();
        browser.sleep(2000);
        //expect(element(by.name('errorMessage')).getText()).toEqual("Folder with that name already exists.");
        //element(by.name('confirm')).click();
        //browser.sleep(2000);
    });
    it('should delete the folder', function() {
        // login
        browser.get(URL);
        element.all(by.model('email')).first().sendKeys('test@test.com');
        element.all(by.model('password')).first().sendKeys('test18');
        element(by.name('login')).click();
        browser.sleep(2000);
        element(by.name('myCollection')).click();
        browser.sleep(2000);
        element(by.repeater('(key, value) in collections').row(1)).click();
        browser.sleep(2000);
        expect(element(by.name('errorMessage')).getText()).toEqual("There are currently no collectibles in this folder.");
        element(by.name('confirm')).click();
        browser.sleep(2000);
        element(by.name('deleteFolder')).click();
        browser.sleep(2000);
    });
    it('should delete another folder', function() {
        // login
        browser.get(URL);
        element.all(by.model('email')).first().sendKeys('test@test.com');
        element.all(by.model('password')).first().sendKeys('test18');
        element(by.name('login')).click();
        browser.sleep(2000);
        element(by.name('myCollection')).click();
        browser.sleep(2000);
        element(by.repeater('(key, value) in collections').row(0)).click();
        browser.sleep(2000);
        element(by.name('deleteFolder')).click();
        browser.sleep(2000);
        expect(element(by.name('errorMessage')).getText()).toEqual("You currently don't have any folders.");
        element(by.name('confirm')).click();
        browser.sleep(2000);
    });


    it('should cancel the create Trove', function() {
        // login
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
        element(by.name('newCollectible')).click();
        browser.sleep(2000);
        element(by.name('cancelCreateCollectible')).click();
    });

    // testing create new Troves
    it('should create new Trove', function() {
        // login
        browser.get(URL);
        element.all(by.model('email')).first().sendKeys('test@test.com');
        element.all(by.model('password')).first().sendKeys('test18');
        element(by.name('login')).click();
        // add to wishlist
        browser.sleep(2000);
        element(by.name('viewTroves')).click();
        browser.sleep(2000);
        element(by.name('addNewTrove')).click();
        browser.sleep(2000);
        //troveName
        element.all(by.model('troveName')).first().sendKeys('TestTest');
        element.all(by.model('troveDescription')).first().sendKeys('TestTest');
        element(by.name('addField')).click();
        browser.sleep(2000);
        element.all(by.model('choice.name')).first().sendKeys('Test');
        browser.sleep(2000);
        element(by.name('removeChoice')).click();
        browser.sleep(2000);
        element(by.name('submitNewTrove')).click();
        browser.sleep(2000);
    });
*/
    it('should send remove request for the specific Trove', function() {
        browser.get(URL);

        element.all(by.model('email')).first().sendKeys('test@test.com');
        element.all(by.model('password')).first().sendKeys('test18');

        element(by.name('login')).click();

        browser.sleep(2000);
        element(by.name('viewTroves')).click();
        browser.sleep(2000);

        element(by.repeater('(key, value) in troves').row(0)).click();
        browser.sleep(2000);
        // dropdownForRemoveRequest
        element(by.name('dropdownForRemoveRequest')).click();
        browser.sleep(2000);
        // sendRomveRequest
        element(by.name('sendRomveRequest')).click();
        browser.sleep(2000);
        expect(element(by.name('errorMessage')).getText()).toEqual("Request submitted for review.");
        element(by.name('confirm')).click();
        browser.sleep(2000);
        // Your request has already been submitted.
        element(by.name('dropdownForRemoveRequest')).click();
        browser.sleep(2000);
        // sendRomveRequest
        element(by.name('sendRomveRequest')).click();
        browser.sleep(2000);
        expect(element(by.name('errorMessage')).getText()).toEqual("Your request has already been submitted.");
        element(by.name('confirm')).click();
    });

});
