var utils = require('../lib/utils'),
    request = require('request'),
    Country = require('ukc-models').Country,
    modelsLib = require('ukc-models/lib');

var j = request.jar();
var cookie = request.cookie('ukcsid=11ea35ca4f7c822221338f34303fa208#111303#stevoland');
j.add(cookie);

utils.scrapePage({
  url: '/logbook/addcrag.html?id=0',
  jar: j
}, function (err, $, markup) {
  if (err) {
    console.log(err);
    return;
  }

  $('select[name=country] option').each(function (i, el) {
    var $el = this;
    var id = parseInt($el.attr('value'), 10);
    if (id === 0) {
      return;
    }

    var name = $el.text();
    modelsLib.updateOrCreate(Country, {
      id: id,
      name: name,
      isUk: ((id >= 1 && id <= 4) || id == 47)
    });
  });
});