var injector = require('../lib/injector'),
    async = require('async');


injector.resolve(function (ClimbScraper, config) {
  var models = require('ukc-models')(config.get('database'));
  var Climb = models.Climb;
  var throttle = 1000;
  var i = 0;

  function scrapeClimb (climb, done) {
    var scraper = new ClimbScraper(models);
    i += 1;
    console.info(i + ': '+ climb._id + ': ' + climb.name + ': updating');
    scraper.scrape(climb._id).always(function () {
      setTimeout(done, throttle);
    });
  }

  function findClimbs () {
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
      async.eachSeries(climbs, scrapeClimb, findClimbs);
    });
  }

  findClimbs();
});