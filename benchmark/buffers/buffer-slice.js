'use strict';
const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();

const SlowBuffer = require('buffer').SlowBuffer;

suite.add('Buffer', main.bind(null, new Buffer(1024)));
suite.add('SlowBuffer', main.bind(null, new SlowBuffer(1024)));

suite.on('cycle', function(event) {
  console.log(String(event.target));
});

suite.run();

function main(b) {
  b.slice(10, 256);
}
