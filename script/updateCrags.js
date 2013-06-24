var injector = require('../lib/injector'),
    async = require('async');


injector.resolve(function (CragScraper, config) {
  var models = require('ukc-models')(config.get('database'));
  var Crag = models.Crag;
  var throttle = 5000;

  function scrapeCrag (crag, done) {
    var scraper = new CragScraper(models);
    scraper.scrape(crag._id).then(function () {
      console.info(crag.name + ' updated');
      setTimeout(done, throttle);
    });
  }

  Crag.find({updateRequired: true}, function (err, crags) {
    async.eachSeries(crags, scrapeCrag, function () {
      process.exit();
    });
  });
});