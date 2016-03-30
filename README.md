# idfuscate
A library for obfuscating serial integer IDs.

## install

`npm install idfuscate`

## setup

```javascript
const idfuscate = require('idfuscate');

const seed = 'the 1 quick brown fox jumps over the 47 lazy dogs';

console.log(idfuscate.createKey(seed))

// Outputs something like:
// ICSAHKROUJTG74EXBMPDVWNLQZ1YF
```

Copy the cipher key and paste it into your config file under the key 'idfuscate'. (I often use [getconfig](https://www.npmjs.com/package/getconfig) for my config files.)

## usage

In your module(s) that need(s) to obfuscate IDs, do the following:

### hapi GET /things/{id} example

```javascript
const Config = require('getconfig');
const Idfuscate = require('idfuscate');
const Joi = require('joi');

const translator = Idfuscate.createTranslator(Config.idfuscate, { pad: true });

module.exports = {
  handler: function (request, reply) {
    const query = { id: translator.decode(request.params.id) };
    this.db.things.findOne(query).then((result) => {

      if (result) {
        return reply(Object.assign(result, query));
      }
      reply(result);
    }).catch((err) => reply(err));
  },
  validate: {
    params: {
      id: Joi.string().regex(/^[A-Z0-9]+$/)
    }
  }
};
```

### hapi GET /things example

```javascript
const Config = require('getconfig');
const Idfuscate = require('idfuscate');
const Joi = require('joi');

const translator = Idfuscate.createTranslator(Config.idfuscate, { pad: true });

module.exports = {
  handler: function (request, reply) {

    this.db.things.find({
      $offset: request.query.offset,
      $limit: request.query.limit
    }).then((result) => {

      if (result && result.length) {
        return reply(result.map((thing) => {

          return Object.assign(thing, { id: translator.encode(result.id) }));
        });
      }
      reply(result);
    }).catch((err) => reply(err));
  },
  validate: {
    query: {
      offset: Joi.number().integer().min(0).default(0),
      limit: Joi.number().integer().min(1).max(100).default(100)
    }
  }
};
```





