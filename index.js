'use strict';

var stringify = require('json-stable-stringify')
var typeCheck =  require('type-check').typeCheck

// var message = {
//   content: JSON, // Used to store arbirary data
//   feed_id: String, // ID of the feed this message belongs to
//   type: String, // Optional - this is to prevent collisions in the `content` property
//
//   timestamp: Number, // Timestamp when the message was created
//   previous: String, // Hash of the previous message in the feed
//   sequence: Number, // Ordinal sequence of this message in the feed
//   pub_key: String, // Public key of the author
//   signature: String, // Signature of the rest of the message
// }

module.exports = function (settings) {
  return {
    create: create.bind(null, settings),
    sign: sign.bind(null, settings),
    validate: validate.bind(null, settings)
  }
}

module.exports.create = create
module.exports.sign = sign
module.exports.validate = validate

function create (settings, message, prev, callback) {
  if (prev) {
    settings.crypto.hash(prev, function (err, prev_hash) {
      assemble(prev_hash)
    })
  } else {
    assemble()
  }

  function assemble (prev_hash) {
    sign(settings, {
      content: message.content,
      type: message.type,
      feed_id: message.feed_id,
      timestamp: message.timestamp || Date.now(),

      previous: prev_hash || null,
      sequence: prev ? prev.sequence + 1 : 0,
      pub_key: settings.keys.publicKey
    }, function (err, message) {
      settings.crypto.hash(message, function (err, hashed) {
        return callback(err, {
          key: hashed,
          value: message
        })
      })
    })
  }
}

function sign (settings, message, callback) {
  var string = stringify(message)

  settings.crypto.sign(string, settings.keys.secretKey, function (err, signature) {
    message.signature = signature
    return callback(err, message)
  })
}

function validate (settings, message, prev, callback) {
    var type = [
    '{ type: String,',
      'feed_id: String,',
      'timestamp: Number, ',
      'previous: Maybe String,',
      'sequence: Number,',
      'signature: String,',
      'type: String,',
      'pub_key: String, ... }'].join(' ')

    if (!typeCheck(type, message)) {
      return callback(new Error('Invalid format'))
    }

    if (!prev) {
      if (message.sequence !== 0) {
        return callback(new Error('Sequence is wrong'))
      }

      signature()
    } else {
      if (message.sequence !== prev.sequence + 1) {
        return callback(new Error('Sequence is wrong'))
      }

      if (message.timestamp < prev.timestamp) {
        return callback(new Error('Timestamps do not make sense'))
      }

      settings.crypto.hash(prev, function (err, prev_hash) {
        if (message.previous !== prev_hash) {
          return callback(new Error('Hash of previous message does not match'))
        }

        signature()
      })
    }

    function signature () {
      var _message = JSON.parse(JSON.stringify(message))
      delete _message.signature

      settings.crypto.sign.verify(
        stringify(_message),
        message.signature,
        message.pub_key,
        function (err, bool) {
          if (bool) {
            return callback(null, true)
          } else {
            return callback(new Error('Incorrect signature'))
          }
        }
      )
    }
}
