'use strict';
var common = require('../common');
var assert = require('assert');
var cluster = require('cluster');

// Cluster setup
if (cluster.isWorker) {
  var http = require('http');
  http.Server(function() {

  }).listen(common.PORT, '127.0.0.1');

} else if (process.argv[2] === 'cluster') {

  var totalWorkers = 2;

  // Send PID to testcase process
  var forkNum = 0;
  cluster.on('fork', function forkEvent(worker) {

    // Send PID
    process.send({
      cmd: 'worker',
      workerPID: worker.process.pid
    });

    // Stop listening when done
    if (++forkNum === totalWorkers) {
      cluster.removeListener('fork', forkEvent);
    }
  });

  // Throw accidently error when all workers are listening
  var listeningNum = 0;
  cluster.on('listening', function listeningEvent() {

    // When all workers are listening
    if (++listeningNum === totalWorkers) {
      // Stop listening
      cluster.removeListener('listening', listeningEvent);

      // throw accidently error
      process.nextTick(function() {
        console.error('about to throw');
        throw new Error('accidently error');
      });
    }

  });

  // Startup a basic cluster
  cluster.fork();
  cluster.fork();

} else {
  // This is the testcase

  var fork = require('child_process').fork;

  var existMaster = false;

  // List all workers
  var workers = [];

  // Spawn a cluster process
  var master = fork(process.argv[1], ['cluster'], {silent: true});

  // Handle messages from the cluster
  master.on('message', function(data) {

    // Add worker pid to list and progress tracker
    if (data.cmd === 'worker') {
      workers.push(data.workerPID);
    }
  });

  // When cluster is dead
  master.on('exit', function(code) {
    // Check that the cluster died accidently
    existMaster = !!code;
  });

  process.once('exit', function() {
    assert.ok(existMaster, 'master did not die after an error was thrown');
    workers.forEach(function(pid) {
      var exited;
      try {
        // this will throw an error if the process is dead
        process.kill(pid, 0);
        exited = false;
      } catch (e) {
        exited = true;
      }
      assert.ok(exited, 'A worker did not die after an error in the master');
    });
  });
}
