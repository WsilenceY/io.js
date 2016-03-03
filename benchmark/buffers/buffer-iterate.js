'use strict';
const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();

const SlowBuffer = require('buffer').SlowBuffer;
const assert = require('assert');

var buffer;

function setup(len, clazz) {
  buffer = new clazz(len);
  buffer.fill(0);
}

[16, 512, 1024, 4096, 16386].forEach((size) => {
  [Buffer, SlowBuffer].forEach((type) => {
    [benchFor, benchForOf, benchIterator].forEach((method) => {
      suite.add(
        `${size}-${type.name}-${method.name}`,
        method,
        {onStart: setup.bind(null, size, type)}
      );
    });
  });
});

suite.on('cycle', function(event) {
  console.log(String(event.target));
});

suite.run();

function benchFor() {
  for (var i = 0; i < buffer.length; i++)
    assert(buffer[i] === 0);
}

function benchForOf() {
  for (var b of buffer)
    assert(b === 0);
}

function benchIterator() {
  var iter = buffer[Symbol.iterator]();
  var cur = iter.next();

  while (!cur.done) {
    assert(cur.value === 0);
    cur = iter.next();
  }

}

