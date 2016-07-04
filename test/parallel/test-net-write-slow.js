'use strict';
const common = require('../common');
const assert = require('assert');
const net = require('net');

const SIZE = 2E5;
const N = 10;
var flushed = 0;
var received = 0;
const buf = Buffer.alloc(SIZE, 'a');

const server = net.createServer(function(socket) {
  socket.setNoDelay();
  socket.setTimeout(1000);
  socket.on('timeout', function() {
    common.fail(`flushed: ${flushed}, received: ${received}/${SIZE * N}`);
  });

  for (var i = 0; i < N; ++i) {
    socket.write(buf, function() {
      ++flushed;
      if (flushed === N) {
        socket.setTimeout(0);
      }
    });
  }
  socket.end();

}).listen(0, function() {
  const conn = net.connect(this.address().port);
  conn.on('data', function(buf) {
    received += buf.length;
    conn.pause();
    setTimeout(function() {
      conn.resume();
    }, 20);
  });
  conn.on('end', function() {
    server.close();
  });
});

process.on('exit', function() {
  assert.strictEqual(received, SIZE * N);
});
