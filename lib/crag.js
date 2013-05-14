var utils = require('./utils'),
    scraper = require('./crag/scraper'),
    vow = require('vow'),
    Crag = require('ukc-models').Crag;

var addCrag = function (cragData, promise) {
  var crag = new Crag(cragData);
  crag.save();

  promise.fulfill(crag);
};

exports.crag = function (id) {
  return utils.scrapePage({
    url: '/logbook/crag.php?id=' + id,
    proxy: this.proxy
  }).then(
    function (obj) {
      var $ = obj.$;
      var markup = obj.markup;

      var name = scraper.scrapeName($);
      var climbs = scraper.scrapeClimbs($);
      var maps = scraper.scrapeMaps($);
      var gridRef = scraper.scrapeGridRef($);
      var geo = scraper.scrapeGeo($);
      var lastUpdated = scraper.scrapeLastUpdated($);

      $('#main > div').first().remove();

      var cragData = {
        _id: parseInt(id, 10),
        name: name,
        //area: scraper.scrapeArea($),
        //country: scraper.scrapeCountry($, markup),
        geo: geo,
        features: scraper.scrapeFeatures($),
        accessNotes: scraper.scrapeAccessNotes($),
        gridRef: gridRef,
        //maps: maps,
        bmcId: scraper.scrapeBmcId($),
        ukcUpdated: lastUpdated,
        guidebooks: scraper.scrapeGuidebooks($),
        climbs: climbs,
        totalClimbs: scraper.scrapeTotalClimbs($),
        //rockType: scraper.scrapeRockType($),
        faces: scraper.scrapeFaces($),
        altitude: scraper.scrapeAltitude($),
        isTidal: scraper.scrapeIsTidal($)
      };

      addCrag(cragData, promise);
    },
    function (err) {
      promise.reject(err);
    }
  );
};


exports.crag = function (id) {
  var promise = vow.promise();

  scrapeCrag(id, promise);

  return promise;
};