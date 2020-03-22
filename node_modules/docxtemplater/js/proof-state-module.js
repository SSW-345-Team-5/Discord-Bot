"use strict";

module.exports = {
  on: function on(eventName) {
    if (eventName === "attached") {
      this.attached = false;
    }
  },
  postparse: function postparse(postparsed, _ref) {
    var filePath = _ref.filePath;

    if (filePath !== "word/settings.xml") {
      return null;
    }

    return postparsed.map(function (part) {
      if (part.type === "tag" && part.tag === "w:proofState") {
        return {
          type: "content",
          value: ""
        };
      }

      return part;
    });
  }
};