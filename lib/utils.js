exports.notAlphaNumPattern = /[^a-zA-Z0-9]/g;

function isString(c) {
  return typeof c === 'string';
}

function isArrayOfStrings(o) {
  return Array.isArray(o) && o.every(isString);
}

function decode(cipher, str, opts) {
  var isArray = isArrayOfStrings(cipher);
  if (!isString(cipher) && !isArray) {
    throw new TypeError('Param "cipher" must be a string or an array of strings');
  }

  var key = isArray ? cipher.join('') : cipher;
  var options = opts || {};
  var parts = str.split('');

  return parseInt(parts.reduce(function (memo, part) {
    var index = key.indexOf(part);
    if (index === -1) {
      if (options.strict) {
        throw new RangeError('Character "' + part + '" is not a member of the cipher.');
      }
      return memo;
    }
    memo.push(index.toString(key.length));
    return memo;
  }, []).join(''), key.length)
}
exports.decode = decode;

function encode(cipher, num) {
  var based = (num | 0).toString(cipher.length);

  return based.split('').map(function (part) {
    return cipher.charAt(parseInt(part, cipher.length))
  }).join('');
}
exports.encode = encode;

function padCode(padding, code, index) {
  var len = code.length;
  var divisor = index + 1;
  if (len % 3 === 0) {
    return code + padding.charAt(index);
  }

  if (len % 3 === 2) {
    return padding.charAt(index) + code;
  }

  var first = code.slice(0, Math.floor(len / divisor));
  var middle = padding.charAt(index);
  var end = code.slice(Math.ceil(len / divisor));

  if (!first && !end) {
    if (len % 2) {
      first = code;
    } else {
      end = code;
    }
  }
  return first + middle + end;
}

function pad(padding, code, num) {
  if (code.length < 4) {
    var diff = 4 - code.length;
    while (diff--) {
      code = padCode(padding, code, (code.length + num) % padding.length);
    }
  } else {
    code = padCode(padding, code, (code.length + num) % padding.length);
  }
  return code;
}
exports.pad = pad;

function randomSort (a, b) {
  var A = ((Math.random() * 1e6) | 0) % 3;
  var B = ((Math.random() * 1e6) | 0) % 3;
  if (A > B) return 1;
  if (A < B) return -1;
  return 0;
}
exports.randomSort = randomSort;