var utils = require('../lib/utils'),
    request = require('request'),
    Country = require('ukc-models').Country,
    Area = require('ukc-models').Area,
    xml2js = require('xml2js'),
    modelsLib = require('ukc-models/lib');

var countries;

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

var fetchCountryData = function (country) {
  utils.requestPage('/logbook/livecountry.php?id=' + country.id, function (err, response, body) {
    body = utils.convertToUtf8(body);

    var parser = new xml2js.Parser();
    parser.parseString(body, function (err, result) {
      result = result.country;
      if (result.$) {
        if (result.$.lng && result.$.lat) {
          country.geo = [
            parseFloat(result.$.lng),
            parseFloat(result.$.lat)
          ];
        }

        if (result.$.zoom) {
          country.zoom = parseInt(result.$.zoom, 10);
        }

        country.save();
      }

      if (result.area) {
        result.area.forEach(function (area) {
          addArea(area, country);
        });
      }

      if (countries.length) {
        fetchCountryData(countries.pop());
      } else {
        console.info('Done');
      }
    });
  });
};

Country.find({}, function (err, docs) {
  countries = docs;
  fetchCountryData(countries.pop());
});