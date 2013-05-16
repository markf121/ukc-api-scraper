var Scraper = require('./Scraper'),
    util = require('util');

function GuidebookScraper (models) {
  this.models = models;
}
util.inherits(GuidebookScraper, Scraper);


GuidebookScraper.scrapeTitle = function ($) {

};

GuidebookScraper.scrapeIsbn = function ($) {

};

GuidebookScraper.scrapeYear = function ($) {

};

GuidebookScraper.scrapeInPrint = function ($) {

};

GuidebookScraper.scrapeAuthor = function ($) {

};

GuidebookScraper.scrapePublisher = function ($) {

};

GuidebookScraper.scrapeWebsite = function ($) {

};

GuidebookScraper.scrapeReview = function ($) {

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