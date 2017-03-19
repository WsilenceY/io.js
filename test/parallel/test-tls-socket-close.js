'use strict';
const common = require('../common');
const assert = require('assert');

const tls = require('tls');
const fs = require('fs');
const net = require('net');

const key = fs.readFileSync(common.fixturesDir + '/keys/agent2-key.pem');
const cert = fs.readFileSync(common.fixturesDir + '/keys/agent2-cert.pem');

let tlsSocket;
let interval;
// tls server
const tlsServer = tls.createServer({ cert, key }, (socket) => {
  tlsSocket = socket;
  socket.on('error', common.mustCall((error) => {
    assert.strictEqual(error.code, 'EINVAL');
    tlsServer.close();
    netServer.close();
    clearInterval(interval);
  }));
});

let netSocket;
// plain tcp server
const netServer = net.createServer((socket) => {
  // if client wants to use tls
  tlsServer.emit('connection', socket);

  netSocket = socket;
}).listen(0, common.mustCall(function() {
  // connect client
  tls.connect({
    host: 'localhost',
    port: this.address().port,
    rejectUnauthorized: false
  }).write('foo', 'utf8', common.mustCall(() => {
    assert(netSocket);
    netSocket.setTimeout(1, common.mustCall(() => {
      assert(tlsSocket);
      // this breaks if TLSSocket is already managing the socket:
      netSocket.destroy();
      netSocket.on('close', () => { tlsSocket.write('bar'); });
    }));
  }));
}));
