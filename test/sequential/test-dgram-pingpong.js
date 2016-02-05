'use strict';
const common = require('../common');
const assert = require('assert');
const dgram = require('dgram');

function pingPongTest(port, host) {
  let pingsReceived = 0;
  let pongsReceived = 0;
  let done = false;

  const N = 5;

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

      pongsReceived++;
      if (pongsReceived === N) {
        done = true;
        client.close();
      }
    });

    client.on('close', common.mustCall(function() {
      console.log('client has closed, closing server');
      assert(pingsReceived >= N);
      assert.strictEqual(pongsReceived, N);
      server.close();
    }));

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
}

// All are run at once, so run on different ports
pingPongTest(common.PORT + 0, 'localhost');
pingPongTest(common.PORT + 1, 'localhost');
pingPongTest(common.PORT + 2);
