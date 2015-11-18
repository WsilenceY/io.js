'use strict';
const common = require('../common');
const assert = require('assert');
const constants = require('constants');

if (!common.hasCrypto) {
  console.log('1..0 # Skipped: missing crypto');
  return;
}
const crypto = require('crypto');

// Test Diffie-Hellman with two parties sharing a secret,
// using various encodings as we go along
var dh1 = crypto.createDiffieHellman(1024);
var p1 = dh1.getPrime('buffer');
var dh2 = crypto.createDiffieHellman(p1, 'buffer');
var key1 = dh1.generateKeys();
var key2 = dh2.generateKeys('hex');
var secret1 = dh1.computeSecret(key2, 'hex', 'base64');
var secret2 = dh2.computeSecret(key1, 'binary', 'buffer');

assert.equal(secret1, secret2.toString('base64'));
assert.equal(dh1.verifyError, 0);
assert.equal(dh2.verifyError, 0);

assert.throws(function() {
  crypto.createDiffieHellman([0x1, 0x2]);
});

assert.throws(function() {
  crypto.createDiffieHellman(function() { });
});

assert.throws(function() {
  crypto.createDiffieHellman(/abc/);
});

assert.throws(function() {
  crypto.createDiffieHellman({});
});

// Create "another dh1" using generated keys from dh1,
// and compute secret again
var dh3 = crypto.createDiffieHellman(p1, 'buffer');
var privkey1 = dh1.getPrivateKey();
dh3.setPublicKey(key1);
dh3.setPrivateKey(privkey1);

assert.deepEqual(dh1.getPrime(), dh3.getPrime());
assert.deepEqual(dh1.getGenerator(), dh3.getGenerator());
assert.deepEqual(dh1.getPublicKey(), dh3.getPublicKey());
assert.deepEqual(dh1.getPrivateKey(), dh3.getPrivateKey());
assert.equal(dh3.verifyError, 0);

var secret3 = dh3.computeSecret(key2, 'hex', 'base64');

assert.equal(secret1, secret3);

// Run this one twice to make sure that the dh3 clears its error properly
(function() {
  var c = crypto.createDecipher('aes-128-ecb', '');
  assert.throws(function() { c.final('utf8'); }, /wrong final block length/);
})();

assert.throws(function() {
  dh3.computeSecret('');
}, /key is too small/i);

(function() {
  var c = crypto.createDecipher('aes-128-ecb', '');
  assert.throws(function() { c.final('utf8'); }, /wrong final block length/);
})();
