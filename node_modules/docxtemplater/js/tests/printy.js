"use strict";

function repeat(input, count) {
  if (input == null) {
    throw new TypeError("can't convert " + input + " to object");
  }

  var str = "" + input; // To convert string to integer.

  count = +count;

  if (count < 0) {
    throw new RangeError("repeat count must be non-negative");
  }

  if (count === Infinity) {
    throw new RangeError("repeat count must be less than infinity");
  }

  count = Math.floor(count);

  if (str.length === 0 || count === 0) {
    return "";
  } // Ensuring count is a 31-bit integer allows us to heavily optimize the
  // main part. But anyway, most current (August 2014) browsers can't handle
  // strings 1 << 28 chars or longer, so:


  if (str.length * count >= 1 << 28) {
    throw new RangeError("repeat count must not overflow maximum string size");
  }

  var maxCount = str.length * count;
  count = Math.floor(Math.log(count) / Math.log(2));

  while (count) {
    str += str;
    count--;
  }

  str += str.substring(0, maxCount - str.length);
  return str;
}

module.exports = function printy(parsed) {
  var indent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var indentWasNegative = false;
  var result = parsed.reduce(function (output, p) {
    var splitted = p.value.split(/(?:\n|\r|\t)(?: |\r|\t)*/g);
    var value = splitted.join("");

    if (value === "") {
      return output;
    }

    if (p.type === "tag" && p.position === "end") {
      indent--;
    }

    if (indent < 0) {
      indentWasNegative = true;
    }

    var i = indent < 0 ? "(".concat(indent, ")") : "(".concat(indent, ")") + repeat("   ", indent);

    if (p.subparsed) {
      indent++;
      var stars = i.replace(/./g, "*");
      output += "\n".concat(stars, "START LOOP OF ").concat(value);
      output += printy(p.subparsed, indent);
      output += "\n".concat(stars, "END LOOP OF ").concat(value);
      indent--;
    } else if (p.type === "placeholder") {
      output += "\n".concat(i.replace(/./g, "="), "{").concat(value, "}");
    } else {
      output += "\n".concat(i).concat(value);
    }

    if (p.type === "tag" && p.position === "start") {
      indent++;
    }

    return output;
  }, "").split("\n").map(function (line) {
    return line.replace(/[\s\uFEFF\xA0]+$/g, "");
  }).join("\n");

  if (indentWasNegative) {
    var err = new Error("Indent negative");
    err.properties = {
      result: result
    };
    throw err;
  }

  return result;
};