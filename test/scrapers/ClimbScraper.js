var util = require('util'),
    Vow = require('vow');

function check (done, f) {
  try {
    f();
    done();
  } catch (e) {
    done(e);
  }
}

injector.resolve(
  function (CragFixtureRequester, CragSaver) {
    describe('CragScraper', function () {
      var CragScraper,
          MockCragSaver,
          scraper;

      beforeEach(function() {
        MockCragSaver = function (data) {
          this.data = data;
        };

        MockCragSaver.prototype.save = function () {
          var promise = Vow.promise();
          promise.fulfill(this.data);
          return promise;
        };

        CragScraper = injector.get('CragScraper', {
          CragSaver: MockCragSaver,
          CragRequester: CragFixtureRequester
        });

        scraper = new CragScraper();
      });

      describe('scrape', function () {
        it('should produce correct json', function (done) {
          scraper.scrape(5)
            .then(function (data) {
              check(done, function () {
                expect(data).to.deep.equal(require('../fixtures/crag-5.json'));
              });
            });
        });
      });
    });
  }
);