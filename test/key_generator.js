var keyGenerator = require('../lib/key_generator');

var lab = exports.lab = require('lab').script();
var expect = require('code').expect;

var describe = lab.describe;
var it = lab.it;

function wrapDone(fn) {
  return function (done) {
    fn();
    done();
  }
}

describe('key_generator', function () {
  describe('throws', function () {
    it('a TypeError if its first param is not a string.', wrapDone(function () {
      expect(function () {
        keyGenerator({});
      }).to.throw(TypeError, /must be a string of characters/);
    }));
    it('a RangeError if its first param does not contain 18+ unique alphanumeric characters.', wrapDone(function () {
      expect(function () {
        keyGenerator('The quick brown fox');
      }).to.throw(RangeError, /contains 18 or more unique alphanumeric characters/)
    }));

  });
  describe('returns', function () {
    it('a string of all unique alphanumeric characters (upper-cased alphas),', wrapDone(function () {
      var key = keyGenerator('1. The quick brown fox jumps over the lazy dog.');
      expect(key).to.have.length(27);
      expect(key.replace(/[^A-Z]/g, '')).to.have.length(26);
    }));
    it('and randomizes them unless random options is false', wrapDone(function () {
      var seed = '1. The quick brown fox jumps over the lazy dog.';
      var key = keyGenerator(seed, { random: false });
      expect(key).to.equal(seed.replace(/[^\w]/g, '').split('').reduce(function (memo, str) {
        var uc = str.toUpperCase();
        if (memo.indexOf(uc) === -1) {
          memo.push(uc);
        }
        return memo;
      }, []).join(''));
    }));
  });
});