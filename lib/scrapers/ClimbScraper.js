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
    return $('#main tr:nth-child(2)').first().find('b').first().text();
  };

  ClimbScraper.scrapeGrade = function ($) {
    var rawGrade = $('#main td[align=right] b').first().text().trim();
    return GradeUtils.parseRawGrade(rawGrade);
  };

  ClimbScraper.scrapeStars = function ($) {
    var stars = 0,
        img = $('#main img').first();

    if (img.length) {
      stars = img.attr('alt').length;
    }

    return stars;
  };

  ClimbScraper.scrapeCrag = function ($) {
    var match = $('#main td').first().find('a').attr('href').match(/(\d+)$/);

    return match ? parseInt(match[1], 10) : null;
  };

  ClimbScraper.scrapeDescription = function ($) {

  };

  ClimbScraper.scrapeGuidebookPublisher = function ($) {
    var font = $('#main font[size=1]').first().text(),
        match = font.match(/\u00a9\s(.*?)$/);

    return match ? match[1] : null;
  };

  ClimbScraper.scrapeHeight = function ($) {
    var font = $('#main font[color=#666666]').first().text(),
        match = font.match(/^(\d+)m[\.|,]/);

    return match ? parseInt(match[1], 10) : null;
  };

  ClimbScraper.scrapePitches = function ($) {
    var font = $('#main font[color=#666666]').first().text(),
        match = font.match(/(\d+) pitches\.$/);

    return match ? parseInt(match[1], 10) : null;
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

  ClimbScraper.scrapeModerated = function (markup) {
    return !(markup.match(/This newly updated climb is waiting to be checked by the crag moderator/));
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
      moderated: ClimbScraper.scrapeModerated(markup)
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
