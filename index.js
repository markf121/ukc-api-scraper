var crag = require('./lib/crag').crag;

function Scraper (proxy) {
  this.proxy = proxy;
}

Scraper.prototype.crag = crag;

exports.Scraper = Scraper;