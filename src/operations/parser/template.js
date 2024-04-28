'use strict';

const fs = require('fs');
const {
  compile
} = require('vue-template-compiler');

function getTemplateAst(fileName = '') {
  const fileContent = fs.readFileSync(fileName, 'utf8');

  return compile(fileContent);
}

module.exports = {
  getTemplateAst,
}