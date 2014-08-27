var injector = require('../lib/injector');

injector.resolve(function (CragScraper, config) {
    var models = require('ukc-models')(config.get('database'));
    var scraper = new CragScraper(models);
    var id = 1;
    var throttle = 1000;

    function nextCrag () {
      id += 1;
      setTimeout(scrapeCrag, throttle);
    }

    function error (err) {
      console.info(err);
      nextCrag();
    }

    function scrapeCrag () {
      console.info('Scraping: ' + id);
      scraper.scrape(id).then(nextCrag, error);
    }

    scrapeCrag();
});