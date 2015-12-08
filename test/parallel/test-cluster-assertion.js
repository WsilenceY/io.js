// In Node 5.1.1 on Linux, this test triggers an assertion in
// internal/child_process.js.

'use strict';
const common = require('../common');
//const assert = require('assert');
//const net = require('net');
const cluster = require('cluster');
cluster.schedulingPolicy = cluster.SCHED_NONE;

if (cluster.isMaster) {
  var conn, worker1, worker2;

  worker1 = cluster.fork();
  worker1.on('message', common.mustCall(function() {
    worker2 = cluster.fork();
    worker1.disconnect();
    worker2.disconnect();
  }));

  return;
}

process.send('go');
