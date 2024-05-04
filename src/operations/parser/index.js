'use strict';

const fs = require('fs');
const { parse } = require('@babel/parser');
const { compile } = require('vue-template-compiler');
const { getTemplateContent } = require('../../utils/string');
const { getScriptContent } = require('../../utils/string');
const { getStyleContent } = require('../../utils/string');

function runParser(fileName = '') {
  console.log(`=> Running parse for ${fileName}.\n`);
  const fileContent = fs.readFileSync(fileName, 'utf8');

  return {
    template: getTemplateAst(fileContent),
    script: getScriptAst(fileContent),
    styleString: getStyleContent(fileContent),
  };
}

function getTemplateAst(fileContent = '') {
  const template = getTemplateContent(fileContent);

  return compile(template);
}

function getScriptAst(fileContent = '') {
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