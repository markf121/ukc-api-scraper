var Scraper = require('./Scraper'),
    xml2js = require('xml2js');


var fetchCountryData = function (countries, prop, cb) {
  var scraper = new Scraper();
  countries.forEach(function (country) {
    console.info(country._id);
    scraper.request('/logbook/livecountry.php?id=' + country._id, function (err, response, body) {
      body = Scraper.convertToUtf8(body);

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
          country.complete = true;
          country.save();
        }

        if (result[prop]) {
          result[prop].forEach(function (obj) {
            cb(obj, country);
          });
        }
      });
    });
  });
};


module.exports = {
  fetchCountryData: fetchCountryData
};
