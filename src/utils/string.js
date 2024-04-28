'use strict';

function replaceExtensionVueToJson(string) {
  return string.replace(/\.vue$/, ".json");
}

module.exports = {
  replaceExtensionVueToJson,
}