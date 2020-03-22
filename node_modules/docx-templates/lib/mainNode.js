'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _timm = require('timm');

var _mainBrowser = require('./mainBrowser');

var _mainBrowser2 = _interopRequireDefault(_mainBrowser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-param-reassign, no-console */

var DEBUG = process.env.DEBUG_DOCX_TEMPLATES;
var log = DEBUG ? require('./debug').mainStory : null;

var BUFFER_VALUE = 'buffer';
// ==========================================
// Main
// ==========================================
var getDefaultOutput = function getDefaultOutput(templatePath) {
  var _path$parse = _path2.default.parse(templatePath),
      dir = _path$parse.dir,
      name = _path$parse.name,
      ext = _path$parse.ext;

  return _path2.default.join(dir, name + '_report' + ext);
};

var createReport = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(options) {
    var template, _probe, templateIsBuffer, output, buffer, newOptions, report, shouldOutputBuffer;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            template = options.template, _probe = options._probe;
            templateIsBuffer = template instanceof Buffer;
            output = options.output || (templateIsBuffer ? BUFFER_VALUE : getDefaultOutput(template.toString()));

            DEBUG && log.debug('Output file: ' + output);

            // ---------------------------------------------------------
            // Load template from filesystem
            // ---------------------------------------------------------
            DEBUG && log.debug(templateIsBuffer ? 'Reading template from buffer...' : 'Reading template from disk at ' + template.toString() + '...');

            if (!templateIsBuffer) {
              _context.next = 9;
              break;
            }

            _context.t0 = template;
            _context.next = 12;
            break;

          case 9:
            _context.next = 11;
            return _fsExtra2.default.readFile(template);

          case 11:
            _context.t0 = _context.sent;

          case 12:
            buffer = _context.t0;
            newOptions = (0, _timm.set)(options, 'template', buffer);

            // ---------------------------------------------------------
            // Parse and fill template (in-memory)
            // ---------------------------------------------------------

            _context.next = 16;
            return (0, _mainBrowser2.default)(newOptions);

          case 16:
            report = _context.sent;

            if (!(_probe != null)) {
              _context.next = 19;
              break;
            }

            return _context.abrupt('return', report);

          case 19:

            // ---------------------------------------------------------
            // Write the result on filesystem
            // ---------------------------------------------------------
            shouldOutputBuffer = output === BUFFER_VALUE;

            DEBUG && log.debug(shouldOutputBuffer ? 'Returning buffer' : 'Writing report to disk...');

            if (!shouldOutputBuffer) {
              _context.next = 23;
              break;
            }

            return _context.abrupt('return', Buffer.from(report));

          case 23:
            _context.next = 25;
            return _fsExtra2.default.ensureDir(_path2.default.dirname(output));

          case 25:
            _context.next = 27;
            return _fsExtra2.default.writeFile(output, report);

          case 27:
            return _context.abrupt('return', null);

          case 28:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function createReport(_x) {
    return _ref.apply(this, arguments);
  };
}();

// ==========================================
// Public API
// ==========================================
exports.default = createReport;