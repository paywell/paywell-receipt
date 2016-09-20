'use strict';


/**
 * @module
 * @copyright paywell Team at byteskode <www.byteskode.com>
 * @description save, get, search and queue receipt
 * @since 0.1.0
 * @author lally elias<lallyelias87@gmail.com, lally.elias@byteskode.com>
 * @singleton
 * @public
 */


//dependencies
const _ = require('lodash');
const redis = require('paywell-redis');
const kue = require('kue');
const uuid = require('uuid');


//default receipt options
const defaults = {
  prefix: 'paywell',
  redis: {},
  collection: 'receipts',
  queue: 'receipts'
};


/**
 * @name defaults
 * @description default options/settings
 * @type {Object}
 * @private
 * @since 0.1.0
 */
exports.defaults = _.merge({}, defaults);


/**
 * @function
 * @name init
 * @description initialize tigopesa receipt internals
 * @since 0.1.0
 * @public
 */
exports.init = function () {
  //initialize redis client
  if (!exports.redis) {
    exports.redis = redis(exports.defaults);
  }

  //initialize queue
  if (!exports.queue) {
    //TODO listen queue errors
    exports.queue = kue.createQueue(exports.defaults);
  }

};


exports.save = function (receipt, done) {

  //ensure receipt
  receipt = _.merge({
    uuid: uuid.v1()
  }, receipt);

  //prepare save options
  const options = {
    collection: exports.defaults.collection,
    index: true,
    ignore: ['payload']
  };

  //save receipt
  const client = exports.redis;
  client.hash.save(receipt, options, function (error, _receipt) {
    _receipt.receivedAt = new Date(_receipt.receivedAt);
    done(error, _receipt);
  });

};


exports.search = function (query, done) {

  //prepare search options
  const options = {
    collection: exports.defaults.collection,
    q: query
  };

  //search receipts
  const client = exports.redis;
  client.hash.search(options, function (error, receipts) {
    done(error, receipts);
  });

};


exports.get = function (keys, done) {

  //get specific receipt(s)
  const client = exports.redis;
  client.hash.get(keys, function (error, receipts) {
    if (_.isArray(receipts)) {
      receipts = receipts;
    } else {
      receipts = _.merge({}, receipts, {
        receivedAt: Date(receipts.receivedAt)
      });
    }

    done(error, receipts);
  });

};