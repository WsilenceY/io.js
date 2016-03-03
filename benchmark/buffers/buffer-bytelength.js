'use strict';
const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();

// 16 chars each
const chars = [
  'hello brendan!!!', // 1 byte
  'ΰαβγδεζηθικλμνξο', // 2 bytes
  '挰挱挲挳挴挵挶挷挸挹挺挻挼挽挾挿', // 3 bytes
  '𠜎𠜱𠝹𠱓𠱸𠲖𠳏𠳕𠴕𠵼𠵿𠸎𠸏𠹷𠺝𠺢' // 4 bytes
];

var strings, results;

function setup(encoding, len) {
  strings = [];
  for (var string of chars) {
    // Strings must be built differently, depending on encoding
    var data = string.repeat(len);
    if (encoding === 'utf8') {
      strings.push(data);
    } else if (encoding === 'base64') {
      // Base64 strings will be much longer than their UTF8 counterparts
      strings.push(new Buffer(data, 'utf8').toString('base64'));
    }
  }

  // Check the result to ensure it is *properly* optimized
  results = strings.map(function(val) {
    return Buffer.byteLength(val, encoding);
  });
}

['utf8', 'base64'].forEach((encoding) => {
  [1, 2, 4, 16, 64, 256].forEach((len) => {
    suite.add(
      `${encoding}-${len}`,
      main.bind(null, encoding),
      {onStart: setup.bind(null, encoding, len)}
    );
  });
});

suite.on('cycle', function(event) {
  console.log(String(event.target));
});

suite.run();

function main(encoding) {
  for (var i = 0; i < chars.length; i++) {
    const r = Buffer.byteLength(strings[i], encoding);

    if (r !== results[i])
      throw new Error('incorrect return value');
  }
}
