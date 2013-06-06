var models = require('ukc-models')({host: "mongodb://localhost/test"}),
    Country = models.Country,
    Guidebook = models.Guidebook,
    modelsLib = require('ukc-models/lib'),
    async = require('async'),
    injector = require('../lib/injector');

injector.resolve(function (utils, GuideBookScraper) {
  var addGuidebook = function (tag, country) {
    var data = {};
    if (!tag.$.value) {
      return;
    }
    data._id = parseInt(tag.$.value, 10);
    data.title = utils.decodeEntities(tag.$.name.replace(/\s\([\d]+\)$/, ''));
    data.country = country._id;

    modelsLib.updateOrCreate(Guidebook, data, function (err, guidebook) {
      //country.guidebooks.push(guidebook._id);
      //country.save();
      console.info('Guidebook saved: ' + data.title);
    });
  };



  /*Country.find({}, function (err, docs) {
    utils.fetchCountryData(docs, 'guidebook', addGuidebook);
  });*/

  var throttle = 5000;

  Guidebook.find({}, '_id', function (err, books) {
    async.eachSeries(books, function (book, done) {
      console.info('Scraping ' + book._id);
      (new GuideBookScraper(models)).scrape(book._id, {
        proxy: 'http://www-cache.reith.bbc.co.uk:80'
      }).then(function (book) {
        console.info('Done');
        console.info(book);
        setTimeout(done, throttle);
      }, function (err) {
        console.info('Done ' + book._id);
        console.error(err);
        console.info(book);
        setTimeout(done, throttle);
      });
    }, function () {
      console.info('All done');
    });
  });

  /*Guidebook.find({}, '_id year published', function (err, books) {
    books.forEach(function (book) {
      if (book.year) {
        book.published = book.year.toString();
        book.save();
      }
    });
    console.log('All done');
  });*/

  /*var scraper = new GuideBookScraper(models);
  scraper.scrape(15, {
    proxy: 'http://www-cache.reith.bbc.co.uk:80'
  }).then(function (book) {
    console.info(book);
    console.info('done');
  });*/
});