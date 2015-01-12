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
    mMessage.makeEnvelope(settings, message, null, function (err, message) {
      mMessage.makeDoc(settings, message, function (err, doc) {
        t.deepEqual(doc, {
          key: '7SE9prmjZcP9ierHwYAqnE8SzDPpv7BDR5sdHMAHuyUyF5PgS/JQ381qXZKEqn9IxfjIUuS0Pj1PvmLu/Xvrtg==',
          value: {
            chain_id: 'franklin',
            content: 'hello',
            previous: null,
            public_key: 'N3DyaY1o1EmjPLUkRQRu41/g/xKe/CR/cCmatA78+zY=7XuCMMWN3y/r6DeVk7YGY8j/0rWyKm3TNv3S2cbmXKk=',
            sequence: 0,
            signature: 'zunrWte2/7fbB3yLc82PE3JGSw0+Zvus2u4wSJ0Ms3LnRjBaYejp6way+YDAvjktC6yjN1X6fSYhxat18EmTAA==',
            timestamp: 1418273900123,
            type: 'microstar-message|test'
          }
        })

        t.end()
      })
    })
  })

  test('validate', function (t) {
    mMessage.validate(settings, {
      chain_id: 'franklin',
      content: 'hello',
      previous: null,
      public_key: 'N3DyaY1o1EmjPLUkRQRu41/g/xKe/CR/cCmatA78+zY=7XuCMMWN3y/r6DeVk7YGY8j/0rWyKm3TNv3S2cbmXKk=',
      sequence: 0,
      signature: 'zunrWte2/7fbB3yLc82PE3JGSw0+Zvus2u4wSJ0Ms3LnRjBaYejp6way+YDAvjktC6yjN1X6fSYhxat18EmTAA==',
      timestamp: 1418273900123,
      type: 'microstar-message|test'
    }, null, function (err, bool) {
      t.error(err)
      t.ok(bool)
      t.end()
    })
  })
}