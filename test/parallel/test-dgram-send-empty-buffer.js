'use strict';
const common = require('../common');

if (common.isOSX) {
  common.skip('because of 17894467 Apple bug');
  return;
}

const dgram = require('dgram');

const client = dgram.createSocket('udp4');

client.bind(0, common.mustCall(function() {
  const port = this.address().port;

  client.on('message', common.mustCall(function onMessage(buffer, bytes) {
    client.close();
  }));

  const buf = Buffer.alloc(0);
  client.send(buf, 0, 0, port, '127.0.0.1', common.mustCall(function() { }));
}));
