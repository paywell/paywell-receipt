'use strict';

//dependencies
const path = require('path');
const _ = require('lodash');
const expect = require('chai').expect;
const redis = require('paywell-redis')();
const receipt = require(path.join(__dirname, '..'))();

describe('paywell-receipt', function () {

  //clean database
  before(function (done) {
    redis.clear(done);
  });

  it('should be importable', function () {
    expect(receipt).to.exist;
    expect(receipt).to.be.an.Object;
  });


  describe('save', function () {
    let rcpt;
    before(function (done) {
      redis.clear(done);
    });

    before(function () {
      rcpt = require(path.join(__dirname, 'fixtures',
        'receipt.json'));
    });

    it('should be able to save receipt', function (done) {
      receipt.save(rcpt, function (error, _receipt) {
        expect(error).to.not.exist;
        expect(_receipt._id).to.exist;
        delete _receipt._id;
        expect(_.omit(_receipt, ['receivedAt']))
          .to.be.eql(_.omit(rcpt, ['receivedAt']));
        done(error, _receipt);
      });
    });
  });


  describe('get', function () {
    let rcpt;
    let idx;
    before(function (done) {
      redis.clear(done);
    });

    before(function () {
      rcpt = require(path.join(__dirname, 'fixtures',
        'receipt.json'));
    });

    before(function (done) {
      receipt.save(rcpt, function (error, _receipt) {
        idx = _receipt._id;
        done(error, _receipt);
      });
    });

    it('should be able to get receipt', function (done) {
      receipt.get(idx, function (error, _receipt) {
        expect(error).to.not.exist;
        expect(_receipt._id).to.exist;
        delete _receipt._id;
        //TODO assert
        // expect(_receipt).to.be.eql(rcpt);
        done(error, _receipt);
      });
    });
  });

  describe('search', function () {
    let rcpt;
    before(function (done) {
      redis.clear(done);
    });

    before(function () {
      rcpt = require(path.join(__dirname, 'fixtures',
        'receipt.json'));
    });

    before(function (done) {
      receipt.save(rcpt, done);
    });

    it('should be able to search receipt', function (done) {
      receipt.search(rcpt.uuid, function (error, _receipts) {
        expect(error).to.not.exist;
        expect(_receipts[0]._id).to.exist;
        done(error, _receipts);
      });
    });
  });

  describe('queue', function () {
    let rcpt;

    beforeEach(function (done) {
      redis.clear(done);
    });

    before(function () {
      rcpt = require(path.join(__dirname, 'fixtures',
        'receipt.json'));
    });

    it(
      'should be able to queue receipt for later processing',
      function (done) {

        //listen for job receipt
        receipt.process(function (job, finish) {
          const receipt = job.data;
          expect(receipt.receivedAt).to.exist;
          expect(receipt.uuid).to.exist;
          expect(receipt.amount).to.exist;
          expect(receipt.customer).to.exist;
          expect(receipt.provider).to.exist;
          finish();
          done();
        });

        receipt.queue(rcpt);

      });
  });

  //clean database
  after(function (done) {
    redis.clear(done);
  });

  //quit
  after(function () {
    redis.quit();
  });

});