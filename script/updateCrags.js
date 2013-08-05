var injector = require('../lib/injector'),
    async = require('async');


injector.resolve(function (CragScraper, ClimbScraper, config) {
  var models = require('ukc-models')(config.get('database'));
  var Crag = models.Crag;
  var Climb = models.Climb;
  var throttle = 5000;

  function scrapeCrag (crag, done) {
    var scraper = new CragScraper(models);
    console.info(crag._id + ': ' + crag.name);
    scraper.scrape(crag._id).then(function () {
      Climb.find({crag: crag._id}, function (err, climbs) {
        async.eachSeries(climbs, scrapeClimb, function () {
          console.info('Crag ' + crag.name + ' updated');
          setTimeout(done, throttle);
        });
      });
    });
  }

  function scrapeClimb (climb, done) {
    var scraper = new ClimbScraper(models);
    console.info('Updating climb ' + climb._id + ': ' + climb.name);
    scraper.scrape(climb._id).then(function () {
      console.info(climb.name + ' updated');
      setTimeout(done, throttle);
    });
  }

  Crag.find({updateRequired: true}, function (err, crags) {
    async.eachSeries(crags, scrapeCrag, function () {
      process.exit();
    });
  });
});