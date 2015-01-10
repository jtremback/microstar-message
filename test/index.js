'use strict';

var test = require('tape')
var mMessage = require('../')
var mCrypto = require('../../microstar-crypto')

mCrypto.keys('h4dfDIR+i3JfCw1T2jKr/SS/PJttebGfMMGwBvhOzS4=', function (err, keys) {
  tests({
    crypto: mCrypto,
    keys: keys
  })
})

function tests (settings) {
  var message = {
    content: 'hello',
    chain_id: 'franklin',
    type: 'microstar-message|test',
    timestamp: 1418273900123
  }

  test('create', function (t) {
    mMessage.format(settings, message, null, function (err, doc) {
      t.deepEqual(doc, {
        key: 'zoenhX5h3msinnymjmCeUM3Mypgk9Sxn8548sNG9/dPOo80gT3/bAnTLoAcD48wCy9JqfLzle/HV7akz3zHtIw==',
        value: {
          content: 'hello',
          type: 'microstar-message|test',
          chain_id: 'franklin',
          timestamp: 1418273900123,
          previous: null,
          sequence: 0,
          pub_key: 'N3DyaY1o1EmjPLUkRQRu41/g/xKe/CR/cCmatA78+zY=7XuCMMWN3y/r6DeVk7YGY8j/0rWyKm3TNv3S2cbmXKk=',
          signature: 'ix4n7ZmAf3JKpQsM5EDmXCoFVSLEUS18pDJtX4WZ/mcIaHqamkrG8h7AzUISOvUt8iIP9oAUE0eW54kqFLjYDw=='
        }
      })

      t.end()
    })
  })

  test('validate', function (t) {
    mMessage.validate(settings, {
      content: 'hello',
      type: 'microstar-message|test',
      chain_id: 'franklin',
      timestamp: 1418273900123,
      previous: null,
      sequence: 0,
      pub_key: 'N3DyaY1o1EmjPLUkRQRu41/g/xKe/CR/cCmatA78+zY=7XuCMMWN3y/r6DeVk7YGY8j/0rWyKm3TNv3S2cbmXKk=',
      signature: 'ix4n7ZmAf3JKpQsM5EDmXCoFVSLEUS18pDJtX4WZ/mcIaHqamkrG8h7AzUISOvUt8iIP9oAUE0eW54kqFLjYDw=='
    }, null, function (err, bool) {
      t.error(err)
      t.ok(bool)
      t.end()
    })
  })
}