'use strict';

var should = require('should'),
    app = require('../../../server'),
    request = require('supertest');

describe('GET /auth/client', function() {
  
  it('should respond with JSON Object', function(done) {
    request(app)
      .get('/auth/client')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Object);
        done();
      });
  });
});
