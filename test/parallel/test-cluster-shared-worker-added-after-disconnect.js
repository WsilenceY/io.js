'use strict';
const common = require('../common');
const assert = require('assert');
const net = require('net');
const cluster = require('cluster');
cluster.schedulingPolicy = cluster.SCHED_NONE;

if (cluster.isMaster) {
  var worker1, worker2;

  worker1 = cluster.fork();
  worker1.on('message', common.mustCall(function() {
    worker2 = cluster.fork();
    const c = net.connect(common.PORT, common.mustCall(function() {
      c.unref();
      worker1.send('die');
      worker2.send('die');
    }));
    c.on('error', function(e) {
      // ECONNRESET is OK
      if (e.code !== 'ECONNRESET')
        throw e;
    });
  }));

  return;
}

var server = net.createServer({}, function(c) {
  c.end('bye');
});

server.listen(common.PORT, function() {
  process.send('listening');
});

process.on('message', function listener() {
  server.close(function() {
    process.exit();
  });
});
