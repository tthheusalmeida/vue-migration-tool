'use strict';

const {
  compile
} = require('vue-template-compiler');

function getTemplateAst(fileContent = '') {
  return compile(fileContent);
}

module.exports = {
  getTemplateAst,
}