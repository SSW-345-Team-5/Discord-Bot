'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runUserJsAndGetRaw = exports.runUserJsAndGetString = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _vm = require('vm');

var _vm2 = _interopRequireDefault(_vm);

var _timm = require('timm');

var _reportUtils = require('./reportUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEBUG = process.env.DEBUG_DOCX_TEMPLATES;

/* eslint-disable no-param-reassign */

var log = DEBUG ? require('./debug').mainStory : null;

// Runs a user snippet in a sandbox, and returns the result
// as a string. If the `processLineBreaks` flag is set,
// newlines are replaced with a `w:br` tag (protected by
// the `literalXmlDelimiter` separators)
// See more details in runUserJsAndGetRaw() below.
var runUserJsAndGetString = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(data, code, ctx) {
    var result, str, literalXmlDelimiter;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return runUserJsAndGetRaw(data, code, ctx);

          case 2:
            result = _context.sent;

            if (!(result == null)) {
              _context.next = 5;
              break;
            }

            return _context.abrupt('return', '');

          case 5:
            str = String(result);

            if (ctx.options.processLineBreaks) {
              literalXmlDelimiter = ctx.options.literalXmlDelimiter;

              str = str.replace(/\n/g, literalXmlDelimiter + '<w:br/>' + literalXmlDelimiter);
            }
            return _context.abrupt('return', str);

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function runUserJsAndGetString(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

// Runs a user snippet in a sandbox, and returns the result.
// The snippet can return a Promise, which is then awaited.
// The sandbox is kept for the execution of snippets later on
// in the template. Sandboxing can also be disabled via
// ctx.options.noSandbox.
var runUserJsAndGetRaw = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(data, code, ctx) {
    var sandbox, curLoop, context, result, temp, wrapper, script;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // Retrieve the current JS sandbox contents (if any) and add
            // the code to be run, and a placeholder for the result,
            // as well as all data defined by the user
            sandbox = (0, _timm.merge)(ctx.jsSandbox || {}, {
              __code__: code,
              __result__: undefined
            }, data, ctx.options.additionalJsContext);

            // Add currently defined vars, including loop vars and the index
            // of the innermost loop

            curLoop = (0, _reportUtils.getCurLoop)(ctx);

            if (curLoop) sandbox.$idx = curLoop.idx;
            (0, _keys2.default)(ctx.vars).forEach(function (varName) {
              sandbox['$' + varName] = ctx.vars[varName];
            });

            // Run the JS snippet and extract the result
            context = void 0;
            result = void 0;

            if (ctx.options.runJs) {
              temp = ctx.options.runJs({ sandbox: sandbox, ctx: ctx });

              context = temp.modifiedSandbox;
              result = temp.result;
            } else if (ctx.options.noSandbox) {
              context = sandbox;
              wrapper = new Function('with(this) { return eval(__code__); }'); // eslint-disable-line no-new-func

              result = wrapper.call(context);
            } else {
              script = new _vm2.default.Script('\n      __result__ = eval(__code__);\n      ', {});

              context = new _vm2.default.createContext(sandbox); // eslint-disable-line new-cap
              script.runInContext(context);
              // $FlowFixMe: this attribute is set in the inside code, not known by Flow
              result = context.__result__;
            }

            // Wait for promises to resolve

            if (!((typeof result === 'undefined' ? 'undefined' : (0, _typeof3.default)(result)) === 'object' && result && result.then)) {
              _context2.next = 11;
              break;
            }

            _context2.next = 10;
            return result;

          case 10:
            result = _context2.sent;

          case 11:

            // Save the sandbox for later use
            ctx.jsSandbox = (0, _timm.omit)(context, ['__code__', '__result__']);
            DEBUG && log.debug('JS result', { attach: result });
            return _context2.abrupt('return', result);

          case 14:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function runUserJsAndGetRaw(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

// ==========================================
// Public API
// ==========================================
exports.runUserJsAndGetString = runUserJsAndGetString;
exports.runUserJsAndGetRaw = runUserJsAndGetRaw;