'use strict';
const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();

const assert = require('assert');

const types = [
  'Int8Array',
  'Uint8Array',
  'Int16Array',
  'Uint16Array',
  'Int32Array',
  'Uint32Array',
  'Float32Array',
  'Float64Array',
  'Uint8ClampedArray'
];

const n = 1;

var clazz, actual, expected;

function setup(type) {
  clazz = global[type];
  actual = new clazz(n * 1e6);
  expected = new clazz(n * 1e6);
}

types
.forEach((type) => {
  suite.add(type, main, {onStart: setup.bind(null, type)});
});

suite.on('cycle', function(event) {
  console.log(String(event.target));
});

suite.run();

function main() {
  assert.deepEqual(actual, expected);
}
