'use strict';

const {
  getTemplateAst,
} = require('./parser/template');

function runParser(fileName = '') {
  console.log(`=> Running parse for ${fileName}.\n`);

  return {
    template: getTemplateAst(fileName),
    script: {},
  };
}

module.exports = {
  runParser,
};