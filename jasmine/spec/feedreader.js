/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {
  /* This is our first test suite - a test suite just contains
  * a related set of tests. This suite is all about the RSS
  * feeds definitions, the allFeeds variable in our application.
  */
  describe('RSS Feeds', function() {
    /* This is our first test - it tests to make sure that the
     * allFeeds variable has been defined and that it is not
     * empty. Experiment with this before you get started on
     * the rest of this project. What happens when you change
     * allFeeds in app.js to be an empty array and refresh the
     * page?
     */
    it('are defined', function() {
      expect(allFeeds).toBeDefined();
      expect(allFeeds.length).not.toBe(0);
    });


    /* Write a test that loops through each feed
     * in the allFeeds object and ensures it has a URL defined
     * and that the URL is not empty.
     */
    it('all have hyperlinks defined and non-empty', function() {
      for (var i = 0; i < allFeeds.length; i++) {
        var feed = allFeeds[i];
        expect(feed.url).toBeDefined();
        expect(feed.url).not.toBe('');
        expect(feed.url).toMatch('http:\/\/*');
      }
    });

    /* Write a test that loops through each feed
    * in the allFeeds object and ensures it has a name defined
    * and that the name is not empty.
    */
    it('all have non-empty name', function() {
      for (var i = 0; i < allFeeds.length; i++) {
        var feed = allFeeds[i];
        expect(feed.name).toBeDefined();
        expect(feed.name).not.toBe('');
      }
    });
  });


  /* Write a new test suite named "The menu" */
  describe('The menu', function(){

    /* Write a test that ensures the menu element is
    * hidden by default. You'll have to analyze the HTML and
    * the CSS to determine how we're performing the
    * hiding/showing of the menu element.
    */
    it('should hide menu element by default', function() {
      expect(getMenuVisibility()).toBeFalsy();
    });

    /* Write a test that ensures the menu changes
    * visibility when the menu icon is clicked. This test
    * should have two expectations: does the menu display when
    * clicked and does it hide when clicked again.
    */
    describe('Menu icon button from close', function() {

      beforeEach(function(done) {
        var menuIcon = document.querySelector('.menu-icon-link');
        menuIcon.click();
        setTimeout(function() {
          done();
        }, 500);
      });

      it('should open the menu', function(done) {
        expect(getMenuVisibility()).toBeTruthy();
        done();
      });
    });

    describe('Menu icon button from open', function() {

      beforeEach(function(done) {
        var menuIcon = document.querySelector('.menu-icon-link');
        menuIcon.click();
        setTimeout(function() {
          done();
        }, 500);
      });

      it('should close the menu', function(done) {
        expect(getMenuVisibility()).toBeFalsy();
        done();
      });
    });

    // Check if the item with class .menu is visible by getting the edges of the
    // element and compare them with viewport edges
    function getMenuVisibility() {
      var menu = document.querySelector('.menu');
      var currentPosition = menu.getBoundingClientRect();
      var right = currentPosition.left + currentPosition.width;
      var bottom = currentPosition.top + currentPosition.height;
      var visible = true;
      visible = visible && right > 0;
      visible = visible && bottom > 0;
      visible = visible && currentPosition.left < innerWidth;
      visible = visible && currentPosition.top < innerHeight;
      return visible;
    }
  });

  /* Write a new test suite named "Initial Entries" */
  describe('Initial Entries', function() {

    /* Write a test that ensures when the loadFeed
    * function is called and completes its work, there is at least
    * a single .entry element within the .feed container.
    * Remember, loadFeed() is asynchronous so this test wil require
    * the use of Jasmine's beforeEach and asynchronous done() function.
    */
    beforeEach(function(done) {
      loadFeed(0, done);
    });

    it('should have at least one .entry element', function(done) {
      expect(document.querySelector('.entry')).not.toBe(null);
      done();
    });

  });

  /* Write a new test suite named "New Feed Selection" */
  describe('New Feed Selection', function() {

    /* Write a test that ensures when a new feed is loaded
    * by the loadFeed function that the content actually changes.
    * Remember, loadFeed() is asynchronous.
    */
    for (var i = 0; i < allFeeds.length; i++) {
      verifyFeedChanged(i);
    }

    // Load new feed and verify that the content has changed
    function verifyFeedChanged(i) {
      var nextFeedIndex = (i + 1) % allFeeds.length;
      describe('Feed Number ' + nextFeedIndex, function() {
        var oldFeed;
        var newFeed;
        beforeEach(function(done) {
          loadFeed(i, function() {
            oldFeed = getDisplayFeed();
            loadFeed(nextFeedIndex, done);
          });
        });

        it('should be different from previous feed', function(done) {
          var newFeed = getDisplayFeed();
          var remainTheSame = (oldFeed.length == newFeed.length);
          for (i = 0; i < Math.min(oldFeed.length, newFeed.length); i++) {
            var oldItem = oldFeed[i];
            var newItem = newFeed[i];
            remainTheSame = remainTheSame && (oldItem.header == newItem.header);
            remainTheSame = remainTheSame && (oldItem.url == newItem.url);
          }
          expect(remainTheSame).toBeFalsy();
          done();
        });
      });
    }

    // Get the header HTML and url of all entries that are currently displayed
    function getDisplayFeed() {
      var feed = [];
      var feedLinks = document.querySelectorAll('.entry-link');
      for (var i = 0; i < feedLinks.length; i++) {
        var feedHeader = feedLinks[i].querySelector('.entry').innerHTML;
        feed.push({
          header: feedHeader,
          url: feedLinks[i].getAttribute('href')
        });
      }
      return feed;
    }

  });

  // A new test suite called 'Feed Snippet'
  describe('Feed Snippet', function() {

    // Wait until load feed is done
    beforeEach(function(done) {
      loadFeed(0, done);
    });

    // Verify that there is a snippet class .entry-snippet under every displayed entry
    it('should appear on screen', function(done) {
      var entries = document.querySelectorAll('.entry-link');
      for (var i = 0; i < entries.length; i++) {
        var snippet = entries[i].querySelector('.entry-snippet');
        expect(snippet).not.toBe(null);
      }
      done();
    });
  });

}());
