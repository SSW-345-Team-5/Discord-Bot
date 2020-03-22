'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logLoop = exports.isLoopExploring = exports.getCurLoop = exports.addChild = exports.newTextNode = exports.newNonTextNode = exports.insertTextSiblingAfter = exports.getNextSibling = exports.cloneNodeForLogging = exports.cloneNodeWithoutChildren = undefined;

var _timm = require('timm');

var DEBUG = process.env.DEBUG_DOCX_TEMPLATES;

var log = DEBUG ? require('./debug').mainStory : null;
var chalk = DEBUG ? require('./debug').chalk : null;

// ==========================================
// Nodes and trees
// ==========================================
var cloneNodeWithoutChildren = function cloneNodeWithoutChildren(node) {
  if (node._fTextNode) {
    return {
      _parent: null,
      _children: [],
      _fTextNode: true,
      _text: node._text
    };
  }
  return {
    _parent: null,
    _children: [],
    _fTextNode: false,
    _tag: node._tag,
    _attrs: node._attrs
  };
};

var cloneNodeForLogging = function cloneNodeForLogging(node) {
  return (0, _timm.omit)(node, ['_parent', '_children']);
};

var getNextSibling = function getNextSibling(node) {
  var parent = node._parent;
  if (parent == null) return null;
  var siblings = parent._children;
  var idx = siblings.indexOf(node);
  if (idx < 0 || idx >= siblings.length - 1) return null;
  return siblings[idx + 1];
};

var insertTextSiblingAfter = function insertTextSiblingAfter(textNode) {
  var tNode = textNode._parent;
  if (!(tNode && !tNode._fTextNode && tNode._tag === 'w:t')) {
    throw new Error('Template syntax error: text node not within w:t');
  }
  var tNodeParent = tNode._parent;
  if (tNodeParent == null) throw new Error('Template syntax error: w:t node has no parent');
  var idx = tNodeParent._children.indexOf(tNode);
  if (idx < 0) throw new Error('Template syntax error');
  var newTNode = cloneNodeWithoutChildren(tNode);
  newTNode._parent = tNodeParent;
  var newTextNode = {
    _parent: newTNode,
    _children: [],
    _fTextNode: true,
    _text: ''
  };
  newTNode._children = [newTextNode];
  tNodeParent._children.splice(idx + 1, 0, newTNode);
  return newTextNode;
};

var newNonTextNode = function newNonTextNode(tag) {
  var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var children = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  var node = {
    _parent: null,
    _fTextNode: false,
    _tag: tag,
    _attrs: attrs,
    _children: children
  };
  node._children.forEach(function (child) {
    child._parent = node; // eslint-disable-line
  });
  return node;
};

var newTextNode = function newTextNode(text) {
  var node = { _parent: null, _children: [], _fTextNode: true, _text: text };
  return node;
};

var addChild = function addChild(parent, child) {
  parent._children.push(child);
  child._parent = parent; // eslint-disable-line
  return child;
};

// ==========================================
// Loops
// ==========================================
var getCurLoop = function getCurLoop(ctx) {
  if (!ctx.loops.length) return null;
  return ctx.loops[ctx.loops.length - 1];
};

var isLoopExploring = function isLoopExploring(ctx) {
  var curLoop = getCurLoop(ctx);
  return curLoop != null && curLoop.idx < 0;
};

var logLoop = function logLoop(loops) {
  if (!DEBUG) return;
  if (!loops.length) return;
  var level = loops.length - 1;
  var _loops$level = loops[level],
      varName = _loops$level.varName,
      idx = _loops$level.idx,
      loopOver = _loops$level.loopOver,
      isIf = _loops$level.isIf;

  var idxStr = idx >= 0 ? idx + 1 : 'EXPLORATION';
  log.debug((isIf ? 'IF' : 'FOR') + ' loop ' + ('on ' + chalk.magenta.bold(level + ':' + varName) + ': ') + (chalk.magenta.bold(idxStr) + '/' + loopOver.length));
};

// ==========================================
// Public API
// ==========================================
exports.cloneNodeWithoutChildren = cloneNodeWithoutChildren;
exports.cloneNodeForLogging = cloneNodeForLogging;
exports.getNextSibling = getNextSibling;
exports.insertTextSiblingAfter = insertTextSiblingAfter;
exports.newNonTextNode = newNonTextNode;
exports.newTextNode = newTextNode;
exports.addChild = addChild;
exports.getCurLoop = getCurLoop;
exports.isLoopExploring = isLoopExploring;
exports.logLoop = logLoop;