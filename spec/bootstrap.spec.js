'use strict';

process.env.NODE_ENV = 'test';

//dependencies
const redis = require('paywell-redis')();


//clean database
after(function (done) {
  redis.clear(done);
});

//clean resources
after(function () {
  redis.quit();
});