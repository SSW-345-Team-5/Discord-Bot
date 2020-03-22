'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chalk = exports.mainStory = undefined;

var _storyboard = require('storyboard');

var _storyboardListenerConsole = require('storyboard-listener-console');

var _storyboardListenerConsole2 = _interopRequireDefault(_storyboardListenerConsole);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Cannot be covered by Flow! The purpose of this file is to isolate
// an optional dependency, only used in development (so that Flow
// doesn't throw errors when processing users' projects)
(0, _storyboard.addListener)(_storyboardListenerConsole2.default);

exports.mainStory = _storyboard.mainStory;
exports.chalk = _storyboard.chalk;