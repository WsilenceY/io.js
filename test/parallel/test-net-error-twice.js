'use strict';
const common = require('../common');
const assert = require('assert');
const net = require('net');

const buf = new Buffer(10 * 1024 * 1024);

buf.fill(0x62);

var errs = [];

const srv = net.createServer(function onConnection(conn) {
  console.error('server');
  conn.write(buf);

  conn.on('error', function onError(err) {
    console.error('error');
    errs.push(err);
    if (errs.length > 1)
      assert(errs[0] !== errs[1], 'Should not get the same error twice');
  });
  conn.on('close', function onClose() {
    console.error('close');
    srv.unref();
  });
}).listen(common.PORT, function() {
  console.error('listen');
  const client = net.connect({ port: common.PORT });
  client.on('connect', function onConnect() {
    console.error('client');
    client.destroy();
  });
});

process.on('exit', function onExit() {
  console.error('exit');
  assert.equal(errs.length, 1);
});
