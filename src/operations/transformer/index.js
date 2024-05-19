const {
  eventsPrefixChanged,
  keyCodeModifiers,
  templateListenersRemoved,
} = require('./template');

const {
  setDefaultLoc,
  globalApiNewVue,
  destroyedToUnmouted,
  beforeDestroyToBeforeUnmount,
  dataOptions,
  filters,
} = require('./script');

function runTransformer(ast) {
  if (Object.keys(ast.template).length === 0
    && Object.keys(ast.script).length === 0
    && ast.styleString === '') {
    return ast;
  }

  const templateRules = [
    eventsPrefixChanged,
    keyCodeModifiers,
    templateListenersRemoved,
  ];
  const scriptRules = [
    setDefaultLoc,
    globalApiNewVue,
    destroyedToUnmouted,
    beforeDestroyToBeforeUnmount,
    dataOptions,
    filters,
  ];

  const newTemplateAst = transformerInRulesList(ast.template.ast, templateRules);
  const newScriptAst = transformerInRulesList(ast.script, scriptRules);

  const template = { ast: newTemplateAst };
  const script = newScriptAst;
  return {
    template,
    script,
    styleString: ast.styleString,
  }
}

function transformerInRulesList(ast, rulesList) {
  let newAst = { ...ast };

  rulesList.forEach(currentFunction => {
    newAst = currentFunction(newAst);
  });

  return newAst;
}

module.exports = {
  runTransformer,
  transformerInRulesList,
}