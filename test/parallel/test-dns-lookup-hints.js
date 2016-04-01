'use strict';
require('../common');
const assert = require('assert');

const dns = require('dns');

function noop() {}

dns.setServers([]);

assert.doesNotThrow(function() {
  dns.lookup('www.google.com', 6, () => {console.log(1);});
});

assert.doesNotThrow(function() {
  dns.lookup('www.google.com', {}, () => {console.log(2);});
});

assert.doesNotThrow(function() {
  dns.lookup('www.google.com', {
    hints: dns.V4MAPPED
  }, () => {console.log(3);});
});

assert.doesNotThrow(function() {
  dns.lookup('www.google.com', {
    hints: dns.ADDRCONFIG | dns.V4MAPPED
  }, () => {console.log(4);});
});
