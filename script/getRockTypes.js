var utils = require('../lib/utils'),
    request = require('request'),
    RockType = require('ukc-models').RockType;
    modelsLib = require('ukc-models/lib'),
    mongoose = require('mongoose');


var j = request.jar();
var cookie = request.cookie('ukcsid=11ea35ca4f7c822221338f34303fa208#111303#stevoland');
j.add(cookie);

utils.scrapePage({
  url: '/logbook/addcrag.html?id=0',
  jar: j
}, function (err, $, markup) {
  //console.log(err);
  if (err) {
    console.log(err);
    return;
  }

  $('select[name=rocktype] option').each(function (i, el) {
    var $el = this;
    var id = parseInt($el.attr('value'), 10);
    if (id === 1) {
      return;
    }

    var name = $el.text();
    modelsLib.updateOrCreate(RockType, {
      _id: id,
      name: name
    });
  });
});