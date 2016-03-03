'use strict';
const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();

const assert = require('assert');

var s, b;

function setup() {
  s = 'abcd'.repeat(8 << 20);
  s.match(/./);  // Flatten string.
  assert.equal(s.length % 4, 0);
  b = Buffer(s.length / 4 * 3);
  b.write(s, 0, s.length, 'base64');
}

suite.add('buffer-base64-decode', main, {onStart: setup});

suite.on('cycle', function(event) {
  console.log(String(event.target));
});

suite.run();

function main() {
  b.base64Write(s, 0, s.length);
}
