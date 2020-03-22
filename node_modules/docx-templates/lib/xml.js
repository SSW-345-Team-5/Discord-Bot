'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildXml = exports.parseXml = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _sax = require('sax');

var _sax2 = _interopRequireDefault(_sax);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEBUG = process.env.DEBUG_DOCX_TEMPLATES;

var log = DEBUG ? require('./debug').mainStory : null;

var parseXml = function parseXml(templateXml) {
  var parser = _sax2.default.parser(true, {
    // true for XML-like (false for HTML-like)
    trim: false,
    normalize: false
  });
  var template = void 0;
  var curNode = null;
  var numXmlElements = 0;
  return new _promise2.default(function (resolve, reject) {
    parser.onopentag = function (node) {
      var newNode = {
        _parent: curNode,
        _children: [],
        _fTextNode: false,
        _tag: node.name,
        _attrs: node.attributes
      };
      if (curNode != null) curNode._children.push(newNode);else template = newNode;
      curNode = newNode;
      numXmlElements += 1;
    };
    parser.onclosetag = function () {
      curNode = curNode != null ? curNode._parent : null;
    };
    parser.ontext = function (text) {
      if (curNode == null) return;
      curNode._children.push({
        _parent: curNode,
        _children: [],
        _fTextNode: true,
        _text: text
      });
    };
    parser.onend = function () {
      DEBUG && log.debug('Number of XML elements: ' + numXmlElements);
      resolve(template);
    };
    parser.onerror = function (err) {
      reject(err);
    };
    parser.write(templateXml);
    parser.end();
  });
};

var buildXml = function buildXml(node, options) {
  var indent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

  var xml = indent.length ? '' : '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
  if (node._fTextNode) xml += sanitizeText(node._text, options);else {
    var attrs = '';
    var nodeAttrs = node._attrs;
    (0, _keys2.default)(nodeAttrs).forEach(function (key) {
      attrs += ' ' + key + '="' + sanitizeAttr(nodeAttrs[key]) + '"';
    });
    var fHasChildren = node._children.length > 0;
    var suffix = fHasChildren ? '' : '/';
    xml += '\n' + indent + '<' + node._tag + attrs + suffix + '>';
    var fLastChildIsNode = false;
    node._children.forEach(function (child) {
      xml += buildXml(child, options, indent + '  ');
      fLastChildIsNode = !child._fTextNode;
    });
    if (fHasChildren) {
      var indent2 = fLastChildIsNode ? '\n' + indent : '';
      xml += indent2 + '</' + node._tag + '>';
    }
  }
  return xml;
};

var sanitizeText = function sanitizeText(str, options) {
  var out = '';
  var segments = str.split(options.literalXmlDelimiter);
  var fLiteral = false;
  for (var i = 0; i < segments.length; i++) {
    var processedSegment = segments[i];
    if (!fLiteral) {
      processedSegment = processedSegment.replace(/&/g, '&amp;'); // must be the first one
      processedSegment = processedSegment.replace(/</g, '&lt;');
      processedSegment = processedSegment.replace(/>/g, '&gt;');
    }
    out += processedSegment;
    fLiteral = !fLiteral;
  }
  return out;
};

var sanitizeAttr = function sanitizeAttr(str) {
  var out = str;
  out = out.replace(/&/g, '&amp;'); // must be the first one
  out = out.replace(/</g, '&lt;');
  out = out.replace(/>/g, '&gt;');
  out = out.replace(/'/g, '&apos;');
  out = out.replace(/"/g, '&quot;');
  return out;
};

// ==========================================
// Public API
// ==========================================
exports.parseXml = parseXml;
exports.buildXml = buildXml;