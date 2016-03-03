'use strict';
const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();

const v8 = require('v8');

var b0, b1;

function setup(size) {
  b0 = new Buffer(size).fill('a');
  b1 = new Buffer(size).fill('a');

  b1[size - 1] = 'b'.charCodeAt(0);

  // Force optimization before starting the benchmark
  b0.compare(b1);
  v8.setFlagsFromString('--allow_natives_syntax');
  eval('%OptimizeFunctionOnNextCall(b0.compare)');
  b0.compare(b1);
}

[16, 512, 1024, 4096, 16386].forEach((size) => {
  suite.add(size, main, { onStart: setup.bind(null, size) });
});

suite.on('cycle', function(event) {
  console.log(String(event.target));
});

suite.run();

function main() {
  b0.compare(b1);
}
