var injector = require('../lib/injector'),
    async = require('async');


injector.resolve(function (CragScraper, config) {
  var models = require('ukc-models')(config.get('database'));
  var Crag = models.Crag;
  var throttle = 5000;

  function fixUkcUpdatedDate (crag, done) {
    var parts;

    console.info('Org: ' + crag.ukcUpdated);

    if (!crag.ukcUpdated) {
      done();
      return;
    }

    parts = crag.ukcUpdated.split('-');

    parts[1] = String(parseInt(parts[1], 10) + 1);

    if (parts[1].length < 2) {
      parts[1] = '0' + parts[1];
    }

    crag.ukcUpdated = parts.join('-');

    crag.save(function (err) {
      console.info('New: ' + crag.ukcUpdated);
      done();
    });
  }

  Crag.find({}, function (err, crags) {
    async.eachSeries(crags, fixUkcUpdatedDate, function () {
      process.exit();
    });
  });
});