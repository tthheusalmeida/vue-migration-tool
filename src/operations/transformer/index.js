const {
  destroyedToUnmouted,
  beforeDestroyToBeforeUnmount,
} = require('./script');

const {
  eventsPrefixChanged,
  keyCodeModifiers,
} = require('./template');


function runTransformer(ast) {
  const templateRules = [
    eventsPrefixChanged,
    keyCodeModifiers,
  ];
  const scriptRules = [
    destroyedToUnmouted,
    beforeDestroyToBeforeUnmount,
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