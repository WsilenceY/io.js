'use strict';
const common = require('../common');
const assert = require('assert');
const dgram = require('dgram');

function pingPongTest(port, host) {
  let pingsReceived = 0;
  let done = false;

  const server = dgram.createSocket('udp4', function(msg, rinfo) {
    assert.strictEqual('PING', msg.toString('ascii'));
    pingsReceived++;
    server.send('PONG', 0, 4, rinfo.port, rinfo.address);
  });

  server.on('error', function(e) {
    throw e;
  });

  server.on('listening', function() {
    console.log('server listening on ' + port);

    const client = dgram.createSocket('udp4');

    client.on('message', function(msg) {
      assert.strictEqual('PONG', msg.toString('ascii'));

      done = true;
      client.close();
      server.close();
      assert(pingsReceived >= 1);
    });

    client.on('error', function(e) {
      throw e;
    });

    console.log('Client sending to ' + port);

    function clientSend() {
      client.send('PING', 0, 4, port, 'localhost');
      setImmediate(() => {
        if (!done)
          clientSend();
      });
    }

    clientSend();
  });
  server.bind(port, host);
  return server;
}

const server = pingPongTest(common.PORT, 'localhost');
server.on('close', common.mustCall(pingPongTest.bind(this, common.PORT)));
