"use strict";

/* eslint-disable complexity */
var reg = /(>)\s*(<)(\/*)/g;
var wsexp = / *(.*) +\n/g;
var contexp = /(<.+>)(.+\n)/g;

function xmlprettify(xml) {
  xml = xml.replace(reg, "$1\n$2$3").replace(wsexp, "$1\n").replace(contexp, "$1\n$2");
  var formatted = "";
  var lines = xml.split("\n");
  var indent = 0;
  var lastType = "other"; // 4 types of tags - single, closing, opening, other (text, doctype, comment) - 4*4 = 16 transitions

  var transitions = {
    "single->single": 0,
    "single->closing": -1,
    "single->opening": 0,
    "single->other": 0,
    "closing->single": 0,
    "closing->closing": -1,
    "closing->opening": 0,
    "closing->other": 0,
    "opening->single": 1,
    "opening->closing": 0,
    "opening->opening": 1,
    "opening->other": 1,
    "other->single": 0,
    "other->closing": -1,
    "other->opening": 0,
    "other->other": 0
  };

  for (var i = 0; i < lines.length; i++) {
    var ln = lines[i];
    var single = Boolean(ln.match(/<.+\/>/)); // is this line a single tag? ex. <br />

    var closing = Boolean(ln.match(/<\/.+>/)); // is this a closing tag? ex. </a>

    var opening = Boolean(ln.match(/<[^!].*>/)); // is this even a tag (that's not <!something>)

    var type = single ? "single" : closing ? "closing" : opening ? "opening" : "other";
    var fromTo = lastType + "->" + type;

    if (type === "opening") {
      var aRegex = /<[A-Za-z0-9:]+ (.*)>/;
      var rest = void 0;

      if (aRegex.test(ln)) {
        rest = ln.replace(aRegex, "$1");
      }

      var attrRegex = / *([a-zA-Z0-9:]+)="([^"]+)"/g;
      var match = attrRegex.exec(rest);
      var attributes = [];

      while (match != null) {
        // matched text: match[0]
        // match start: match.index
        // capturing group n: match[n]
        attributes.push({
          key: match[1],
          value: match[2]
        });
        match = attrRegex.exec(rest);
      }

      attributes.sort(function (a1, a2) {
        if (a1.key === a2.key) {
          return 0;
        }

        return a1.key > a2.key ? 1 : -1;
      });
      var stringifiedAttrs = attributes.map(function (attribute) {
        return "".concat(attribute.key, "=\"").concat(attribute.value, "\"");
      }).join(" ");

      if (rest != null) {
        ln = ln.replace(rest, stringifiedAttrs).replace(/ +>/, ">");
      }
    }

    if (type === "single") {
      ln = ln.replace(/ +\/>/, "/>");
    }

    lastType = type;
    var padding = "";
    indent += transitions[fromTo];

    for (var j = 0; j < indent; j++) {
      padding += "\t";
    }

    if (fromTo === "opening->closing") {
      // substr removes line break (\n) from prev loop
      formatted = formatted.substr(0, formatted.length - 1) + ln + "\n";
    } else {
      formatted += padding + ln + "\n";
    }
  }

  return formatted;
}

module.exports = xmlprettify;