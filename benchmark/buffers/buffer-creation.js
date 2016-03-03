'use strict';
const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();

const SlowBuffer = require('buffer').SlowBuffer;

var clazz;

function setup(type) {
  clazz = type === 'fast' ? Buffer : SlowBuffer;
}

['fast', 'slow'].forEach((type) => {
  [10, 1024].forEach((len) => {
    suite.add(
      `${type}-${len}`,
      main.bind(null, len),
      { onStart: setup.bind(null, type) }
    );
  });
});

suite.on('cycle', function(event) {
  console.log(String(event.target));
});

suite.run();

function main(len) {
  new clazz(len);
}
