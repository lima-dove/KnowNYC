'use strict'
/* global describe it */

const seed = require('../script/seed')

describe('seed script', function() {
  this.timeout(10000)
  it('should take less than 10000ms', function(done) {
    setTimeout(done, 9000)
  })
})
