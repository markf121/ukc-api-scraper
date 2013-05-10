var utils = require('../lib/utils'),
    request = require('request'),
    Country = require('ukc-models').Country,
    Guidebook = require('ukc-models').Guidebook,
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
    country.guidebooks.push(guidebook._id);
    country.save();
    console.info('Guidebook saved: ' + data.title);
  });
};



Country.find({}, function (err, docs) {
  utils.fetchCountryData(docs, 'guidebook', addGuidebook);
});