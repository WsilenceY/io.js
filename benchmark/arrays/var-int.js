'use strict';
const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();

const n = 25;

var clazz;

function setup(type) {
  clazz = global[type];
}

['Array', 'Buffer', 'Int8Array', 'Uint8Array', 'Int16Array', 'Uint16Array',
 'Int32Array', 'Uint32Array', 'Float32Array', 'Float64Array']
.forEach((type) => {
  suite.add(type, main.bind(null, type), {onStart: setup.bind(null, type)});
});

suite.on('cycle', function(event) {
  console.log(String(event.target));
});

suite.run();

function main(type) {
  var arr = new clazz(n * 1e6);
  for (var j = 0, k = arr.length; j < k; ++j) {
    arr[j] = (j ^ k) & 127;
  }
}
