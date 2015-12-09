'use strict';
const common = require('../common');
const assert = require('assert');
const net = require('net');

const buf = new Buffer(10 * 1024 * 1024);

buf.fill(0x62);

var errs = [];

const srv = net.createServer(function onConnection(conn) {
  const timer = setInterval(function writeToSocket() {
    conn.write(buf);
  }, common.platformTimeout(100));

  conn.on('error', function onError(err) {
    clearInterval(timer);
    errs.push(err);
    if (errs.length > 1)
      assert(errs[0] !== errs[1], 'Should not get the same error twice');
  });
  conn.on('close', function onClose() {
    srv.unref();
  });
}).listen(common.PORT, function() {
  const client = net.connect({ port: common.PORT });
  client.on('connect', function onConnect() {
    client.destroy();
  });
});

process.on('exit', function onExit() {
  assert.equal(errs.length, 1);
});
