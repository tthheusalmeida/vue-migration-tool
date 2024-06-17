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
  let styleContent = '';
  const styleRegex = /(<style[^>]*>)([\s\S]*?)(<\/style>)/i;

  fileContent.replace(styleRegex, (_, startTag, content, endTag) => {
    styleContent = `${startTag}${content}${endTag}`;
  });

  return styleContent;
}

function splitfilePath(filePath, regex) {
  const parts = filePath.split(regex);
  if (parts.length > 1) {
    return parts[2] || parts[1];
  } else {
    return filePath;
  }
}

function insertTagScript(htmlContent) {
  const scriptTag = '\t<script type="module" src="/src/main.js"></script>';
  const bodyCloseTag = '</body>';
  const newHtmlContent = htmlContent.replace(bodyCloseTag, `${scriptTag}\n${bodyCloseTag}`);
  return newHtmlContent;
}

function importToVariableName(importPath) {
  let filename = importPath.split('/').pop().split('.')[0];
  filename = filename.replace(/-/g, ' ');

  let result = filename.split(' ').map((word, index) => {
    if (index === 0) {
      return word;
    } else {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
  }).join('');

  return result;
}

function changeUnescapedInterpolation(texto) {
  return texto.replace(/<%= ([^%]+) %>/g, '%$1%');
}

module.exports = {
  replaceExtensionVueToJson,
  getTagContent,
  getTemplateContent,
  getScriptContent,
  getStyleContent,
  splitfilePath,
  insertTagScript,
  importToVariableName,
  changeUnescapedInterpolation,
}