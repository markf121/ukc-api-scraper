var utils = require('../lib/utils'),
    models = require('ukc-models')({host: "mongodb://localhost/test"}),
    Country = models.Country,
    Guidebook = models.Guidebook,
    GuideBookScraper = require('../lib/GuideBookScraper'),
    modelsLib = require('ukc-models/lib');


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

var scraper = new GuideBookScraper(models);
scraper.scrape(2, {
  proxy: 'http://www-cache.reith.bbc.co.uk:80'
});