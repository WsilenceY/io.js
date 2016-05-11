'use strict';

const common = require('../common');

if (!(process.platform === 'darwin' || common.isWindows)) {
  console.log('1..0 # Skipped: recursive option is darwin/windows specific');
  return;
}

const assert = require('assert');
const path = require('path');
const fs = require('fs');

const testDir = common.tmpDir;
const filenameOne = 'watch.txt';
const testsubdirName = 'testsubdir';
const testsubdir = path.join(testDir, testsubdirName);
const relativePathOne = path.join('testsubdir', filenameOne);
const filepathOne = path.join(testsubdir, filenameOne);

common.refreshTmpDir();

fs.mkdirSync(testsubdir, 0o700);

const watcher = fs.watch(testDir, { recursive: true });

var watcherClosed = false;
watcher.on('change', function(event, filename) {
  assert.ok('change' === event || 'rename' === event);

  // Ignore stale events generated by mkdir and other tests
  if (filename !== relativePathOne)
    return;

  watcher.close();
  watcherClosed = true;
});

fs.writeFileSync(filepathOne, 'world');

process.on('exit', function() {
  assert(watcherClosed, 'watcher Object was not closed');
});
