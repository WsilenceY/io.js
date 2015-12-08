// In Node 5.1.1 on Linux, this test throws an AssertionError in
// `internal/child_process.js`.

'use strict';
const common = require('../common');
const net = require('net');
const cluster = require('cluster');
cluster.schedulingPolicy = cluster.SCHED_NONE;

if (cluster.isMaster) {
  var worker1, worker2;

  worker1 = cluster.fork();
  worker1.on('message', common.mustCall(function() {
    worker2 = cluster.fork();
    worker1.disconnect();
    worker2.disconnect();
  }));

  return;
}

var server = net.createServer();

server.listen(common.PORT, function() {
  process.send('listening');
});
