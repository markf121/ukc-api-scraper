module.exports = function (Requester) {
  var ClimbRequester = function () {

  };

  ClimbRequester.prototype = {
    request: function (id, cb) {
      var url = '/logbook/c.php?i=' + id;

      Requester.prototype.request.apply(this, [url, cb]);
    }
  };

  return ClimbRequester;
};