"use strict";

function postrender(parts, options) {
  for (var i = 0, l = options.modules.length; i < l; i++) {
    var _module = options.modules[i];
    parts = _module.postrender(parts, options);
  }

  var contains = options.fileTypeConfig.tagShouldContain || [];
  return options.joinUncorrupt(parts, contains);
}

module.exports = postrender;