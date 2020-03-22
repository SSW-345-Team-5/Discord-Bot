"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require("lodash"),
    merge = _require.merge,
    cloneDeep = _require.cloneDeep;

function isPlaceholder(part) {
  return part.type === "placeholder";
}

function _getTags(postParsed) {
  return postParsed.filter(isPlaceholder).reduce(function (tags, part) {
    tags[part.value] = tags[part.value] || {};

    if (part.subparsed) {
      tags[part.value] = merge(tags[part.value], _getTags(part.subparsed));
    }

    return tags;
  }, {});
}

function _getStructuredTags(postParsed) {
  return postParsed.filter(isPlaceholder).map(function (part) {
    if (part.subparsed) {
      part.subparsed = _getStructuredTags(part.subparsed);
    }

    return part;
  }, {});
}

var InspectModule = /*#__PURE__*/function () {
  function InspectModule() {
    _classCallCheck(this, InspectModule);

    this.inspect = {};
    this.fullInspected = {};
    this.filePath = null;
    this.nullValues = [];
  }

  _createClass(InspectModule, [{
    key: "optionsTransformer",
    value: function optionsTransformer(options, docxtemplater) {
      this.fileTypeConfig = docxtemplater.fileTypeConfig;
      this.zip = docxtemplater.zip;
      this.targets = docxtemplater.targets;
      this.templatedFiles = docxtemplater.getTemplatedFiles();
      this.fileType = docxtemplater.fileType;
      return options;
    }
  }, {
    key: "on",
    value: function on(eventName) {
      if (eventName === "attached") {
        this.attached = false;
        this.inspect = {};
        this.fullInspected = {};
        this.filePath = null;
        this.nullValues = [];
      }
    } // eslint-disable-next-line complexity

  }, {
    key: "set",
    value: function set(obj) {
      if (obj.data) {
        this.inspect.tags = obj.data;
      }

      if (obj.inspect) {
        if (obj.inspect.filePath) {
          this.filePath = obj.inspect.filePath;
          this.inspect = this.fullInspected[this.filePath] || {};
        } else if (obj.inspect.content) {
          this.inspect.content = obj.inspect.content;
        } else if (obj.inspect.postparsed) {
          this.inspect.postparsed = cloneDeep(obj.inspect.postparsed);
        } else if (obj.inspect.parsed) {
          this.inspect.parsed = cloneDeep(obj.inspect.parsed);
        } else if (obj.inspect.lexed) {
          this.inspect.lexed = cloneDeep(obj.inspect.lexed);
        } else if (obj.inspect.xmllexed) {
          this.inspect.xmllexed = cloneDeep(obj.inspect.xmllexed);
        } else if (obj.inspect.resolved) {
          this.inspect.resolved = obj.inspect.resolved;
        }

        this.fullInspected[this.filePath] = this.inspect;
      }
    }
  }, {
    key: "nullGetter",
    value: function nullGetter(part, scopeManager, xt) {
      var inspected = this.fullInspected[xt.filePath];
      inspected.nullValues = inspected.nullValues || {
        summary: [],
        detail: []
      };
      inspected.nullValues.detail.push({
        part: part,
        scopeManager: scopeManager
      });
      inspected.nullValues.summary.push(scopeManager.scopePath.concat(part.value));
    }
  }, {
    key: "getTags",
    value: function getTags(file) {
      file = file || this.fileTypeConfig.textPath(this);
      return _getTags(cloneDeep(this.fullInspected[file].postparsed));
    }
  }, {
    key: "getAllTags",
    value: function getAllTags() {
      var _this = this;

      return Object.keys(this.fullInspected).reduce(function (result, file) {
        return merge(result, _this.getTags(file));
      }, {});
    }
  }, {
    key: "getStructuredTags",
    value: function getStructuredTags(file) {
      file = file || this.fileTypeConfig.textPath(this);
      return _getStructuredTags(cloneDeep(this.fullInspected[file].postparsed));
    }
  }, {
    key: "getAllStructuredTags",
    value: function getAllStructuredTags() {
      var _this2 = this;

      return Object.keys(this.fullInspected).reduce(function (result, file) {
        return result.concat(_this2.getStructuredTags(file));
      }, []);
    }
  }, {
    key: "getFileType",
    value: function getFileType() {
      return this.fileType;
    }
  }, {
    key: "getTemplatedFiles",
    value: function getTemplatedFiles() {
      return this.templatedFiles;
    }
  }]);

  return InspectModule;
}();

module.exports = function () {
  return new InspectModule();
};