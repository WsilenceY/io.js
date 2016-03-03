'use strict';
const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();

const fs = require('fs');
const path = require('path');

var aliceBuffer, search;

function setup(terms, encoding, type) {
  aliceBuffer = fs.readFileSync(
    path.resolve(__dirname, '../fixtures/alice.html')
  );

  if (encoding === 'ucs2') {
    aliceBuffer = new Buffer(aliceBuffer.toString(), encoding);
  }

  search = terms;
  if (type === 'buffer') {
    search = new Buffer(new Buffer(search).toString(), encoding);
  }
}

[
  '@', 'SQ', '10x', '--l', 'Alice', 'Gryphon', 'Panther', 'Ou est ma chatte?',
  'found it very', 'among mad people', 'neighbouring pool', 'Soo--oop',
  'aaaaaaaaaaaaaaaaa',
  'venture to go near the house till she had brought herself down to',
  '</i> to the Caterpillar'
].forEach((terms) => {
  [
    undefined, 'utf8', 'ucs2', 'binary'
  ].forEach((encoding) => {
    [
      'buffer', 'string'
    ].forEach((type) => {
      suite.add(
        `${terms}-${encoding}-${type}`,
        main.bind(null, encoding),
        {onStart: setup.bind(null, terms, encoding, type)}
      );
    });
  });
});

suite.on('cycle', function(event) {
  console.log(String(event.target));
});

suite.run();

function main(encoding) {
  aliceBuffer.indexOf(search, 0, encoding);
}
