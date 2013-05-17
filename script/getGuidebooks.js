var utils = require('../lib/utils'),
    models = require('ukc-models')({host: "mongodb://localhost/test"}),
    Country = models.Country,
    Guidebook = models.Guidebook,
    GuideBookScraper = require('../lib/GuideBookScraper'),
    modelsLib = require('ukc-models/lib'),
    async = require('async');


var addGuidebook = function (tag, country) {
  var data = {};
  if (!tag.$.value) {
    return;
  }
  data._id = parseInt(tag.$.value, 10);
  data.title = utils.decodeEntities(tag.$.name.replace(/\s\([\d]+\)$/, ''));
  data.country = country._id;

  modelsLib.updateOrCreate(Guidebook, data, function (err, guidebook) {
    //country.guidebooks.push(guidebook._id);
    //country.save();
    console.info('Guidebook saved: ' + data.title);
  });
};



/*Country.find({}, function (err, docs) {
  utils.fetchCountryData(docs, 'guidebook', addGuidebook);
});*/

var throttle = 5000;

Guidebook.find({}, '_id', function (err, countries) {
  console.info(countries);
  async.eachSeries(countries, function (country, done) {
    console.info('Scraping ' + country._id);
    (new GuideBookScraper(models)).scrape(country._id, {
      proxy: 'http://www-cache.reith.bbc.co.uk:80'
    }).then(function (book) {
      console.info('Done ' + country._id);
      setTimeout(done, throttle);
    }, function (err) {
      console.info('Done ' + country._id);
      console.error(err);
      setTimeout(done, throttle);
    });
  }, function () {
    console.info('All done');
  });
});

/*var scraper = new GuideBookScraper(models);
scraper.scrape(521, {
  proxy: 'http://www-cache.reith.bbc.co.uk:80'
}).then(function (book) {
  console.info(book);
  console.info('done');
});*/