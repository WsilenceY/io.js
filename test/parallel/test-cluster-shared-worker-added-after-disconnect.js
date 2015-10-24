'use strict';
const common = require('../common');
const assert = require('assert');
const net = require('net');
const cluster = require('cluster');
cluster.schedulingPolicy = cluster.SCHED_NONE;

if (cluster.isMaster) {
  var shotOnce = false;

  function shoot() {
    var c = net.connect(common.PORT, function() {
      c.unref();

      Object.keys(cluster.workers).forEach(function(id) {
        cluster.workers[id].send('die');
      });
    });
  }

  function fork() {
    var worker = cluster.fork();
    worker.on('message', function() {
      if (!shotOnce) {
        shotOnce = true;
        shoot();
      }
      fork();
    });
  }
  fork();
  return;
}

var server = net.createServer({}, function(c) {
  c.end();
});

server.listen(common.PORT, function() {
  process.send('listening');
});

process.on('message', function listener(msg) {
  if (msg === 'die') {
    server.close(function() {
      process.exit();
    });
  }
});

