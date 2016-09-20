paywell-receipt
================

[![Build Status](https://travis-ci.org/paywell/paywell-receipt.svg?branch=master)](https://travis-ci.org/paywell/paywell-receipt)
[![Dependency Status](https://img.shields.io/david/paywell/paywell-receipt.svg?style=flat)](https://david-dm.org/paywell/paywell-receipt)
[![npm version](https://badge.fury.io/js/paywell-receipt.svg)](https://badge.fury.io/js/paywell-receipt)

cash receipt for paywell

## Requirements
- [Redis 2.8.0+](http://redis.io/)
- [NodeJS 6.5.0+](https://nodejs.org/en/)

## Installation
```sh
$ npm install --save paywell-receipt
```

## Usage
```js
const receipt = require('paywell-receipt')([options]);

//save receipt
receipt.save(<receipt_details>, done);

//get receipt
receipt.get(<id>, done);

//search receipts
receipt.search(<search_term>, done);

//queue receipt for processing
receipt.queue(<receipt_details>, done);
```

## TODO
- [ ] Documentation
- [ ] should be able to save receipt
- [ ] should be able to get receipt
- [ ] should be able to search receipt
- [ ] should be able to persist receipt into MongoDB
- [ ] should be able to process receipt jobs
    + [ ] should be able to parse date string to js date

## Testing
* Clone this repository

* Install all development dependencies
```sh
$ npm install
```

* Then run test
```sh
$ npm test
```

## Contribute
It will be nice, if you open an issue first so that we can know what is going on, then, fork this repo and push in your ideas. Do not forget to add a bit of test(s) of what value you adding.

## Licence
The MIT License (MIT)

Copyright (c) 2015 byteskode, paywell, lykmapipo & Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 