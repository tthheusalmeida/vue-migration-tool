'use strict';
const existenceChecker = require('../../singletons/existenceChecker');
const stateManager = require('../../singletons/stateManager');

const { VUE_TEMPLATE_TRANSFORM_LIST } = require('./vue/template');
const { VUE_SCRIPT_TRANSFORM_LIST } = require('./vue/script');
const { VUEX_SCRIPT_TRANSFORM_LIST } = require('./vuex/script');

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
    ...VUEX_SCRIPT_TRANSFORM_LIST,
  ];

  const template = { ast: applyTransformerRules(ast.template.ast, templateRules) };
  const script = applyTransformerRules(ast.script, scriptRules);

  resetStoredData();

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

function resetStoredData() {
  existenceChecker.reset();
  stateManager.reset();
}

module.exports = {
  runTransformer,
  applyTransformerRules,
}