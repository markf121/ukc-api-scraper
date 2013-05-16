var Scraper = require('./Scraper'),
    util = require('util');

function GuidebookScraper (models) {
  this.models = models;
}
util.inherits(GuidebookScraper, Scraper);


GuidebookScraper.scrapeTitle = function ($) {
  return $('h1').text();
};

GuidebookScraper.scrapeIsbn = function ($) {
  return Scraper.pairScraper($, function (prop, val) {
    if (prop === 'ISBN') {
      return val;
    }
  });
};

GuidebookScraper.scrapeYear = function ($) {
  return Scraper.pairScraper($, function (prop, val) {
    var year = null;
    if (prop === 'Published') {
      var matches = val.match(/\s\((\d+)\)\s?$/);
      if (matches) {
        year = matches[1];
      }
      return year;
    }
  });
};

GuidebookScraper.scrapeInPrint = function ($) {
  return !$('b.error').length;
};

GuidebookScraper.scrapeAuthor = function ($) {
  return Scraper.pairScraper($, function (prop, val) {
    if (prop === 'Author') {
      return val;
    }
  });
};

GuidebookScraper.scrapePublisher = function ($) {
  return Scraper.pairScraper($, function (prop, val) {
    if (prop === 'Published') {
      return val.replace(/\s\(\d+\)\s?$/, '');
    }
  });
};

GuidebookScraper.scrapeWebsite = function ($) {
  var url = null;
  $('#main b').each(function (i, el) {
    var $el = $(el);
    if ($el.text() === 'Website') {
      url = $el.sibling('a').attr('href');
    }
  });

  return url;
};

// TODO: Get all paragraphs - not just first
GuidebookScraper.scrapeReview = function ($) {
  var review = null;
  $('#main b').each(function (i, el) {
    var $el = $(el);
    if ($el.text() === 'Review') {
      review = Scraper.getTextForBoldTitle($el);
      return false;
    }
  });

  return review;
};


GuidebookScraper.prototype.scrape = function () {
  this._promise = Vow.promise();
  this.id = id;

  params.url = '/logbook/book.php?id=' + id;

  this._scrape(params).then(
    this._success,
    this._fail,
    null,
    this
  );

  return this._promise;
};

GuidebookScraper.prototype._success = function (page) {
  var $ = page.$;
  var markup = page.markup;

  this.data = {
    title: GuidebookScraper.scrapeTitle($),
    isbn: GuidebookScraper.scrapeIsbn($),
    year: GuidebookScraper.scrapeYear($),
    inPrint: GuidebookScraper.scrapeInPrint($),
    author: GuidebookScraper.scrapeAuthor($),
    publisher: GuidebookScraper.scrapePublisher($),
    website: GuidebookScraper.scrapeWebsite($),
    review: GuidebookScraper.scrapeReview($)
  };
};

GuidebookScraper.prototype._fail = function (err) {
  this._promise.reject(err);
};

module.exports = GuidebookScraper;