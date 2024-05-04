const {
  destroyedToUnmouted,
  beforeDestroyToBeforeUnmount,
} = require('./script');

function runTransformer(ast) {
  const scriptRules = [
    destroyedToUnmouted,
    beforeDestroyToBeforeUnmount
  ];

  let newScriptAst = { ...ast.script };
  scriptRules.forEach(currentFunction => {
    newScriptAst = currentFunction(newScriptAst);
  });

  return {
    template: ast.template,
    script: newScriptAst,
    styleString: ast.styleString,
  }
}

module.exports = {
  runTransformer,
}