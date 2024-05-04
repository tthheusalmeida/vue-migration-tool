const {
  destroyedToUnmouted,
  beforeDestroyToBeforeUnmount,
} = require('./script');

function runTransformer(ast) {
  const scriptRules = [
    destroyedToUnmouted,
    beforeDestroyToBeforeUnmount
  ];

  let transformedAst = { ...ast.script };
  scriptRules.forEach(currentFunction => {
    transformedAst = currentFunction(transformedAst);
  });

  return {
    template: ast.template,
    script: transformedAst,
    styleString: ast.styleString,
  }
}

module.exports = {
  runTransformer,
}