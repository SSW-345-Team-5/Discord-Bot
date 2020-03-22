"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var traits = require("../traits");

var _require = require("../doc-utils"),
    isContent = _require.isContent;

var _require2 = require("../errors"),
    throwRawTagShouldBeOnlyTextInParagraph = _require2.throwRawTagShouldBeOnlyTextInParagraph;

var moduleName = "rawxml";

var wrapper = require("../module-wrapper");

function getInner(_ref) {
  var part = _ref.part,
      left = _ref.left,
      right = _ref.right,
      postparsed = _ref.postparsed,
      index = _ref.index;
  var paragraphParts = postparsed.slice(left + 1, right);
  paragraphParts.forEach(function (p, i) {
    if (i === index - left - 1) {
      return;
    }

    if (isContent(p)) {
      throwRawTagShouldBeOnlyTextInParagraph({
        paragraphParts: paragraphParts,
        part: part
      });
    }
  });
  return part;
}

var RawXmlModule = /*#__PURE__*/function () {
  function RawXmlModule() {
    _classCallCheck(this, RawXmlModule);

    this.name = "RawXmlModule";
    this.prefix = "@";
  }

  _createClass(RawXmlModule, [{
    key: "optionsTransformer",
    value: function optionsTransformer(options, docxtemplater) {
      this.fileTypeConfig = docxtemplater.fileTypeConfig;
      return options;
    }
  }, {
    key: "parse",
    value: function parse(placeHolderContent, _ref2) {
      var match = _ref2.match,
          getValue = _ref2.getValue;
      var type = "placeholder";

      if (match(this.prefix, placeHolderContent)) {
        return {
          type: type,
          value: getValue(this.prefix, placeHolderContent),
          module: moduleName
        };
      }

      return null;
    }
  }, {
    key: "postparse",
    value: function postparse(postparsed) {
      return traits.expandToOne(postparsed, {
        moduleName: moduleName,
        getInner: getInner,
        expandTo: this.fileTypeConfig.tagRawXml,
        error: {
          message: "Raw tag not in paragraph",
          id: "raw_tag_outerxml_invalid",
          explanation: function explanation(part) {
            return "The tag \"".concat(part.value, "\" is not inside a paragraph, putting raw tags inside an inline loop is disallowed.");
          }
        }
      });
    }
  }, {
    key: "render",
    value: function render(part, options) {
      if (part.module !== moduleName) {
        return null;
      }

      var value;
      var errors = [];

      try {
        value = options.scopeManager.getValue(part.value, {
          part: part
        });

        if (value == null) {
          value = options.nullGetter(part);
        }
      } catch (e) {
        errors.push(e);
        return {
          errors: errors
        };
      }

      if (!value) {
        return {
          value: ""
        };
      }

      return {
        value: value
      };
    }
  }, {
    key: "resolve",
    value: function resolve(part, options) {
      if (part.type !== "placeholder" || part.module !== moduleName) {
        return null;
      }

      return options.scopeManager.getValueAsync(part.value, {
        part: part
      }).then(function (value) {
        if (value == null) {
          return options.nullGetter(part);
        }

        return value;
      });
    }
  }]);

  return RawXmlModule;
}();

module.exports = function () {
  return wrapper(new RawXmlModule());
};