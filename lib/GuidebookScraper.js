var Scraper = require('./Scraper'),
    Vow = require('vow'),
    util = require('util');

function GuidebookScraper (models) {
  this.models = models;
  this.model = models.Guidebook;
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
      var publisher = val.replace(/\s\(\d+\)\s?$/, '');
      if (publisher === '?') {
        publisher = null;
      }
      return publisher;
    }
  });
};

GuidebookScraper.scrapeIsbn = function ($) {
  return Scraper.pairScraper($, function (prop, val) {
    if (prop === 'isbn' && val) {
      return val.replace(/\D/g, '');
    }
  });
};

GuidebookScraper.scrapeWebsite = function ($) {
  var url = null;
  $('#main b').each(function (i, el) {
    var $el = $(el);
    if ($el.text() === 'Website') {
      url = $el.next().next().attr('href');
      return false;
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
      /*$p = $el.parent();
      while (($p = $p.next())) {
        console.info($p);
      }*/
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
    _id: this.id,
    title: GuidebookScraper.scrapeTitle($),
    isbn: GuidebookScraper.scrapeIsbn($),
    year: GuidebookScraper.scrapeYear($),
    inPrint: GuidebookScraper.scrapeInPrint($),
    author: GuidebookScraper.scrapeAuthor($),
    publisher: GuidebookScraper.scrapePublisher($),
    website: GuidebookScraper.scrapeWebsite($),
    review: GuidebookScraper.scrapeReview($),
    updated: Date.now(),
    complete: true
  };

  this._save(this.data);
};

GuidebookScraper.prototype._fail = function (err) {
  this._promise.reject(err);
};

module.exports = GuidebookScraper;