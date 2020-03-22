"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* eslint-disable no-console */
module.exports = /*#__PURE__*/function () {
  function DebuggerModule() {
    _classCallCheck(this, DebuggerModule);
  }

  _createClass(DebuggerModule, [{
    key: "optionsTransformer",
    value: function optionsTransformer(options, docxtemplater) {
      console.log(JSON.stringify({
        options: options
      }));
      console.log(JSON.stringify({
        files: Object.keys(docxtemplater.getZip().files)
      }));
      return options;
    }
  }, {
    key: "parse",
    value: function parse() {
      console.log(JSON.stringify({
        msg: "parse"
      }));
      return null;
    }
  }, {
    key: "postparse",
    value: function postparse(parsed) {
      console.log(JSON.stringify({
        msg: "postparse"
      }));
      return {
        errors: [],
        parsed: parsed
      };
    }
  }, {
    key: "render",
    value: function render() {
      console.log(JSON.stringify({
        msg: "render"
      }));
      return null;
    }
  }, {
    key: "postrender",
    value: function postrender() {
      console.log(JSON.stringify({
        msg: "postrender"
      }));
    }
  }]);

  return DebuggerModule;
}();