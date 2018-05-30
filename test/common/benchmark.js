/* eslint-disable node-core/required-modules */

'use strict';

const assert = require('assert');
const fork = require('child_process').fork;
const path = require('path');

const runjs = path.join(__dirname, '..', '..', 'benchmark', 'run.js');

function runBenchmark(name, args, env) {
  const argv = [];

  for (let i = 0; i < args.length; i++) {
    argv.push('--set');
    argv.push(args[i]);
  }

  argv.push(name);

  const mergedEnv = Object.assign({}, process.env, env);

  const child = fork(runjs, argv, { env: mergedEnv, stdio: 'pipe' });

  // This bit makes sure that each benchmark file is being sent settings such
  // that the benchmark file runs just one set of options. This helps keep the
  // benchmark tests from taking a long time to run. THerefore, each benchmark
  // file should result in three lines of output: a blank line, a line with the
  // name of the benchmark file, and a line with the only results that we get
  // from testing the benchmark file.

  let lineCount = 0;
  child.stdout.on('data', (line) => {
    const thisLine = line.toString().trim();
    console.log(thisLine);

    if (lineCount % 3 === 0) {
      // First line of each three lines of output should be a blank line.
      assert.strictEqual(thisLine, '');
    } else {
      // Second line of each three lines of output should have the benchmark
      // file name.
      // Third line of each three lines of output should hve the benchmark
      // results. We should only get one benchmark result for each file. If
      // we're getting more, we should add more options in the test-benchmark-*
      // file such that we only get one.
      assert.notStrictEqual(thisLine, '');
    }
    lineCount++;
  });

  child.on('exit', (code, signal) => {
    assert.strictEqual(code, 0);
    assert.strictEqual(signal, null);
    assert.ok(lineCount > 0);
    assert.strictEqual(lineCount % 3, 0);
  });
}

module.exports = runBenchmark;
