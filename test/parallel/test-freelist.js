'use strict';
var assert = require('assert');
var freelist = require('freelist');

assert(typeof freelist === 'object');
assert(typeof freelist.FreeList === 'function');
