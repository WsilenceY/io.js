'use strict';
const common = require('../common');
const fs = require('fs');
const cp = require('child_process');
const path = require('path');

common.refreshTmpDir();

const LOG_FILE = path.join(common.tmpDir, 'tick-processor.log');
const RETRY_TIMEOUT = 150;

function runTest(test) {
  const proc = cp.spawn(process.execPath, [
    '--no_logfile_per_isolate',
    '--logfile=-',
    '--prof',
    '-pe', test.code
  ], {
    stdio: [ 'ignore', 'pipe', 'inherit' ]
  });

  let ticks = '';
  proc.stdout.on('data', (chunk) => { return ticks += chunk; });

  // Try to match after timeout
  setTimeout(() => {
    match(test.pattern, proc, () => { return ticks; });
  }, RETRY_TIMEOUT);
}

function match(pattern, parent, ticks) {
  // Store current ticks log
  fs.writeFileSync(LOG_FILE, ticks());

  const proc = cp.spawn(process.execPath, [
    '--prof-process',
    '--call-graph-size=10',
    LOG_FILE
  ], {
    stdio: [ 'ignore', 'pipe', 'inherit' ]
  });

  let out = '';
  proc.stdout.on('data', (chunk) => { return out += chunk; });
  proc.stdout.once('end', () => {
    proc.once('exit', () => {
      fs.unlinkSync(LOG_FILE);

      // Retry after timeout
      if (!pattern.test(out))
        return setTimeout(() => {
          return match(pattern, parent, ticks);
        }, RETRY_TIMEOUT);

      parent.stdout.removeAllListeners();
      parent.kill();
    });

    proc.stdout.removeAllListeners();
    proc.kill();
  });
}

exports.runTest = runTest;
