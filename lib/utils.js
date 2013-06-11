var xml2js = require('xml2js');

module.exports = function (Scraper, Requester) {
  var fetchCountryData = function (countries, prop, cb) {
    var requester = new Requester();

    countries.forEach(function (country) {
      requester.request('/logbook/livecountry.php?id=' + country._id, function (err, body) {
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


  return {
    fetchCountryData: fetchCountryData
  };
};