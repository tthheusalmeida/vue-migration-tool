'use strict';

function replaceExtensionVueToJson(string) {
  return string.replace(/\.vue$/, ".json");
}

function getScriptContent(fileContent) {
  const scriptStart = fileContent.indexOf('<script>');
  const scriptEnd = fileContent.indexOf('</script>');
  return fileContent.substring(scriptStart + '<script>'.length, scriptEnd).trim();
}

module.exports = {
  replaceExtensionVueToJson,
  getScriptContent,
}