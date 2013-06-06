var container = require('dependable').container,
    path = require('path'),
    injector = container();

injector.load(__dirname);
injector.load(path.join(__dirname, 'scrapers'));
injector.load(path.join(__dirname, 'requesters'));

module.exports = injector;
