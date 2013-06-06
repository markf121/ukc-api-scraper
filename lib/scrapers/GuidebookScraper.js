var Vow = require('vow'),
    util = require('util');

module.exports = function (Scraper, GuidebookRequester) {
  var requester = new GuidebookRequester();

  function GuidebookScraper (models) {
    Scraper.apply(this, [requester]);

    this.models = models;
    this.model = models.Guidebook;
  }
  util.inherits(GuidebookScraper, Scraper);


  GuidebookScraper.scrapeTitle = function ($) {
    return $('h1').text();
  };

  GuidebookScraper.scrapeInPrint = function ($) {
    var inPrint = !$('b.error').length;
    if (inPrint) {
      var review = GuidebookScraper.scrapeReview($);
      var matches = review.match(/out of print/i);
      if (matches) {
        inPrint = false;
      }
    }

    return inPrint;
  };

  GuidebookScraper.scrapeAuthor = function ($) {
    return Scraper.pairScraper($, function (prop, val) {
      if (prop === 'author') {
        return val;
      }
    });
  };

  GuidebookScraper.scrapePublished = function ($) {
    return Scraper.pairScraper($, function (prop, val) {
      var year = null;
      if (prop === 'published') {
        var matches = val.match(/\s\((\d+)\)\s?$/);
        if (matches) {
          year = matches[1];
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

  GuidebookScraper.scrapeReview = function ($) {
    var review = null;
    var $main = $('#main').clone();
    $main.find('b').each(function (i, el) {
      var $el = $(el);
      if ($el.text() === 'Review') {
        review = Scraper.getTextForBoldTitle($el);
        return false;
      }
    });

    return review;
  };

  GuidebookScraper.scrapeImages = function ($) {
    var images = [];
    $('#main a img').each(function (i, el) {
      var $el = $(el);
      var matches = $el.attr('src').match(/(\d+).jpg$/);
      if (!matches) {
        return;
      }
      var id = parseInt(matches[1], 10);
      if ($el.attr('align') === 'right') {
        images.unshift(id);
        return;
      }

      images.push(id);
    });

    return images;
  };


  GuidebookScraper.prototype.scrape = function (id) {
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

  GuidebookScraper.prototype._success = function (page) {
    var $ = page.$;
    var markup = page.markup;

    this.data = {
      _id: this.id,
      title: GuidebookScraper.scrapeTitle($),
      isbn: GuidebookScraper.scrapeIsbn($),
      published: GuidebookScraper.scrapePublished($),
      inPrint: GuidebookScraper.scrapeInPrint($),
      author: GuidebookScraper.scrapeAuthor($),
      publisher: GuidebookScraper.scrapePublisher($),
      website: GuidebookScraper.scrapeWebsite($),
      review: GuidebookScraper.scrapeReview($),
      images: GuidebookScraper.scrapeImages($),
      ukcUpdated: Scraper.scrapeUkcUpdated($),
      updated: Date.now(),
      complete: true
    };

    this._save(this.data);
  };

  GuidebookScraper.prototype._fail = function (err) {
    this._promise.reject(err);
  };

  return GuidebookScraper;
};