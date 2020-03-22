'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zipSave = exports.zipSetBase64 = exports.zipSetBinary = exports.zipSetText = exports.zipGetText = exports.zipExists = exports.zipLoad = exports.zipInit = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _jszip = require('jszip');

var _jszip2 = _interopRequireDefault(_jszip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var zipInit = function zipInit() {
  initCache();
};

/* eslint-disable new-cap */

var zipLoad = function zipLoad(inputFile) {
  return _jszip2.default.loadAsync(inputFile);
};
var zipExists = function zipExists(zip, filename) {
  return zip.file(filename) != null;
};
var zipGetText = function zipGetText(zip, filename) {
  return getFile(zip, filename, 'text');
};
var zipSetText = function zipSetText(zip, filename, data) {
  return setFile(zip, filename, data);
};
var zipSetBinary = function zipSetBinary(zip, filename, data) {
  return setFile(zip, filename, data, { binary: true });
};
var zipSetBase64 = function zipSetBase64(zip, filename, data) {
  return setFile(zip, filename, data, { base64: true });
};
var zipSave = function zipSave(zip) {
  return zip.generateAsync({
    type: 'uint8array',
    compression: 'DEFLATE',
    compressionOptions: { level: 1 }
  });
};

// ==========================================
// Cache outputs (so that they can be requested again)
// ==========================================
var cache = {};

var getFile = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(zip, filename, format) {
    var out;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(cache[filename] !== undefined)) {
              _context.next = 2;
              break;
            }

            return _context.abrupt('return', cache[filename]);

          case 2:
            out = void 0;
            _context.prev = 3;
            _context.next = 6;
            return zip.file(filename).async(format);

          case 6:
            out = _context.sent;
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context['catch'](3);

            out = null;

          case 12:
            cache[filename] = out;
            return _context.abrupt('return', out);

          case 14:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[3, 9]]);
  }));

  return function getFile(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var setFile = function setFile(zip, filename, data, options) {
  cache[filename] = data;
  return zip.file(filename, data, options);
};

var initCache = function initCache() {
  cache = {};
};

// ==========================================
// Public API
// ==========================================
exports.zipInit = zipInit;
exports.zipLoad = zipLoad;
exports.zipExists = zipExists;
exports.zipGetText = zipGetText;
exports.zipSetText = zipSetText;
exports.zipSetBinary = zipSetBinary;
exports.zipSetBase64 = zipSetBase64;
exports.zipSave = zipSave;