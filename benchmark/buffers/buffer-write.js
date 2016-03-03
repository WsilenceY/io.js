'use strict';
const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();

const SlowBuffer = require('buffer').SlowBuffer;

const INT8   = 0x7f;
const INT16  = 0x7fff;
const INT32  = 0x7fffffff;
const UINT8  = (INT8 * 2) + 1;
const UINT16 = (INT16 * 2) + 1;
const UINT32 = INT32;

const mod = {
  writeInt8: INT8,
  writeInt16BE: INT16,
  writeInt16LE: INT16,
  writeInt32BE: INT32,
  writeInt32LE: INT32,
  writeUInt8: UINT8,
  writeUInt16BE: UINT16,
  writeUInt16LE: UINT16,
  writeUInt32BE: UINT32,
  writeUInt32LE: UINT32
};

var buff, testFunction;

function setupInt(noAssert, clazz, type) {
  buff = new clazz(8);
  const fn = `write${type}`;
  const m = mod[fn];
  testFunction = new Function('buff', [
    'for (var i = 0; i !== 1e6; i++) {',
    '  buff.' + fn + '(i & ' + m + ', 0, ' + JSON.stringify(noAssert) + ');',
    '}'
  ].join('\n'));
}

function setupFloat(noAssert, clazz, type) {
  buff = new clazz(8);
  const fn = `write${type}`;
  testFunction = new Function('buff', [
    'for (var i = 0; i !== 1e6; i++) {',
    '  buff.' + fn + '(i, 0, ' + JSON.stringify(noAssert) + ');',
    '}'
  ].join('\n'));
}

[false, true].forEach((noAssert) => {
  [Buffer, SlowBuffer].forEach((buffer) => {
    [
      'UInt8', 'UInt16LE', 'UInt16BE', 'UInt32LE', 'UInt32BE', 'Int8',
      'Int16LE', 'Int16BE', 'Int32LE', 'Int32BE'
    ].forEach((type) => {
      suite.add(
        `${noAssert}-${buffer.name}-${type}`,
        benchInt,
        { onStart: setupInt.bind(null, noAssert, buffer, type) }
      );
    });
  });
});


[false, true].forEach((noAssert) => {
  [Buffer, SlowBuffer].forEach((buffer) => {
    ['FloatLE', 'FloatBE', 'DoubleLE', 'DoubleBE'].forEach((type) => {
      suite.add(
        `${noAssert}-${buffer.name}-${type}`,
        benchFloat,
        { onStart: setupFloat.bind(null, noAssert, buffer, type) }
      );
    });
  });
});

suite.on('cycle', function(event) {
  console.log(String(event.target));
});

suite.run();

function benchInt(noAssert) {
  testFunction(buff);
}

function benchFloat(noAssert) {
  testFunction(buff);
}
