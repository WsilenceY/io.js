// Benchmark for test/common.js initialization code

var path = require('path');
var cp = require('child_process');
var common = require('../common.js');

var bench = common.createBenchmark(main, {
  n: [8]
});

var exe = path.resolve(__dirname, '../../iojs');
var filePath = path.resolve(__dirname, '../../test/common.js');

function main(conf) {
  var n = +conf.n;

  bench.start();
  for (var i = 0; i < n; i++) {
    cp.spawnSync(exe, [filePath]);
  }
  bench.end(n);
}