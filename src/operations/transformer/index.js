const {
  destroyedToUnmouted,
  beforeDestroyToBeforeUnmount,
} = require('./script');

const { eventsPrefixChanged } = require('./template');


function runTransformer(ast) {
  const templateRules = [
    eventsPrefixChanged,
  ];

  let newTemplateAst = { ...ast.template };
  templateRules.forEach(currentFunction => {
    newTemplateAst.ast = currentFunction(newTemplateAst.ast);
  });

  const scriptRules = [
    destroyedToUnmouted,
    beforeDestroyToBeforeUnmount
  ];

  let newScriptAst = { ...ast.script };
  scriptRules.forEach(currentFunction => {
    newScriptAst = currentFunction(newScriptAst);
  });

  return {
    template: newTemplateAst,
    script: newScriptAst,
    styleString: ast.styleString,
  }
}

module.exports = {
  runTransformer,
}