var Country = require('ukc-models').Country,
    modelsLib = require('ukc-models/lib'),
    request = require('request'),
    injector = require('../lib/injector');

var j = request.jar();
var cookie = request.cookie('ukcsid=11ea35ca4f7c822221338f34303fa208#111303#stevoland');
j.add(cookie);

injector.resolve(
  function (Scraper) {
    var scraper = new Scraper();

    scraper._scrape({
      url: '/logbook/addcrag.html?id=0',
      jar: j
    }).then(
      function (obj) {
        obj.$('select[name=country] option').each(function (i, el) {
          var $el = this;
          var id = parseInt($el.attr('value'), 10);
          if (id === 0) {
            return;
          }

          var name = $el.text();
          modelsLib.updateOrCreate(Country, {
            _id: id,
            name: name,
            isUk: ((id >= 1 && id <= 4) || id == 47)
          });
          console.log(name);
        });
      },
      function (err) {
        console.log(err);
      }
    );
  }
);