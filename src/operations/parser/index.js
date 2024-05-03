'use strict';

const fs = require('fs');
const { getTemplateAst } = require('./template');
const { getScriptAst } = require('./script');
const {
  getScriptContent,
  getStyleContent,
} = require('../../utils/string');

function runParser(fileName = '') {
  console.log(`=> Running parse for ${fileName}.\n`);
  const fileContent = fs.readFileSync(fileName, 'utf8');

  return {
    template: getTemplateAst(fileContent),
    script: getScriptAst(fileContent),
    scriptString: getScriptContent(fileContent),
    styleString: getStyleContent(fileContent),
  };
}

module.exports = {
  runParser,
}