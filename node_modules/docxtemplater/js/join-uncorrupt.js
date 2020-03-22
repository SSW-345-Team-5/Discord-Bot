"use strict";

function joinUncorrupt(parts, contains) {
  // Before doing this "uncorruption" method here, this was done with the `part.emptyValue` trick, however, there were some corruptions that were not handled, for example with a template like this :
  //
  // ------------------------------------------------
  // | {-w:p falsy}My para{/falsy}   |              |
  // | {-w:p falsy}My para{/falsy}   |              |
  // ------------------------------------------------
  var collecting = "";
  var currentlyCollecting = -1;
  return parts.reduce(function (full, part) {
    for (var i = 0, len = contains.length; i < len; i++) {
      var _contains$i = contains[i],
          tag = _contains$i.tag,
          shouldContain = _contains$i.shouldContain,
          value = _contains$i.value;
      var startTagRegex = new RegExp("^(<(".concat(tag, ")[^>]*>)$"), "g");

      if (currentlyCollecting === i) {
        if (part === "</".concat(tag, ">")) {
          currentlyCollecting = -1;
          return full + collecting + value + part;
        }

        collecting += part;

        for (var j = 0, len2 = shouldContain.length; j < len2; j++) {
          var sc = shouldContain[j];

          if (part.indexOf("<".concat(sc, " ")) !== -1 || part.indexOf("<".concat(sc, ">")) !== -1) {
            currentlyCollecting = -1;
            return full + collecting;
          }
        }

        return full;
      }

      if (currentlyCollecting === -1 && startTagRegex.test(part)) {
        currentlyCollecting = i;
        collecting = part;
        return full;
      }
    }

    return full + part;
  }, "");
}

module.exports = joinUncorrupt;