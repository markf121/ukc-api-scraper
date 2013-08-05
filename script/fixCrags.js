var injector = require('../lib/injector'),
    async = require('async');


injector.resolve(function (CragScraper, config) {
  var models = require('ukc-models')(config.get('database'));
  var Crag = models.Crag;
  var throttle = 2000;
  var scraper = new CragScraper(models);

  function scrapeCrag (crag) {
    console.info(crag._id + ': ' + crag.name);
    scraper.scrape(crag._id).then(function () {
      console.info(crag.name + ' updated');
      setTimeout(getCrag, throttle);
    });
  }

  function getCrag () {
    Crag.findOne({totalClimbsByType: null}, function (err, crag) {
      if (err) throw (err);

      if (!crag) process.exit();

      scrapeCrag(crag);
    });
  }

  getCrag();
});