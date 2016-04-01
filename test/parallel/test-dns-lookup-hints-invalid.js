'use strict';
require('../common');
const assert = require('assert');

const dns = require('dns');

function noop() {}

dns.setServers([]);

/*
 * Make sure that dns.lookup throws if hints does not represent a valid flag.
 * (dns.V4MAPPED | dns.ADDRCONFIG) + 1 is invalid because:
 * - it's different from dns.V4MAPPED and dns.ADDRCONFIG.
 * - it's different from them bitwise ored.
 * - it's different from 0.
 * - it's an odd number different than 1, and thus is invalid, because
 * flags are either === 1 or even.
 */
assert.throws(function() {
  dns.lookup('www.google.com', { hints: (dns.V4MAPPED | dns.ADDRCONFIG) + 1 },
    noop);
}, /Invalid argument: hints must use valid flags/);

assert.throws(function() {
  dns.lookup('www.google.com');
}, /Invalid arguments: callback must be passed/);

assert.throws(function() {
  dns.lookup('www.google.com', 4);
}, /Invalid arguments: callback must be passed/);
