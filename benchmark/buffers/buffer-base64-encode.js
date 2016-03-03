'use strict';
const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();

var b, i;

function setup() {
  const N = 64 * 1024 * 1024;
  b = Buffer(N);
  var s = '';
  for (i = 0; i < 256; ++i) s += String.fromCharCode(i);
  for (i = 0; i < N; i += 256) b.write(s, i, 256, 'ascii');
}

suite.add('buffer-base64-encode', main, {onStart: setup});

suite.on('cycle', function(event) {
  console.log(String(event.target));
});

suite.run();

function main() {
  b.toString('base64');
}
