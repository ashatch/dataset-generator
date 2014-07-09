var helper = require('./helper');
var assert = require('assert');

describe('util methods for schema config file', function() {
  var res = { items: null };
  before(function(done) {
    var opts = {
      size: 10,
      schema: {
        counter: {
          normal: '{{Number(counter())}}',
          start: '{{Number(counter(2, 100))}}',
          step: '{{Number(counter(3, 0, 10))}}'
        }
      }
    };
    helper.getResults(opts, function (err, items) {
      if (err) return done(err);
      res.items = items;
      done();
    });
  });

  describe('#counter', function() {
    it('should work in defaults', function () {
      var clock = 0;
      res.items.forEach(function (item) {
        assert.deepEqual(clock++, item.counter.normal);
      });
    });

    it('should work with customized start', function () {
      var clock = 100;
      res.items.forEach(function (item) {
        assert.deepEqual(clock++, item.counter.start);
      });
    });

    it('should work with customized step', function () {
      var clock = -10;
      res.items.forEach(function (item) {
        assert.deepEqual((clock += 10), item.counter.step);
      });
    });
  });

});
