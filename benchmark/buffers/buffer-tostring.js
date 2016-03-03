'use strict';
const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();

var buf;

function setup(len) {
  buf = Buffer(len).fill(42);
}

[true, false].forEach((arg) => {
  [0, 1, 64, 1024].forEach((len) => {
    suite.add(
      `${arg}-${len}`,
      main.bind(null, arg),
      { onStart: setup.bind(null, len) }
    );
  });
});

suite.on('cycle', function(event) {
  console.log(String(event.target));
});

suite.run();

function main(arg) {
  if (arg) {
    buf.toString('utf8');
  } else {
    buf.toString();
  }
}
