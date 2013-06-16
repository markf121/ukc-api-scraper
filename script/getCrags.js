var injector = require('../lib/injector');

injector.resolve(function (CragScraper, config) {
    var models = require('ukc-models')(config.get('database'));
    var scraper = new CragScraper(models);
    var id = 1386;
    var throttle = 2000;

    function nextCrag () {
      id += 1;
      setTimeout(scrapeCrag, throttle);
    }

    function scrapeCrag () {
      scraper.scrape(id).then(nextCrag, nextCrag);
    }

    scrapeCrag();
});