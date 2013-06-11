var request = require('request'),
    config = require('../lib/config'),
    modelsLib = require('ukc-models/lib'),
    mongoose = require('mongoose'),
    injector = require('../lib/injector');


var j = request.jar();
var cookie = request.cookie('ukcsid=5fc400b2abd9c052d57686d83683ce83#111303#stevoland');
j.add(cookie);

injector.resolve(function (Scraper, Requester, config) {
    var models = require('ukc-models')(config.get('database'));
    var requester = new Requester();
    var scraper = new Scraper(requester);

    scraper._scrape({
      url: '/logbook/addcrag.html?id=0',
      jar: j
    }).then(
    function (val) {
      val.$('select[name=rocktype] option').each(function (i, el) {
        var $el = this;
        var id = parseInt($el.attr('value'), 10);
        if (id === 1) {
          return;
        }

        var name = $el.text();
        modelsLib.updateOrCreate(models.RockType, {
          _id: id,
          name: name,
          updated: Date.now()
        });
      });
    },
    function (err) {
      console.log(err);
    }
  );
});