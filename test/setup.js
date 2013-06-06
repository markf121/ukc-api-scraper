var chai = require('chai');
var sinon = require('sinon');
chai.use(require('sinon-chai'));

global.sinon = sinon;
global.expect = chai.expect;
global.injector = require('../lib/injector');

