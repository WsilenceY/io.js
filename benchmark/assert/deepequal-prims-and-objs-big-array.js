'use strict';
const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();

const assert = require('assert');

const primValues = {
  'null': null,
  'undefined': undefined,
  'string': 'a',
  'number': 1,
  'boolean': true,
  'object': { 0: 'a' },
  'array': [1, 2, 3],
  'new-array': new Array([1, 2, 3])
};

var prim, primArray, primArrayCompare;

function setup(key) {
  prim = primValues[key];

  primArray = new Array();
  primArrayCompare = new Array();
  for (var x = 0; x < (1e5); x++) {
    primArray.push(prim);
    primArrayCompare.push(prim);
  }
}

Object.keys(primValues)
.forEach((key) => {
  suite.add(key, main, {onStart: setup.bind(null, key)});
});

suite.on('cycle', function(event) {
  console.log(String(event.target));
});

suite.run();

function main() {
  assert.deepEqual(primArray, primArrayCompare);
}
