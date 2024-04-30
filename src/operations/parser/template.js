'use strict';

const {
  compile
} = require('vue-template-compiler');
const {
  getTemplateContent,
} = require('../../utils/string');

function getTemplateAst(fileContent = '') {
  const template = getTemplateContent(fileContent);

  return compile(template);
}

module.exports = {
  getTemplateAst,
}