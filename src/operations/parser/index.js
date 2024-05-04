'use strict';

const fs = require('fs');
const { parse } = require('@babel/parser');
const { compile } = require('vue-template-compiler');
const { getTemplateContent } = require('../../utils/string');
const { getScriptContent } = require('../../utils/string');
const { getStyleContent } = require('../../utils/string');
const { stringifyCircularStructureToJson } = require('../../utils/object');
// const { replaceExtensionVueToJson } = require('../../utils/string');

function runParser(fileName = '') {
  console.info(`=> Running parse for ${fileName}.`);
  const fileContent = fs.readFileSync(fileName, 'utf8');

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

module.exports = {
  runParser,
  getTemplateAst,
  getScriptAst,
}