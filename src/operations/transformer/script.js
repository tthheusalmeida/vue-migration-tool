'use strict';

const { MIGRATION } = require('./constants');
const traverse = require('@babel/traverse').default;
const babelTypes = require('@babel/types');

// Global API

// - [Global API] new Vue now is createApp, an app instance from new concept in Vue 3.
function globalApiNewVue(ast) {
  const currentAst = { ...ast };

  traverse(currentAst, {
    VariableDeclaration(path) {
      const declarator = path.node.declarations[0];
      if (babelTypes.isNewExpression(declarator.init) && declarator.init.callee.name === 'Vue') {
        // Remove 'const' keyword
        path.node.kind = '';

        // Replace 'new Vue' with 'createApp'
        declarator.init.callee = babelTypes.identifier('createApp');

        // Remove 'el' property
        const elPropertyIndex = declarator.init.arguments[0].properties.findIndex(prop => prop.key.name === 'el');
        declarator.init.arguments[0].properties.splice(elPropertyIndex, 1);

        // Add .mount('#app')
        const mountCallExpression = babelTypes.callExpression(
          babelTypes.memberExpression(declarator.init, babelTypes.identifier('mount')),
          [babelTypes.stringLiteral('#app')]
        );
        path.insertAfter(mountCallExpression);

        // Remove original declaration
        path.remove();

        // Add import declaration if not added yet
        const importDeclaration = babelTypes.importDeclaration(
          [babelTypes.importSpecifier(babelTypes.identifier('createApp'),
            babelTypes.identifier('createApp'))], babelTypes.stringLiteral('vue')
        );
        ast.program.body.unshift(importDeclaration);

        console.info(MIGRATION.SUCESSFULL.NEW_VUE);
      }
    }
  });

  return currentAst;
}

// Other Minor Changes | https://v3-migration.vuejs.org/breaking-changes/#other-minor-changes

// - The destroyed lifecycle option has been renamed to unmounted
function destroyedToUnmouted(ast) {
  const currentAst = { ...ast };
  traverse(currentAst, {
    enter(path) {
      if (path.isIdentifier({ name: 'destroyed' })) {
        path.node.name = 'unmounted';

        console.info(MIGRATION.SUCESSFULL.DESTROYED_TO_UNMOUNTED);
      }
    }
  });

  return currentAst;
}

// - The beforeDestroy lifecycle option has been renamed to beforeUnmount
function beforeDestroyToBeforeUnmount(ast) {
  const currentAst = { ...ast };
  traverse(currentAst, {
    enter(path) {
      if (path.isIdentifier({ name: 'beforeDestroy' })) {
        path.node.name = 'beforeUnmount';

        console.info(MIGRATION.SUCESSFULL.BEFORE_DESTROY_TO_BEFORE_UNMOUNT);
      }
    }
  });

  return currentAst;
}

// - The data option should always be declared as a function
function dataOptions(ast) {
  const currentAst = { ...ast };

  traverse(currentAst, {
    ObjectProperty(path) {
      if (path.node.key.name === 'data' && babelTypes.isObjectExpression(path.node.value)) {
        const newDataMethod = babelTypes.objectMethod(
          'method',
          babelTypes.identifier('data'),
          [],
          babelTypes.blockStatement([babelTypes.returnStatement(path.node.value)])
        );
        path.replaceWith(newDataMethod);

        console.info(MIGRATION.SUCESSFULL.DATA_OPTIONS);
      }
    }
  });

  return currentAst;
}



module.exports = {
  globalApiNewVue,
  destroyedToUnmouted,
  beforeDestroyToBeforeUnmount,
  dataOptions,
}