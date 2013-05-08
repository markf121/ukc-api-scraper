var utils = require('../lib/utils'),
    request = require('request'),
    Country = require('ukc-models').Country;


Country.findOne({id: 1}, function (err, docs) {
  console.info(err);
  console.info(docs);
});