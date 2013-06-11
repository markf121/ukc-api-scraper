var util = require('util'),
    Vow = require('vow');

module.exports = function (Scraper, ClimbRequester, CragScraper, GradeUtils, logger) {
  var requester = new ClimbRequester();

  function ClimbScraper (models) {
    Scraper.apply(this, [requester]);

    this.models = models;
    this.log = logger.child({'class': 'ClimbScraper'});
  }
  util.inherits(ClimbScraper, Scraper);

  ClimbScraper.prototype.scrape = function (id) {
    this._promise = Vow.promise();
    this.id = id;

    this._scrape(id).then(
      this._success,
      this._fail,
      null,
      this
    );

    return this._promise;
  };

  ClimbScraper.prototype._success = function (page) {
    var $ = page.$;
    var markup = page.markup;

    var data = {
      _id: parseInt(this.id, 10)
    };

    this.log.info('Climb scraped');

    this._promise.fulfill(data);

    /*var self = this;
    var saver = new ClimbSaver(data, this.models);
    saver.save().then(function (crag) {
      self._promise.fulfill(crag);
    }, this._fail, null, this);*/
  };

  ClimbScraper.prototype._fail = function (err) {
    this.log.error(err);
    this._promise.reject(err);
  };

  return ClimbScraper;
};
