'use strict';

const common = require('../common');
const net = require('net');
const fs = require('fs');
const path = require('path');

const tmpFile = path.join(common.tmpDir, 'foo');

try {
  fs.accessSync(tmpFile);
} catch (e) {
  fs.openSync(tmpFile, 'w');
  net.createConnection({port: common.PORT});
}
