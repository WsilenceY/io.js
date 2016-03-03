'use strict';
const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();

const SlowBuffer = require('buffer').SlowBuffer;

var buff, testFunction;

function setup(noAssert, clazz, type) {
  buff = new clazz(8);
  const fn = 'read' + type;

  buff.writeDoubleLE(0, 0, noAssert);
  testFunction = new Function(
    'buff',
    'buff.' + fn + '(0, ' + JSON.stringify(noAssert) + ');'
  );
}

['false', 'true'].forEach((noAssert) => {
  [Buffer, SlowBuffer].forEach((buffer) => {
    [
      'UInt8', 'UInt16LE', 'UInt16BE', 'UInt32LE', 'UInt32BE', 'Int8',
      'Int16LE', 'Int16BE', 'Int32LE', 'Int32BE', 'FloatLE', 'FloatBE',
      'DoubleLE', 'DoubleBE'
    ].forEach((type) => {
      suite.add(
        `${noAssert}-${buffer.name}-${type}`,
        main,
        {onStart: setup.bind(null, noAssert, buffer, type)}
      );
    });
  });
});

suite.on('cycle', function(event) {
  console.log(String(event.target));
});

suite.run();

function main() {
  testFunction(buff);
}
