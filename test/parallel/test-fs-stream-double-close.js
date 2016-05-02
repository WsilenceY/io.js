'use strict';

const common = require('../common');
const fs = require('fs');
const assert = require('assert');

common.refreshTmpDir();

const writeStream = fs.createWriteStream(common.tmpDir + '/fhqwhgads');

writeStream.on('error', common.mustCall((e) => {
  assert.strictEqual(e.code, 'EBADF');
}));

writeStream.close(common.mustCall((e) => {
  assert.strictEqual(e, undefined);
  writeStream.close(); // should trigger an error
}));
