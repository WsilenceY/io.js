'use strict';
var fs = require('fs');
var assert = require('assert');
var cp = require('child_process');
var common = require('../common');

common.refreshTmpDir();
process.chdir(common.tmpDir);

if (common.isWindows ||
    common.isSunOS ||
    common.isAix ||
    common.isLinuxPPCBE ||
    common.isFreeBSD) {
  console.log('1..0 # Skipped: C++ symbols are not mapped for this os.');
  return;
}

runTest(/RunInDebugContext/,
  `function f() {
     require('vm').runInDebugContext('Debug');
     setImmediate(function() { f(); });
   };
   setTimeout(function() { process.exit(0); }, 2000);
   f();`);

function runTest(pattern, code) {
  cp.execFileSync(process.execPath, ['-prof', '-pe', code]);
  var matches = fs.readdirSync(common.tmpDir).filter(function(file) {
    return /^isolate-/.test(file);
  });
  if (matches.length != 1) {
    common.fail('There should be a single log file.');
  }
  var log = matches[0];
  var out = cp.execSync(process.execPath +
                        ' --prof-process --call-graph-size=10 ' + log,
                        {encoding: 'utf8'});
  assert(pattern.test(out));
  fs.unlinkSync(log);
}
