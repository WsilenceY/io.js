'use strict';
const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();

const zero = new Buffer(0);

suite.add('buffer_zero', main);

suite.on('cycle', function(event) {
  console.log(String(event.target));
});

suite.run();

function main() {
  new Buffer(zero);
}
