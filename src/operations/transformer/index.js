'use strict';

const { VUE_TEMPLATE_TRANSFORM_LIST } = require('./vue/template');
const { VUE_SCRIPT_TRANSFORM_LIST } = require('./vue/script');

function runTransformer(ast) {
  if (Object.keys(ast.template).length === 0
    && Object.keys(ast.script).length === 0
    && ast.styleString === '') {
    return ast;
  }

  const templateRules = [
    ...VUE_TEMPLATE_TRANSFORM_LIST
  ];
  const scriptRules = [
    ...VUE_SCRIPT_TRANSFORM_LIST,
  ];

  const template = { ast: applyTransformerRules(ast.template.ast, templateRules) };
  const script = applyTransformerRules(ast.script, scriptRules);

  return {
    template,
    script,
    styleString: ast.styleString,
  }
}

function applyTransformerRules(ast, rulesList) {
  let newAst = { ...ast };

  rulesList.forEach(currentFunction => {
    newAst = currentFunction(newAst);
  });

  return newAst;
}

module.exports = {
  runTransformer,
  applyTransformerRules,
}