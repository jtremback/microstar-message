'use strict';

var test = require('tape')
var mMessage = require('../')
var mCrypto = require('microstar-crypto')

mCrypto.keys('h4dfDIR+i3JfCw1T2jKr/SS/PJttebGfMMGwBvhOzS4=', function (err, keys) {
  tests(mMessage({
    crypto: mCrypto,
    keys: keys
  }))
})

function tests (mMessage) {
  var message = {
    content: 'hello',
    feed_id: 'franklin',
    type: 'microstar-message|test',
    timestamp: 1418273900123
  }

  test('create', function (t) {
    mMessage.create(message, null, function (err, doc) {
      t.deepEqual(doc, {
        key: 'HcytP60FiinM744AP6cbur9YdDGsWlX7NiaL95WMXzyzERasnoVexhu5ty7L1IT3BL7gMnB/sOrSStK+6XuaOQ==',
        value: {
          content: 'hello',
          type: 'microstar-message|test',
          feed_id: 'franklin',
          timestamp: 1418273900123,
          previous: null,
          sequence: 0,
          pub_key: 'N3DyaY1o1EmjPLUkRQRu41/g/xKe/CR/cCmatA78+zY=7XuCMMWN3y/r6DeVk7YGY8j/0rWyKm3TNv3S2cbmXKk=',
          signature: 'RjxIw+B09B/i1YUUogVepKCdCqcZH7rCyJIeZI+OFOokl5Ni1jqkndbGPI63HCpYNSdGpRGB0vdOSWmMVSw7Cw=='
        }
      })

      t.end()
    })
  })

  test('validate', function (t) {
    mMessage.validate({
      content: 'hello',
      type: 'microstar-message|test',
      feed_id: 'franklin',
      timestamp: 1418273900123,
      previous: null,
      sequence: 0,
      pub_key: 'N3DyaY1o1EmjPLUkRQRu41/g/xKe/CR/cCmatA78+zY=7XuCMMWN3y/r6DeVk7YGY8j/0rWyKm3TNv3S2cbmXKk=',
      signature: 'RjxIw+B09B/i1YUUogVepKCdCqcZH7rCyJIeZI+OFOokl5Ni1jqkndbGPI63HCpYNSdGpRGB0vdOSWmMVSw7Cw=='
    }, null, function (err, bool) {
      t.error(err)
      t.ok(bool)
      t.end()
    })
  })
}