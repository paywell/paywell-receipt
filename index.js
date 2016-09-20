'use strict';

//dependencies
const path = require('path');
const _ = require('lodash');
const receipt = require(path.join(__dirname, 'src', 'receipt'));

exports = module.exports = function (options) {
  //merge options
  receipt.defaults = _.merge({}, receipt.defaults, options);

  //initialize
  receipt.init();

  //export
  return receipt;
};