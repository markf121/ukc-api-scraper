var Scraper = require('./Scraper'),
    Vow = require('vow'),
    util = require('util');

function GuidebookScraper (models) {
  this.models = models;
}
util.inherits(GuidebookScraper, Scraper);


GuidebookScraper.scrapeTitle = function ($) {
  return $('h1').text();
};

GuidebookScraper.scrapeInPrint = function ($) {
  return !$('b.error').length;
};

GuidebookScraper.scrapeAuthor = function ($) {
  return Scraper.pairScraper($, function (prop, val) {
    if (prop === 'author') {
      return val;
    }
  });
};

GuidebookScraper.scrapeYear = function ($) {
  return Scraper.pairScraper($, function (prop, val) {
    var year = null;
    if (prop === 'published') {
      var matches = val.match(/\s\((\d+)\)\s?$/);
      if (matches) {
        year = parseInt(matches[1], 10);
      }
      return year;
    }
  });
};

GuidebookScraper.scrapePublisher = function ($) {
  return Scraper.pairScraper($, function (prop, val) {
    if (prop === 'published') {
      return val.replace(/\s\(\d+\)\s?$/, '');
    }
  });
};

GuidebookScraper.scrapeIsbn = function ($) {
  return Scraper.pairScraper($, function (prop, val) {
    if (prop === 'isbn') {
      return val;
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


GuidebookScraper.prototype.scrape = function (id, params) {
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

  console.info(this.data);
  this._promise.fulfill(this.data);
};

GuidebookScraper.prototype._fail = function (err) {
  this._promise.reject(err);
};

module.exports = GuidebookScraper;