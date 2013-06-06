var injector = require('./lib/injector');

injector.resolve(
  function(
    Scraper,
    CragScraper,
    ClimbScraper,
    GuidebookScraper
  ) {
    module.exports = {
      Scraper: Scraper,
      CragScraper: CragScraper,
      ClimbScraper: ClimbScraper,
      GuidebookScraper: GuidebookScraper
    };
  }
);