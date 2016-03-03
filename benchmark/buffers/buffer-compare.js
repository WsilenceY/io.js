'use strict';
const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();

var b0, b1;

function setup(size) {
  b0 = new Buffer(size).fill('a');
  b1 = new Buffer(size).fill('a');

  b1[size - 1] = 'b'.charCodeAt(0);
}

[16, 512, 1024, 4096, 16386].forEach((size) => {
  suite.add(size, main, { onStart: setup.bind(null, size) });
});

suite.on('cycle', function(event) {
  console.log(String(event.target));
});

suite.run();

function main() {
  Buffer.compare(b0, b1);
}
