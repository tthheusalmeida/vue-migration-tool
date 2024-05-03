'use strict';

function replaceExtensionVueToJson(string) {
  return string.replace(/\.vue$/, ".json");
}

function getTagContent(fileContent, startTag, endTag, includeTag = false) {
  const indexStart = fileContent.indexOf(startTag);
  const indexEnd = fileContent.indexOf(endTag);

  if (includeTag) {
    return fileContent.substring(
      indexStart,
      indexEnd + endTag.length,
    ).trim();
  }
  return fileContent.substring(
    indexStart + startTag.length,
    indexEnd,
  ).trim();
}

function getTemplateContent(fileContent) {
  return getTagContent(
    fileContent,
    '<template>',
    '</template>',
    true,
  );
}

function getScriptContent(fileContent) {
  return getTagContent(
    fileContent,
    '<script>',
    '</script>',
  );
}

function getStyleContent(fileContent) {
  return getTagContent(
    fileContent,
    '<style lang="scss">',
    '</style>',
    true,
  );
}

module.exports = {
  replaceExtensionVueToJson,
  getTemplateContent,
  getScriptContent,
  getStyleContent,
}