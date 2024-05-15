'use strict';

const fs = require('fs');
const { parse } = require('@babel/parser');
const { compile } = require('vue-template-compiler');
const { getTemplateContent } = require('../../utils/string');
const { getScriptContent } = require('../../utils/string');
const { getStyleContent } = require('../../utils/string');
const { stringifyCircularStructureToJson } = require('../../utils/object');

function runParser(filePath = '') {
  console.info(`\n=> Running parse for "${splitfilePath(filePath)}".`);
  const fileContent = fs.readFileSync(filePath, 'utf8');

  if (!fileContent) {
    return {
      template: {},
      script: {},
      styleString: '',
    }
  }

  const rawAst = {
    template: getTemplateAst(fileContent),
    script: getScriptAst(fileContent),
    styleString: getStyleContent(fileContent),
  };

  const stringAst = stringifyCircularStructureToJson(rawAst);

  // TODO remove save file as json when finish all compiler modules {
  // const jsonFileName = replaceExtensionVueToJson(fileName);
  // fs.writeFileSync(jsonFileName, stringAst);

  return JSON.parse(stringAst);
}

function getTemplateAst(fileContent = '') {
  if (fileContent === '') {
    return {};
  }

  const template = getTemplateContent(fileContent);

  return compile(template);
}

function getScriptAst(fileContent = '') {
  if (fileContent === '') {
    return {};
  }

  const script = getScriptContent(fileContent);

  return parse(
    script,
    { sourceType: 'module' },
  );
}

const splitfilePath = (filePath) => {
  const parts = filePath.split('src\\');
  if (parts.length > 1) {
    return parts[1];
  } else {
    return filePath;
  }
}

module.exports = {
  runParser,
  getTemplateAst,
  getScriptAst,
}