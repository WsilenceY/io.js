'use strict';
// Flags: --expose_internals

const common = require('../common');
const assert = require('assert');
const path = require('path');
const fs = require('fs');
const repl = require('internal/repl');
const Duplex = require('stream').Duplex;
// Invoking the REPL should create a repl history file at the specified path
// and mode 600.

var stream = new Duplex();
stream.pause = stream.resume = function() {};
// ends immediately
stream._read = function() {
  this.push(null);
};
stream._write = function(c, e, cb) {
  cb();
};
stream.readable = stream.writable = true;

common.refreshTmpDir();
const replHistoryPath = path.join(common.tmpDir, 'repl_history');

const checkResults = common.mustCall(function(err, r) {
  if (err)
    throw err;
  r.input.end();
  const stat = fs.statSync(replHistoryPath);
  const mode = '0' + (stat.mode & parseInt('777', 8)).toString(8);
  assert.strictEqual(mode, '0600', 'REPL history file should be mode 0600');
});

repl.createInternalRepl(
  {NODE_REPL_HISTORY: replHistoryPath},
  {
    terminal: true,
    input: stream,
    output: stream
  },
  checkResults
);
