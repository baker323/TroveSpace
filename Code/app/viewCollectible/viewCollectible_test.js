describe('TroveSpace Edit Item: ', function() {

    // const URL = 'https://baker323.github.io/#!/login';
    const URL = 'http://127.0.0.1:60788/#!/login';


    it('should add timestamp for wishlist', function() {
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
        element(by.name('addToWishlist')).click();
        browser.sleep(2000);
        expect(element(by.name('errorMessage')).getText()).toEqual("Item successfully added.");
        element(by.name('confirm')).click();

        browser.sleep(2000);
        element(by.name('myWishlist')).click();
        browser.sleep(2000);

        element.all(by.name('viewItemInWishlist')).get(0).click();
        browser.sleep(2000);

        browser.actions().mouseMove(element(by.name('submitEditCollectible'))).perform();
        browser.sleep(2000);

    });


    it('should create new folder', function() {
        browser.get(URL);

        element.all(by.model('email')).first().sendKeys('test@test.com');
        element.all(by.model('password')).first().sendKeys('test18');

        element(by.name('login')).click();

        // add folder
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

        // 2nd one
        element(by.name('newFolder')).click();
        browser.sleep(2000);

        element.all(by.model('folderName')).first().sendKeys('test2');
        element(by.repeater('(key, value) in troves').row(1)).click();
        browser.sleep(2000);
        element(by.name('confirmFolder')).click();
        browser.sleep(2000);
        expect(element(by.name('errorMessage')).getText()).toEqual("There are currently no collectibles in this folder.");
        element(by.name('confirm')).click();
        browser.sleep(2000);


    });

    it('should add timestamp for collection', function() {
        browser.get(URL);

        element.all(by.model('email')).first().sendKeys('test@test.com');
        element.all(by.model('password')).first().sendKeys('test18');

        element(by.name('login')).click();
        browser.sleep(2000);

        // add collectible
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

        element(by.name('myCollection')).click();
        browser.sleep(2000);

        // editCollectibleButton
        element.all(by.name('editCollectibleInCollection')).get(0).click();
        browser.sleep(2000);

        browser.actions().mouseMove(element(by.name('submitEditCollectible'))).perform();
        browser.sleep(2000);
        // editCollectibleInCollection

        // removeFromCollection
    });

    it('should add collectible to another collection', function() {
        browser.get(URL);

        element.all(by.model('email')).first().sendKeys('test@test.com');
        element.all(by.model('password')).first().sendKeys('test18');

        element(by.name('login')).click();
        browser.sleep(2000);

        element(by.name('viewTroves')).click();
        browser.sleep(2000);
        element(by.repeater('(key, value) in troves').row(1)).click();
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

        element(by.name('myCollection')).click();
        browser.sleep(2000);
        // editCollectibleInCollection

        // removeFromCollection
    });


    it('edit collection and change multiple count', function() {
        browser.get(URL);

        element.all(by.model('email')).first().sendKeys('testtest@test.com');
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
        element(by.name('saveMultipleCount')).click();
        browser.sleep(2000);
        expect(element(by.name('errorMessage')).getText()).toEqual("Information saved.");
        element(by.name('confirm')).click();
        browser.sleep(2000);

        element(by.name('submitEditCollectible')).click();
        browser.sleep(2000);

        expect(element(by.name('errorMessage')).getText()).toEqual("Your edit has been submitted for approval.");
        element(by.name('confirm')).click();
        // disapproveButton
    });

    it('should get notification', function() {
        browser.get(URL);

        element.all(by.model('email')).first().sendKeys('test@test.com');
        element.all(by.model('password')).first().sendKeys('test18');

        element(by.name('login')).click();
        browser.sleep(2000);
        element(by.name('viewTroves')).click();
        browser.sleep(2000);
        //clickNotification
        element(by.name('clickNotification')).click();
        browser.sleep(2000);
        // removeNotification
        element(by.name('removeNotification')).click();
        browser.sleep(2000);
        element(by.name('non-notification')).click();
        browser.sleep(6000);
    })

    it('should mark and unmark for sale and check who is for sale', function() {
      browser.get(URL);

      element.all(by.model('email')).first().sendKeys('test@test.com');
      element.all(by.model('password')).first().sendKeys('test18');
      element(by.name('login')).click();
      browser.sleep(2000);
      element(by.name('viewTroves')).click();
      browser.sleep(2000);

      element(by.repeater('(key, value) in troves').row(1)).click();
      browser.sleep(2000);

      // editCollectibleButton
      element.all(by.name('editCollectibleButton')).get(0).click();
      browser.sleep(2000);
      // collectionDropdown
      element(by.name('collectionDropdown')).click();
      browser.sleep(2000);
      element(by.name('markAsForSale')).click();
      browser.sleep(2000);
      // A listing for this item has been created. Your email will be visible to other users.
      expect(element(by.name('errorMessage')).getText()).toEqual("A listing for this item has been created. Your email will be visible to other users.");
      element(by.name('confirm')).click();
      browser.sleep(2000);

      browser.actions().mouseMove(element(by.name('submitEditCollectible'))).perform();
      browser.sleep(2000);
      // viewAllUserCollection
      element(by.name('viewAllUserForSale')).click();
      browser.sleep(2000);
      element(by.name('confirmOKForSale')).click();
      browser.sleep(2000);
      element(by.name('collectionDropdown')).click();
      browser.sleep(2000);
      element(by.name('markAsNotForSale')).click();
      browser.sleep(2000);
      // Your listing for this item has been removed.
      expect(element(by.name('errorMessage')).getText()).toEqual("Your listing for this item has been removed.");
      element(by.name('confirm')).click();
      browser.sleep(2000);
    });


    // testing create new collectibles
    it('should create new collectible', function() {
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
        element.all(by.model('collectibleTitle')).first().sendKeys('test');
        element.all(by.model('collectibleDescription')).first().sendKeys('test');
        // newCollectibleInfo
        element.all(by.name('newCollectibleInfo')).get(0).sendKeys('Hello World');
        element.all(by.name('newCollectibleInfo')).get(1).sendKeys('Hello World');
        element.all(by.name('newCollectibleInfo')).get(2).sendKeys('Hello World');
        browser.sleep(2000);

        //newCollectibleInfoSubmit
        element(by.name('newCollectibleInfoSubmit')).click();
        browser.sleep(2000);
    });

    it('should deny creating new collectible', function() {
        browser.get(URL);

        element.all(by.model('email')).first().sendKeys('test@test.com');
        element.all(by.model('password')).first().sendKeys('test18');

        element(by.name('login')).click();

        // add to collectible
        browser.sleep(2000);
        element(by.name('viewTroves')).click();
        browser.sleep(2000);

        element(by.repeater('(key, value) in troves').row(0)).click();
        browser.sleep(2000);
        element(by.name('newCollectible')).click();
        browser.sleep(2000);
        element.all(by.model('collectibleTitle')).first().sendKeys('test');
        element.all(by.model('collectibleDescription')).first().sendKeys('test');
        // newCollectibleInfo
        element.all(by.name('newCollectibleInfo')).get(0).sendKeys('Hello World');
        element.all(by.name('newCollectibleInfo')).get(1).sendKeys('Hello World');
        element.all(by.name('newCollectibleInfo')).get(2).sendKeys('Hello World');
        browser.sleep(2000);

        //newCollectibleInfoSubmit
        element(by.name('newCollectibleInfoSubmit')).click();
        browser.sleep(2000);
        expect(element(by.name('errorMessage')).getText()).toEqual("Collectible with that name already exists.");
        element(by.name('confirm')).click();
        browser.sleep(2000);
    });

    it('should mark duplicates', function() {
        browser.get(URL);

        element.all(by.model('email')).first().sendKeys('test@test.com');
        element.all(by.model('password')).first().sendKeys('test18');
        element(by.name('login')).click();
        browser.sleep(2000);
        element(by.name('viewTroves')).click();
        browser.sleep(2000);

        element(by.repeater('(key, value) in troves').row(0)).click();
        browser.sleep(2000);

        // editCollectibleButton
        element.all(by.name('editCollectibleButton')).get(1).click();
        browser.sleep(2000);
        // collectionDropdown
        element(by.name('collectionDropdown')).click();
        browser.sleep(2000);
        element(by.name('markAsDuplicate')).click();
        browser.sleep(2000);

        // selectDuplicateCollectible
        element(by.name('selectDuplicateCollectible')).click();
        browser.sleep(2000);
        // decideDuplicateCollectible
        element.all(by.name('decideDuplicateCollectible')).get(1).click();
        browser.sleep(2000);
        element(by.name('submitDuplicateName')).click();
        browser.sleep(2000);
        expect(element(by.name('errorMessage')).getText()).toEqual("Vote recorded.");
        element(by.name('confirm')).click();
        browser.sleep(2000);

    });

    it('should vote no for duplicate', function() {
        browser.get(URL);

        element.all(by.model('email')).first().sendKeys('test@test.com');
        element.all(by.model('password')).first().sendKeys('test18');
        element(by.name('login')).click();
        browser.sleep(2000);
        element(by.name('viewTroves')).click();
        browser.sleep(2000);

        element(by.repeater('(key, value) in troves').row(0)).click();
        browser.sleep(2000);

        // editCollectibleButton
        element.all(by.name('editCollectibleButton')).get(0).click();
        browser.sleep(2000);
        // collectionDropdown
        element(by.name('collectionDropdown')).click();
        browser.sleep(2000);
        // markAsDuplicate
        element(by.name('markAsDuplicate')).click();
        browser.sleep(2000);
        // duplicateNameNo
        element(by.name('duplicateNameNo')).click();
        browser.sleep(2000);
        expect(element(by.name('errorMessage')).getText()).toEqual("Vote recorded.");
        element(by.name('confirm')).click();
        browser.sleep(2000);

        element(by.name('collectionDropdown')).click();
        browser.sleep(2000);
        // markAsDuplicate
        element(by.name('markAsDuplicate')).click();
        browser.sleep(2000);
        expect(element(by.name('errorMessage')).getText()).toEqual("You have already voted.");
        element(by.name('confirm')).click();
    })


    it('should rate the collectible', function() {
        // star
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
        element(by.name('star1')).click();
        browser.sleep(2000);
        element(by.name('star2')).click();
        browser.sleep(2000);
        element(by.name('star3')).click();
        browser.sleep(2000);
        element(by.name('star4')).click();
        browser.sleep(2000);
        element(by.name('star5')).click();
        browser.sleep(2000);
    });


    it("should check number of users who put into collection", function() {
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

        browser.actions().mouseMove(element(by.name('submitEditCollectible'))).perform();
        browser.sleep(2000);
        // viewAllUserCollection
        element(by.name('viewAllUserCollection')).click();
        browser.sleep(2000);
        // collectUser
        element.all(by.name('collectUser')).get(3).click();
        browser.sleep(2000);

        // contactInfo
        element(by.name('contactInfo')).click();
        browser.sleep(2000);
        element(by.name('confirmUserContact')).click();
        browser.sleep(2000);
        // selectUserCategory
        element(by.name('selectUserCategory')).click();
        browser.sleep(2000);
        // userCategoryOption
        element.all(by.name('userCategoryOption')).get(2).click();
        browser.sleep(2000);
    });

it("should check number of users who put into wishlist", function() {
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

    browser.actions().mouseMove(element(by.name('submitEditCollectible'))).perform();
    browser.sleep(2000);
    // viewAllUserWishlist
    element(by.name('viewAllUserWishlist')).click();
    browser.sleep(2000);
    // wishlistUser
    element.all(by.name('wishlistUser')).get(0).click();
    browser.sleep(2000);

    // selectUserCategory
    element(by.name('viewWishlistsInUser')).click();
    browser.sleep(2000);
    // userCategoryOption
    element(by.name('viewCollectionsInUser')).click();
    browser.sleep(2000);
});

it('should comment on the collectible and delete the comment', function() {
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
    // commentText
    element(by.name('commentText')).sendKeys('Hello World!');
    browser.sleep(2000);
    element(by.name('submitComment')).click();
    browser.sleep(2000);
    expect(element(by.name('errorMessage')).getText()).toEqual("Comment sent.");
    element(by.name('confirm')).click();
    browser.sleep(2000);
    // commentDelete
    element(by.name('commentDelete')).click();
    browser.sleep(2000);
    expect(element(by.name('errorMessage')).getText()).toEqual("Comment deleted.");
    element(by.name('confirm')).click();
    browser.sleep(2000);

});

it('should replay comment on the collectible and vote', function() {
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

    // upvoteComment
    element(by.name('upvoteComment')).click();
    browser.sleep(2000);
    // downvoteComment
    element(by.name('downvoteComment')).click();
    browser.sleep(2000);
    element(by.name('un-downvoteComment')).click();
    browser.sleep(2000);
    // replayComment
    element(by.name('replayComment')).click();
    browser.sleep(2000);
    // replayCommentText
    element(by.name('replayCommentText')).sendKeys('Hello World!');
    browser.sleep(2000);
    element(by.name('submitReplyComment')).click();
    browser.sleep(2000);
    expect(element(by.name('errorMessage')).getText()).toEqual("Reply sent.");
    element(by.name('confirm')).click();
    browser.sleep(2000);
    element.all(by.name('deleteReplyComment')).get(1).click();
    browser.sleep(2000);
    expect(element(by.name('errorMessage')).getText()).toEqual("Reply deleted.");
    element(by.name('confirm')).click();
    browser.sleep(2000);

});


    it('should follow Trove', function() {
        browser.get(URL);

        element.all(by.model('email')).first().sendKeys('test@test.com');
        element.all(by.model('password')).first().sendKeys('test18');
        element(by.name('login')).click();

        browser.sleep(2000);
        element(by.name('viewTroves')).click();
        browser.sleep(2000);
        element(by.name('followedTrovesTab')).click();
        browser.sleep(2000);

        expect(element(by.name('errorMessage')).getText()).toEqual("You are currently not following any troves.");
        element(by.name('confirm')).click();

        browser.sleep(2000);
        element(by.name('viewTroves')).click();
        browser.sleep(2000);

        element(by.repeater('(key, value) in troves').row(1)).click();
        browser.sleep(2000);

        // followingTrove
        element(by.name('followingTrove')).click();
        browser.sleep(2000);
        element(by.name('viewTroves')).click();
        browser.sleep(2000);
        element(by.name('followedTrovesTab')).click();
        browser.sleep(2000);
        // allTrovesTab
        element(by.name('allTrovesTab')).click();
        browser.sleep(2000);

    });

    it('should unfollow Trove', function() {
        browser.get(URL);

        element.all(by.model('email')).first().sendKeys('test@test.com');
        element.all(by.model('password')).first().sendKeys('test18');
        element(by.name('login')).click();

        browser.sleep(2000);
        element(by.name('viewTroves')).click();
        browser.sleep(2000);
        element(by.name('followedTrovesTab')).click();
        browser.sleep(2000);

        element(by.repeater('(key, value) in troves').row(0)).click();
        browser.sleep(2000);

        element(by.name('unfollowingTrove')).click();
        browser.sleep(2000);

        element(by.name('viewTroves')).click();
        browser.sleep(2000);
        element(by.name('followedTrovesTab')).click();
        browser.sleep(2000);

        expect(element(by.name('errorMessage')).getText()).toEqual("You are currently not following any troves.");
        element(by.name('confirm')).click();
        browser.sleep(2000);
    })

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

    it('should delete the folders', function() {
        // login
        browser.get(URL);

        element.all(by.model('email')).first().sendKeys('test@test.com');
        element.all(by.model('password')).first().sendKeys('test18');

        element(by.name('login')).click();
        browser.sleep(2000);
        element(by.name('myCollection')).click();
        browser.sleep(2000);
        element(by.name('deleteFolder')).click();
        browser.sleep(2000);
        expect(element(by.name('errorMessage')).getText()).toEqual("There are currently no collectibles in this folder.");
        element(by.name('confirm')).click();
        browser.sleep(2000);
        element(by.name('deleteFolder')).click();
        browser.sleep(2000);

        expect(element(by.name('errorMessage')).getText()).toEqual("You currently don't have any folders.");
        element(by.name('confirm')).click();
        browser.sleep(2000);
    });

});
