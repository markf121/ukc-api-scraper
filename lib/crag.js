var utils = require('./utils'),
    scraper = require('./crag/scraper'),
    vow = require('vow');

exports.crag = function (id) {
  return utils.scrapePage('/logbook/crag.php?id=' + id).then(
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

      var ret = {
        _id: parseInt(id, 10),
        name: name,
        area: scraper.scrapeArea($),
        country: scraper.scrapeCountry($, markup),
        geo: geo,
        features: scraper.scrapeFeatures($),
        accessNotes: scraper.scrapeAccessNotes($),
        gridRef: gridRef,
        maps: maps,
        bmcId: scraper.scrapeBmcId($),
        ukcUpdated: lastUpdated,
        guidebooks: scraper.scrapeGuidebooks($),
        //climbs: climbs,
        totalClimbs: scraper.scrapeTotalClimbs($),
        rockType: scraper.scrapeRockType($),
        faces: scraper.scrapeFaces($),
        altitude: scraper.scrapeAltitude($),
        isTidal: scraper.scrapeIsTidal($)
      };

      return ret;
    }
  );
};