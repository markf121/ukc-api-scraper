var Vow = require('vow'),
    pluck = require('mout/array/pluck');

module.exports = function (logger) {

  function ClimbSaver (data, models) {
    this.data = data;
    this.models = models;
    this.log = logger.child({'class': 'ClimbSaver'});
  }

  ClimbSaver.prototype.save = function () {
    this._promise = Vow.promise();

    this.log.info('Saving Climb:' + this.data._id);

    this._addReferenceToGrade()
      .then(this._addReferencesToTicklists, this._fail, null, this)
      .then(this._save, this._fail, null, this);

    return this._promise;
  };

  ClimbSaver.prototype._addReferenceToGrade = function () {
    var self = this;
    var data = self.data;
    var promise = Vow.promise();

    if (data.grade && data.climbType) {
      self.models.Grade.findOne({
        grade: data.grade.grade,
        type: data.grade.type,
        climbType: data.climbType
      }, function (err, grade) {
        self.log.info('Adding ref to grade: ' + data.grade.grade, ', ' + data.grade.type + ', ' + data.grade.climbType);
        if (err) {
          self.log.error(err);
          promise.reject(err);
          return;
        }
        if (!grade) {
          err = new Error('Can\'t find grade: ' + data.grade.grade, ', ' + data.grade.type + ', ' + data.grade.climbType);
          self.log.error(err);
          delete data.grade;
        } else {
          data.grade = grade._id;
          promise.fulfill();
        }
      });
    } else {
      promise.fulfill();
    }

    return promise;
  };

  ClimbSaver.prototype._addReferencesToTicklists = function () {
    var promises = [];
    var self = this;

    if (this.data.ticklists) {
      this.data.ticklists.forEach(function (data, i) {
        var promise = Vow.promise();
        var id = data._id;
        delete data._id;
        data.updated = Date.now();
        promises.push(promise);
        self.log.info('Adding ref to ticklist:' + id);
        self.models.Ticklist.findOneAndUpdate(
          {
            _id: id
          }, data, {
            upsert: true
          }, function (err, ticklist) {
            if (err) {
              self.log.error(err);
              promise.reject(err);
              return;
            }
            ticklist._id = id;
            ticklist.save(function (err, ticklist) {
              self.log.info('Saving ticklist: ' + id);
              if (err) {
                self.log.error(err);
                promise.reject(err);
                return;
              }

              self.data.ticklists[i] = id;
              promise.fulfill(ticklist);
            });
          }
        );
      });
    }

    return Vow.all(promises);
  };

  ClimbSaver.prototype._fail = function (err) {
    this.log.error(err);
    this._promise.reject(err);
  };

  ClimbSaver.prototype._save = function () {
    var self = this;
    var data = this.data;
    var id = data._id;
    delete data._id;

    data.updated = Date.now();
    data.updateRequired = false;

    this.models.Climb.findOneAndUpdate(
      {
        _id: id
      }, data, {
        upsert: true
      }, function (err, climb) {
        self.log.info('Saving Climb: ' + id);
        if (err) {
          self.log.error(err);
          self._promise.reject(err);
          return;
        }
        climb._id = id;
        climb.save(function (err) {
          self.log.info('Saving Climb');
          if (err) {
            self.log.error(err);
            self._promise.reject(err);
            return;
          }
          self._promise.fulfill(climb);
        });
      }
    );
  };

  return ClimbSaver;
};