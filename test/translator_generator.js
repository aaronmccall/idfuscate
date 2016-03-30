var tGen = require('../lib/translator_generator');
var kGen = require('../lib/key_generator');

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

var key = kGen('The quick brown fox jumps over the lazy dog');

describe('translator_generator', function () {
  describe('throws', function () {
    it('when 1st param is not a string of unique, alphanumeric characters', wrapDone(function () {
      expect(function () {
        tGen('AEIOUA');
      }).to.throw(Error, /must contain only unique alphanumeric characters/);
    }));
    it('when pad option is true and 1st param is < 21 characters', wrapDone(function () {
      expect(function () {
        tGen(key.slice(0, 20), { pad: true });
      }).to.throw(Error, /must be at least 21 characters/);
    }));
    it('when pad option is not true and 1st param is < 18 characters', wrapDone(function () {
      expect(function () {
        tGen(key.slice(0, 17));
      }).to.throw(Error, /must be at least 18 characters/);
    }));
  });

  describe('returns', function () {
    it('returns an object with encode/decode methods', wrapDone(function () {
      var trans = tGen(key);
      expect(trans).to.be.an.object();
      expect(trans.encode).to.exist();
      expect(trans.decode).to.exist();
    }));
    it('encode/decode methods add/remove padding when pad option is true', wrapDone(function () {
      var trans = tGen(key, { pad: true });
      expect(trans).to.be.an.object();
      expect(trans.encode).to.exist();
      expect(trans.decode).to.exist();

      var num = 1;
      var code = trans.encode(num);
      var decoded = trans.decode(code);

      expect(code).to.have.length(4);
      expect(decoded).to.equal(num);
    }));
  });
});