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

function getScriptContent(fileContent, fileExtension) {
  if (fileExtension?.endsWith('.vue')) {
    return getTagContent(
      fileContent,
      '<script>',
      '</script>',
    );
  }

  return fileContent;
}

function getStyleContent(fileContent) {
  const scss = getTagContent(
    fileContent,
    '<style lang="scss">',
    '</style>',
    true,
  );

  const css = getTagContent(
    fileContent,
    '<style lang="css">',
    '</style>',
    true,
  );

  const empty = getTagContent(
    fileContent,
    '<style>',
    '</style>',
    true,
  );

  return scss || css || empty;
}

module.exports = {
  replaceExtensionVueToJson,
  getTagContent,
  getTemplateContent,
  getScriptContent,
  getStyleContent,
}