var bunyan = require('bunyan');

module.exports = function (config) {
  return bunyan.createLogger({
    name: 'ukc-api-scraper',
    serializers: bunyan.stdSerializers,
    streams: [
      {
        level: 'info',
        //stream: process.stdout, // log INFO and above to stdout
        path: './ukc-api-scraper-info.log' // log ERROR and above to a file
      },
      {
        level: 'error',
        path: './ukc-api-scraper-error.log' // log ERROR and above to a file
      }
    ]
  });
};