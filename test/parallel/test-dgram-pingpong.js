'use strict';
const common = require('../common');
const assert = require('assert');
const Buffer = require('buffer').Buffer;
const dgram = require('dgram');

var tests_run = 0;

function pingPongTest(port, host) {
  var callbacks = 0;
  const N = 500;
  var count = 0;

  const server = dgram.createSocket('udp4', function(msg, rinfo) {
    if (/PING/.exec(msg)) {
      var buf = new Buffer(4);
      buf.write('PONG');
      server.send(buf, 0, buf.length,
                  rinfo.port, rinfo.address,
                  function(err, sent) {
                    callbacks++;
                  });
    }
  });

  server.on('error', function(e) {
    throw e;
  });

  server.on('listening', function() {
    console.log('server listening on ' + port + ' ' + host);

    const buf = new Buffer('PING');
    const client = dgram.createSocket('udp4');

    client.on('message', function(msg) {
      assert.equal('PONG', msg.toString('ascii'));

      console.log(`received PONG number ${count} on ${port}`);
      count += 1;

      if (count < N) {
        client.send(buf, 0, buf.length, port, 'localhost');
      } else {
        client.send(buf, 0, buf.length, port, 'localhost', function() {
          client.close();
        });
      }
    });

    client.on('close', function() {
      console.log('client has closed, closing server');
      assert.equal(N, count);
      tests_run += 1;
      server.close();
      assert.equal(N - 1, callbacks);
    });

    client.on('error', function(e) {
      throw e;
    });

    console.log('Client sending to ' + port + ', localhost ' + buf);
    client.send(buf, 0, buf.length, port, 'localhost', function(err, bytes) {
      if (err) {
        throw err;
      }
      console.log('Client sent ' + bytes + ' bytes');
    });
    count += 1;
  });
  server.bind(port, host);
}

// All are run at once, so run on different ports
pingPongTest(common.PORT + 0, 'localhost');
pingPongTest(common.PORT + 1, 'localhost');
pingPongTest(common.PORT + 2);
//pingPongTest('/tmp/pingpong.sock');

process.on('exit', function() {
  assert.equal(3, tests_run);
  console.log('done');
});
