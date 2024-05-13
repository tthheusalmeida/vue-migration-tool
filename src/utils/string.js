'use strict';

function replaceExtensionVueToJson(string) {
  return string.replace(/\.vue$/, ".json");
}

function getTagContent(fileContent, startTag = '', endTag = '', includeTag = false) {
  const indexStart = fileContent.indexOf(startTag);
  const indexEnd = fileContent.indexOf(endTag);

  if (indexStart < 0 || indexEnd < 0) {
    return '';
  }

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
  getTagContent,
  getTemplateContent,
  getScriptContent,
  getStyleContent,
}