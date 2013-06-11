var convict = require('convict');

module.exports = function () {
  var conf = convict({
    env: {
      doc: "The applicaton environment.",
      format: ["production", "development", "test"],
      'default': "development",
      env: "NODE_ENV"
    },
    database: {
      host: {
        'default': "mongodb://localhost/test",
        env: "DB_HOST"
      }
    },
    proxy: {
      'default': '',
      format: String,
      env: "HTTP_PROXY"
    }
  });

  conf.validate();

  return conf;
};