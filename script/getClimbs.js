var injector = require('../lib/injector'),
    async = require('async');


injector.resolve(function (ClimbScraper, config) {
  var models = require('ukc-models')(config.get('database'));
  var Climb = models.Climb;
  var throttle = 1000;

  function scrapeClimb (climb, done) {
    var scraper = new ClimbScraper(models);
    console.info(climb._id + ': ' + climb.name + ' updating');
    scraper.scrape(climb._id).then(function () {
      setTimeout(done, throttle);
    });
  }

  Climb.find({
    complete: {
      $ne: true
    }
  },
  '_id name updated',
  {
    sort: {
      updated: 1
    },
    limit: 10000
  },
  function (err, climbs) {
    console.info(climbs);
    async.eachSeries(climbs, scrapeClimb, function () {
      process.exit();
    });
  });
});