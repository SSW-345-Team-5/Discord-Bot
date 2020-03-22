"use strict";

var _require = require("./doc-utils"),
    concatArrays = _require.concatArrays;

var _require2 = require("./errors"),
    throwUnimplementedTagType = _require2.throwUnimplementedTagType;

function moduleRender(part, options) {
  var moduleRendered;

  for (var i = 0, l = options.modules.length; i < l; i++) {
    var _module = options.modules[i];
    moduleRendered = _module.render(part, options);

    if (moduleRendered) {
      return moduleRendered;
    }
  }

  return false;
}

function render(options) {
  var baseNullGetter = options.baseNullGetter;
  var compiled = options.compiled,
      scopeManager = options.scopeManager;

  options.nullGetter = function (part, sm) {
    return baseNullGetter(part, sm || scopeManager);
  };

  if (!options.prefix) {
    options.prefix = "";
  }

  if (options.index) {
    options.prefix = options.prefix + options.index + "-";
  }

  var errors = [];
  var parts = compiled.map(function (part, i) {
    options.index = i;
    var moduleRendered = moduleRender(part, options);

    if (moduleRendered) {
      if (moduleRendered.errors) {
        errors = concatArrays([errors, moduleRendered.errors]);
      }

      return moduleRendered.value;
    }

    if (part.type === "content" || part.type === "tag") {
      return part.value;
    }

    throwUnimplementedTagType(part, i);
  });
  return {
    errors: errors,
    parts: parts
  };
}

module.exports = render;