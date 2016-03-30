var utils = require('./utils');

module.exports = function keyGenerator(seed, opts) {
  if (typeof seed !== 'string') {
    throw new TypeError('Parameter "seed" must be a string of characters.');
  }

  var keys = [];
  seed.replace(utils.notAlphaNumPattern, '')
      .split('')
      .forEach(function (c) {
        var uc = c.toUpperCase();
        if (keys.indexOf(uc) === -1) {
          keys.push(uc);
        }
      });


  if (keys.length < 18) {
    throw new RangeError([
      'Key generator requires a string of characters that contains 18 or more',
      'unique alphanumeric characters, preferably a paragraph of ascii text.',
      'Current input has only ' + keys.length + ' unique alphanumeric characters.'
    ].join(' '));
  }

  if (!opts || opts.random !== false) {
    keys.sort(utils.randomSort);
  }

  return keys.join('');
};