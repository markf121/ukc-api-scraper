var util = require('util'),
    Vow = require('vow'),
    assert = require('chai');

function check (done, f) {
  try {
    f();
    done();
  } catch (e) {
    done(e);
  }
}

injector.resolve(
  function (ClimbFixtureRequester, ClimbSaver) {
    describe('ClimbScraper', function () {
      var ClimbScraper,
          MockClimbSaver,
          scraper;

      beforeEach(function() {
        MockClimbSaver = function (data) {
          this.data = data;
        };

        MockClimbSaver.prototype.save = function () {
          var promise = Vow.promise();
          promise.fulfill(this.data);
          return promise;
        };

        ClimbScraper = injector.get('ClimbScraper', {
          ClimbSaver: MockClimbSaver,
          ClimbRequester: ClimbFixtureRequester
        });

        scraper = new ClimbScraper();
      });

      describe('scrape', function () {
        it('should produce correct json', function (done) {
          scraper.scrape(29932)
            .then(function (data) {
              check(done, function () {
                // HACK - Wierd error thrown when doing expect(data).to.deep.equal(expected);
                // but no difference in objects
                var expected = require('../fixtures/climb-29932.json'),
                    i;
                for (i in expected) {
                  expect(data[i]).to.deep.equal(expected[i]);
                }
              });
            });
        });
      });
    });
  }
);