'use strict';

const common = require('../common');
const net = require('net');

net.createConnection({port: common.PORT});
