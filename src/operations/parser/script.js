'use strict';

const {
  parse
} = require('@babel/parser');
const {
  getScriptContent,
} = require('../../utils/string');

function getScriptAst(fileContent = '') {
  const script = getScriptContent(fileContent);

  return parse(
    script,
    { sourceType: 'module' },
  );
}

module.exports = {
  getScriptAst,
}