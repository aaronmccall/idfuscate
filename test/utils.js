var utils = require('../lib/utils');

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

describe('utils', function () {

  describe('decode', function () {
    describe('throws', function () {
      it('if 1st param is neither a string nor an array of strings', wrapDone(function () {
        expect(function () {
          utils.decode({});
        }).to.throw(TypeError, /must be a string or an array of strings/);
      }));
      it('if 2nd param contains characters not in 1st param, when options.strict is true', wrapDone(function () {
        expect(function () {
          utils.decode('AEIOU', 'AB', { strict: true });
        }).to.throw(RangeError, /not a member of the cipher/);
      }));
    });
    describe('returns', function () {
      it('2nd param translated via 1st param back to a base 10 integer', wrapDone(function () {
        expect(utils.decode('AEIOU', 'A')).to.equal(0);
        expect(utils.decode('AEIOU'.split(''), 'IAB')).to.equal(10);
      }));
    });
  });

  describe('encode', function () {
    it('returns the its 2nd param encoded by its 1st param', wrapDone(function () {
      var cipher = 'AEIOU';
      for (var i = 0, l = cipher.length; i<l; i++) {
        expect(utils.encode(cipher, i)).to.equal(cipher[i]);
      }
    }));
  });

  describe('pad', function () {
    it('returns the code padded to a minimum of 4 characters', wrapDone(function () {
      expect(utils.pad('XYZ', 'IA', 10)).to.equal('XIAY');
    }));
    it('returns the code padded with one character when > 4 characters', wrapDone(function () {
        var num = 12345;
        var code = utils.encode('AEIOURSTLNEQBW', num);
        
        expect(utils.pad('XYZ', code, num)).to.equal(code.slice(0,2) + 'Y' + code.slice(2));
    }));
  });

  describe('randomSort', function () {
    it('returns 0, 1, or -1 randomly regardless of arguments', wrapDone(function () {
      var container = [];
      for (var i = 0, l = 10; i < l; i++) {
        container.push(utils.randomSort('A', 'B'));
      }

      var results = {};
      container.forEach(function (n) {
        if (!(n in results)) {
          return (results[n] = 1);
        }
        results[n] = results[n] + 1;
      });

      expect(Object.keys(results).every(function (key) {
        return results[key] < 9;
      })).to.equal(true)
    }));
  });
})