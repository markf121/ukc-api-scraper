var injector = require('./lib/injector');

injector.resolve(
  function(
    Scraper,
    CragScraper,
    ClimbScraper,
    GuidebookScraper,
    utils
  ) {
    module.exports = {
      Scraper: Scraper,
      CragScraper: CragScraper,
      ClimbScraper: ClimbScraper,
      GuidebookScraper: GuidebookScraper
    };
  }
);