var container = require('dependable').container;
var injector = container();

injector.load(__dirname);

module.exports = injector;
