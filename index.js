'use strict';

var stringify = require('json-stable-stringify')
var typeCheck =  require('type-check').typeCheck
var r = require('ramda')

// var message = {
//   content: JSON, // Used to store arbirary data
//   chain_id: String, // ID of the feed this message belongs to
//   type: String, // Optional - this is to prevent collisions in the `content` property
//
//   timestamp: Number, // Timestamp when the message was created
//   previous: String, // Hash of the previous message in the feed
//   sequence: Number, // Ordinal sequence of this message in the feed
//   public_key: String, // Public key of the author
//   signature: String, // Signature of the rest of the message
// }

module.exports = {
  createEnvelope: createEnvelope,
  createDoc: createDoc,
  validate: validate,
  identical: identical
}

function createEnvelope (settings, message, prev, callback) {
  if (prev) {
    settings.crypto.hash(stringify(prev), function (err, prev_hash) {
      if (err) { callback(err) }
      assemble(prev_hash)
    })
  } else {
    assemble()
  }

  function assemble (prev_hash) {
    message = {
      content: message.content,
      type: message.type,
      sequence: prev ? prev.sequence + 1 : 0,
      chain_id: message.chain_id,
      timestamp: message.timestamp || Date.now(),

      previous: prev_hash || null,
      public_key: settings.keys.public_key
    }
    settings.crypto.sign(stringify(message), settings.keys.secret_key, function (err, signature) {
      message.signature = signature
      return callback(err, message)
    })
  }
}

function createDoc (settings, message, callback) {
  settings.crypto.hash(stringify(message), function (err, hashed) {
    return callback(err, {
      key: hashed,
      value: message
    })
  })
}

function identical (a, b) {
  return stringify(a) === stringify(b)
}

function validate (settings, message, prev, callback) {
  var type = [
  '{ type: String,',
    'chain_id: String,',
    'timestamp: Number, ',
    'previous: Maybe String,',
    'sequence: Number,',
    'signature: String,',
    'public_key: String, ... }'].join(' ')

  if (!typeCheck(type, message)) {
    return callback(new Error('Invalid message format'))
  }

  if (!prev) {
    if (message.sequence !== 0) {
      return callback(new Error('No previous message, but sequence is not 0'))
    }

    signature()
  } else {
    if (message.sequence !== prev.sequence + 1) {
      return callback(new Error('Sequence is not previous sequence + 1'))
    }

    if (message.timestamp < prev.timestamp) {
      return callback(new Error('Timestamp is before previous message timestamp'))
    }

    settings.crypto.hash(stringify(prev), function (err, prev_hash) {
      if (message.previous !== prev_hash) {
        return callback(new Error('Hash of previous message does not match'))
      }

      signature()
    })
  }

  function signature () {
    var _message = r.omit(['signature'], message)

    settings.crypto.sign.verify(
      stringify(_message),
      message.signature,
      message.public_key,
      function (err, bool) {
        if (bool) {
          return callback(null, message)
        } else {
          return callback(new Error('Incorrect signature'))
        }
      }
    )
  }
}
