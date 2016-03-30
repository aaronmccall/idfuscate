var utils = require('./utils');

module.exports = function translatorGenerator(key, opts) {
  
  for (var i = 0, l = key.length, seen = {}; i<l; i++) {
    var chr = key[i];
    if (!seen[chr] && !chr.match(utils.notAlphaNumPattern)) {
      seen[chr] = 1;
      continue;
    }

    throw new Error('Parameter "key" must contain only unique alphanumeric characters.');
  }

  var options = opts || {};

  var rangeError;
  if (options.pad && (key.length < 21)) {
    rangeError = 'When using the "pad" option, parameter "key" must be at least 21 characters.';
  } else if (key.length < 18) {
    rangeError = 'Parameter "key" must be at least 18 characters.'
  }
  if (rangeError) {
    throw new RangeError(rangeError);
  }

  var cipher = options.pad ? key.slice(0, -3) : key;
  var padding = options.pad && key.slice(-3);

  var bound = {
    encode: utils.encode.bind(null, cipher),
    decode: utils.decode.bind(null, cipher)
  };

  if (padding) {

    var paddingPattern = new RegExp('[' + padding + ']', 'g');

    return {
      encode: function paddedEncode(num) {
        return utils.pad(padding, bound.encode(num), num);
      },
      decode: function paddedDecode(str) {
        return bound.decode(str.replace(paddingPattern, ''));
      }
    };
  }

  return bound;
};
