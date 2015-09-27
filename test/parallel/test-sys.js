'use strict';
var common = require('../common');
var assert = require('assert');
var util = require('util')

assert.equal('0', util.inspect(0));
assert.equal('1', util.inspect(1));
assert.equal('false', util.inspect(false));
assert.equal("''", util.inspect(''));
assert.equal("'hello'", util.inspect('hello'));
assert.equal('[Function]', util.inspect(function() {}));
assert.equal('undefined', util.inspect(undefined));
assert.equal('null', util.inspect(null));
assert.equal('/foo(bar\\n)?/gi', util.inspect(/foo(bar\n)?/gi));
assert.equal(new Date('2010-02-14T12:48:40+01:00').toString(),
             util.inspect(new Date('Sun, 14 Feb 2010 11:48:40 GMT')));

assert.equal("'\\n\\u0001'", util.inspect('\n\u0001'));

assert.equal('[]', util.inspect([]));
assert.equal('Array {}', util.inspect(Object.create([])));
assert.equal('[ 1, 2 ]', util.inspect([1, 2]));
assert.equal('[ 1, [ 2, 3 ] ]', util.inspect([1, [2, 3]]));

assert.equal('{}', util.inspect({}));
assert.equal('{ a: 1 }', util.inspect({a: 1}));
assert.equal('{ a: [Function] }', util.inspect({a: function() {}}));
assert.equal('{ a: 1, b: 2 }', util.inspect({a: 1, b: 2}));
assert.equal('{ a: {} }', util.inspect({'a': {}}));
assert.equal('{ a: { b: 2 } }', util.inspect({'a': {'b': 2}}));
assert.equal('{ a: { b: { c: [Object] } } }',
             util.inspect({'a': {'b': { 'c': { 'd': 2 }}}}));
assert.equal('{ a: { b: { c: { d: 2 } } } }',
             util.inspect({'a': {'b': { 'c': { 'd': 2 }}}}, false, null));
assert.equal('[ 1, 2, 3, [length]: 3 ]', util.inspect([1, 2, 3], true));
assert.equal('{ a: [Object] }',
             util.inspect({'a': {'b': { 'c': 2}}}, false, 0));
assert.equal('{ a: { b: [Object] } }',
             util.inspect({'a': {'b': { 'c': 2}}}, false, 1));
assert.equal('{ visible: 1 }',
    util.inspect(Object.create({},
    {visible: {value: 1, enumerable: true}, hidden: {value: 2}}))
);

// Due to the hash seed randomization it's not deterministic the order that
// the following ways this hash is displayed.
// See http://codereview.chromium.org/9124004/

var out = util.inspect(Object.create({},
    {visible: {value: 1, enumerable: true}, hidden: {value: 2}}), true);
if (out !== '{ [hidden]: 2, visible: 1 }' &&
    out !== '{ visible: 1, [hidden]: 2 }') {
  assert.ok(false);
}


// Objects without prototype
var out = util.inspect(Object.create(null,
    { name: {value: 'Tim', enumerable: true},
      hidden: {value: 'secret'}}), true);
if (out !== "{ [hidden]: 'secret', name: 'Tim' }" &&
    out !== "{ name: 'Tim', [hidden]: 'secret' }") {
  assert(false);
}


assert.equal('{ name: \'Tim\' }',
    util.inspect(Object.create(null,
                                 {name: {value: 'Tim', enumerable: true},
                                   hidden: {value: 'secret'}}))
);


// Dynamic properties
assert.equal('{ readonly: [Getter] }',
             util.inspect({get readonly() {}}));

assert.equal('{ readwrite: [Getter/Setter] }',
             util.inspect({get readwrite() {}, set readwrite(val) {}}));

assert.equal('{ writeonly: [Setter] }',
             util.inspect({set writeonly(val) {}}));

var value = {};
value['a'] = value;
assert.equal('{ a: [Circular] }', util.inspect(value));

// Array with dynamic properties
value = [1, 2, 3];
value.__defineGetter__('growingLength', function() {
  this.push(true); return this.length;
});
assert.equal('[ 1, 2, 3, growingLength: [Getter] ]', util.inspect(value));

// Function with properties
value = function() {};
value.aprop = 42;
assert.equal('{ [Function] aprop: 42 }', util.inspect(value));

// Regular expressions with properties
value = /123/ig;
value.aprop = 42;
assert.equal('{ /123/gi aprop: 42 }', util.inspect(value));

// Dates with properties
value = new Date('Sun, 14 Feb 2010 11:48:40 GMT');
value.aprop = 42;
assert.equal('{ Sun, 14 Feb 2010 11:48:40 GMT aprop: 42 }',
             util.inspect(value)
);
