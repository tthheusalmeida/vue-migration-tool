'use strict';

const fs = require('fs');
const {
  getTemplateAst,
} = require('./parser/template');
const {
  getScriptAst,
} = require('./parser/script');

function runParser(fileName = '') {
  console.log(`=> Running parse for ${fileName}.\n`);
  const fileContent = fs.readFileSync(fileName, 'utf8');

  return {
    template: getTemplateAst(fileContent),
    // script: getScriptAst(fileContent), TODO remove commented line when working with script
  };
}

module.exports = {
  runParser,
}