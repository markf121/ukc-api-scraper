var modelsLib = require('ukc-models/lib'),
    injector = require('../lib/injector');


injector.resolve(
  function (utils, config, Scraper) {
    var models = require('ukc-models')(config.get('database'));

    var addArea = function (tag, country) {
      var data = {};
      if (!tag.$.value) {
        return;
      }
      data._id = parseInt(tag.$.value, 10);
      data.name = Scraper.decodeEntities(tag.$.name);
      data.country = country._id;
      if (tag.$.lng && tag.$.lat) {
        data.geo = [
          parseFloat(tag.$.lng),
          parseFloat(tag.$.lat)
        ];
      }
      modelsLib.updateOrCreate(models.Area, data, function (err, area) {
        //country.areas.push(area._id);
        //country.save();
        console.info('Area saved: ' + data.name);
      });
    };


    models.Country.find({}, function (err, docs) {
      utils.fetchCountryData(docs, 'area', addArea);
    });
  }
);