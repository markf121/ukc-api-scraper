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

  ClimbScraper.scrapeName = function ($) {

  };

  ClimbScraper.scrapeGrade = function ($) {
    var rawGrade = $('#main td[align=right] b').first().text().trim();
    return GradeUtils.parseRawGrade(rawGrade);
  };

  ClimbScraper.scrapeStars = function ($) {

  };

  ClimbScraper.scrapeCrag = function ($) {

  };

  ClimbScraper.scrapeDescription = function ($) {

  };

  ClimbScraper.scrapeGuidebookDescription = function ($) {

  };

  ClimbScraper.scrapeGuidebookPublisher = function ($) {

  };

  ClimbScraper.scrapeHeight = function ($) {

  };

  ClimbScraper.scrapePitches = function ($) {

  };

  ClimbScraper.scrapeFirstAscentionists = function ($) {

  };

  ClimbScraper.scrapeFirstAscentDate = function ($) {

  };

  ClimbScraper.scrapeTotalTicks = function ($) {

  };

  ClimbScraper.scrapeTicks = function ($) {

  };

  ClimbScraper.scrapeTicklists = function ($) {

  };

  ClimbScraper.scrapeModerated = function ($) {

  };

  ClimbScraper.scrapeUkcUpdated = function ($) {

  };


  ClimbScraper.prototype._success = function (page) {
    var $ = page.$;
    var markup = page.markup;

    var grade = ClimbScraper.scrapeGrade($);
    var ukTechGrade = grade.ukTechGrade;
    var climbType = grade.climbType;

    delete grade.ukTechGrade;
    delete grade.climbType;
    delete grade.stars;

    var data = {
      _id: parseInt(this.id, 10),
      name: ClimbScraper.scrapeName($),
      crag: ClimbScraper.scrapeCrag($),
      description: ClimbScraper.scrapeDescription($),
      guidebookDescription: ClimbScraper.scrapeGuidebookDescription($),
      guidebookPublisher: ClimbScraper.scrapeGuidebookPublisher($),
      height: ClimbScraper.scrapeHeight($),
      pitches: ClimbScraper.scrapePitches($),
      climbType: climbType,
      grade: grade,
      ukTechGrade: ukTechGrade,
      stars: ClimbScraper.scrapeStars($),
      firstAscentionists: ClimbScraper.scrapeFirstAscentionists($),
      firstAscentDate: ClimbScraper.scrapeFirstAscentDate($),
      totalTicks: ClimbScraper.scrapeTotalTicks($),
      ticks: ClimbScraper.scrapeTicks($),
      ticklists: ClimbScraper.scrapeTicklists($),
      moderated: ClimbScraper.scrapeModerated($),
      ukcUpdated: ClimbScraper.scrapeUkcUpdated($)
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
