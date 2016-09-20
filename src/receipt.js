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

//TODO make use of event emitter

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
  queue: 'receipts',
  concurrency: 10
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
 * @description initialize receipt internals
 * @since 0.1.0
 * @public
 */
exports.init = function () {

  //initialize redis client
  if (!exports.redis) {
    exports.redis = redis(exports.defaults);
  }

  //initialize queue
  if (!exports._queue) {
    //TODO listen queue errors
    exports._queue = kue.createQueue(exports.defaults);
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


/**
 * @function
 * @name get
 * @description get receipt(s)
 * @param  {String,String[]}   keys valid receipt(s) key(s)
 * @param  {Function} done a callback to invoke on success or failure
 * @return {Object|Object[]}        collection or single receipt
 * @since 0.1.0
 * @public
 */
exports.get = function (keys, done) {

  //get specific receipt(s)
  const client = exports.redis;
  client.hash.get(keys, function (error, receipts) {
    if (_.isArray(receipts)) {
      //map receivedAt to date
      receipts = receipts;
    } else {
      receipts = _.merge({}, receipts, {
        receivedAt: Date(receipts.receivedAt)
      });
    }

    done(error, receipts);
  });

};


/**
 * @function
 * @name queue
 * @description queue receipt for later processing
 * @param  {Object} receipt valid paywell receipt
 * @since 0.1.0
 * @public
 */
exports.queue = function (receipt) {
  //ensure receipt
  receipt = _.merge({}, receipt);

  //ensure queue
  exports.init();

  //create receipt processing job and queue it
  let job = exports._queue.create(exports.defaults.queue, receipt);

  job.priority('high');

  //TODO handle job creation error
  job.save();

};


/**
 * @name process
 * @description register queue worker
 * @param  {String} jobType  job type
 * @param  {[type]} workerFn a worker function to be used in processing a job
 * @since 0.1.0
 * @public
 */
exports.process = function (jobType, workerFn) {
  //normalize arquments
  if (jobType && _.isFunction(jobType)) {
    workerFn = jobType;
    jobType = exports.defaults.queue;
  }

  //TODO ensure parameters
  
  //register queue worker
  exports._queue.process(jobType, exports.defaults.concurrency, workerFn);

};