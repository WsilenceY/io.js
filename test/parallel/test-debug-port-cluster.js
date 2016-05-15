'use strict';
const common = require('../common');
const assert = require('assert');
const spawn = require('child_process').spawn;

const PORT_MIN = common.PORT + 1337;
const PORT_MAX = PORT_MIN + 2;

const args = [
  '--debug=' + PORT_MIN,
  common.fixturesDir + '/clustered-server/app.js'
];

const child = spawn(process.execPath, args);
child.stderr.setEncoding('utf8');

let stderr = '';
child.stderr.on('data', (data) => {
  // process.stderr.write(`[DATA] ${data}`);
  stderr += data;
  if (child.killed !== true && stderr.includes('all workers are running')) {
    child.kill();
    for (let port = PORT_MIN; port <= PORT_MAX; port += 1) {
      assert(stderr.includes(`Debugger listening on port ${port}`));
    }
  }
});
