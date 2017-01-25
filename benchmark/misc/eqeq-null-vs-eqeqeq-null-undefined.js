'use strict';

const common = require('../common.js');

const bench = common.createBenchmark(main, {
  n: [10e5],
  type: ['eqeqeq-null-undefined', 'eqeq-null']
});

function main(conf) {
  const n = conf.n | 0;

  // inputs will be a random-ish set of strings. Base 36 is specified so that we
  // get a mix of 0-9 and a-z. We are not testing `undefined` and `null` because
  // that may depend on the ordering of the conditions, and it would seem that
  // typically `undefined` and `null` are exceptions rather than the common
  // case.
  const inputs = [...Array(n)].map(() => Math.random().toString(36));

  let fn;
  if (conf.type === 'eqeq-null')
    fn = (input) => input == null;
  else
    fn = (input) => input === null || input === undefined;

  let i = 0;
  let result;
  bench.start();
  while (i < n || !result) {
    result = fn(inputs[i]);
    i++;
  }
  bench.end(n);
  if (i !== n + 1)
    throw new Error('function should never return true');
}
