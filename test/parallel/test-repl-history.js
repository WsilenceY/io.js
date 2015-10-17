'use strict';

const common = require('../common');
const assert = require('assert');
const path = require('path');
const fs = require('fs');
const repl = require('internal/repl');

// Invoking the REPL should create a repl history file at the specified path
// and mode 600.

common.refreshTmpDir();
const replHistoryPath = path.join(common.tmpDir, 'repl_history');

const checkResults = common.mustCall(function(err, r) {
  if (err)
    throw err;
  r.input.end();
  const stat = fs.statSync(replHistoryPath);
  const mode = '0' + (stat.mode & parseInt('777', 8)).toString(8);
  assert.strictEqual(mode, '0600');
});

repl.createInternalRepl(
  {NODE_REPL_HISTORY: replHistoryPath},
  {terminal: true},
  checkResults
);
