var utils = require('../lib/utils'),
    models = require('ukc-models')({host: "mongodb://localhost/test"}),
    Country = models.Country,
    Area = models.Area,
    modelsLib = require('ukc-models/lib');

var addArea = function (tag, country) {
  var data = {};
  if (!tag.$.value) {
    return;
  }
  data._id = parseInt(tag.$.value, 10);
  data.name = tag.$.name;
  data.country = country._id;
  if (tag.$.lng && tag.$.lat) {
    data.geo = [
      parseFloat(tag.$.lng),
      parseFloat(tag.$.lat)
    ];
  }
  modelsLib.updateOrCreate(Area, data, function (err, area) {
    country.areas.push(area._id);
    country.save();
    console.info('Area saved: ' + data.name);
  });
};



Country.find({}, function (err, docs) {
  utils.fetchCountryData(docs, 'area', addArea);
});