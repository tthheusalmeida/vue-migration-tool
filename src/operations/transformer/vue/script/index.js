'use strict';

const { MIGRATION } = require('../../constants');
const { showLog } = require('../../../../utils/message');
const traverse = require('@babel/traverse').default;
const babelTypes = require('@babel/types');

// Default value for empty loc
// If not treated, it breaks babel, as there is no plugin that accepts empty loc.
function setDefaultLoc(ast) {
  const currentAst = { ...ast };

  traverse(currentAst, {
    enter(path) {
      if (!path.node?.loc) {
        path.node.loc = { start: { line: 0, column: 0 }, end: { line: 0, column: 0 } };
      }
    }
  });

  return currentAst;
};

// Global API

// - [Global API] new Vue now is createApp, an app instance from new concept in Vue 3.

/*TODO https://v3-migration.vuejs.org/breaking-changes/global-api.html#a-new-global-api-createapp
  Add treatment for:
    - Vue.config.ignoredElements
    - Vue.prototype
*/
function globalApiNewVue(ast) {
  const currentAst = { ...ast };

  traverse(currentAst, {
    ImportDeclaration(path) {
      if (path.node.source.value === 'vue') {
        const specifier = path.node.specifiers.find(spec => spec.local.name === 'Vue');
        if (specifier) {
          path.replaceWith(
            babelTypes.importDeclaration(
              [babelTypes.importSpecifier(babelTypes.identifier('createApp'), babelTypes.identifier('createApp'))],
              babelTypes.stringLiteral('vue')
            )
          );

          showLog(MIGRATION.SUCESSFULL.GLOBAL_API.CREATE_APP);

          // Handle loc property
          if (path.node?.loc) {
            if (!path.node.loc.start || !path.node.loc.start.line) {
              delete path.node.loc;
            }
          }
        }
      }
    },
    Program(path) {
      const isThereVueDeclaretion = path.node.body.filter((node) => node?.source?.value === 'vue').length;
      if (!!isThereVueDeclaretion) {
        let lastImportIndex = -1;
        path.node.body.forEach((node, index) => {
          if (babelTypes.isImportDeclaration(node)) {
            lastImportIndex = index;
          }
        });

        if (lastImportIndex !== -1) {
          const newDeclaration = babelTypes.variableDeclaration('const', [
            babelTypes.variableDeclarator(
              babelTypes.identifier('app'),
              babelTypes.callExpression(babelTypes.identifier('createApp'), [babelTypes.identifier('App')])
            )
          ]);

          path.node.body.splice(lastImportIndex + 1, 0, newDeclaration);

          showLog(MIGRATION.SUCESSFULL.GLOBAL_API.APP);

          // Handle loc property
          if (path.node?.loc) {
            if (!path.node.loc.start || !path.node.loc.start.line) {
              delete path.node.loc;
            }
          }
        }
      }
    },
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

        showLog(MIGRATION.SUCESSFULL.GLOBAL_API.NEW_VUE);
      }

      // Handle loc property
      if (path.node?.loc) {
        if (!path.node.loc.start || !path.node.loc.start.line) {
          delete path.node.loc;
        }
      }
    },
    CallExpression(path) {
      if (babelTypes.isMemberExpression(path.node.callee)
        && babelTypes.isIdentifier(path.node.callee.object, { name: 'Vue' })) {
        path.node.callee.object = babelTypes.identifier('app');

        showLog(MIGRATION.SUCESSFULL.GLOBAL_API.CALL_EXPRESSION);

        // Handle loc property
        if (path.node?.loc) {
          if (!path.node.loc.start || !path.node.loc.start.line) {
            delete path.node.loc;
          }
        }
      }
    },
    ExpressionStatement(path) {
      const expression = path.node.expression;

      if (babelTypes.isAssignmentExpression(expression)
        && babelTypes.isMemberExpression(expression.left)
        && babelTypes.isIdentifier(expression.left.object.object, { name: 'Vue' })
        && babelTypes.isIdentifier(expression.left.object.property, { name: 'config' })
        && babelTypes.isIdentifier(expression.left.property, { name: 'productionTip' })) {
        path.remove();

        showLog(MIGRATION.SUCESSFULL.GLOBAL_API.CALL_EXPRESSION_REMOVED);
      }
    },
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

        showLog(MIGRATION.SUCESSFULL.DESTROYED_TO_UNMOUNTED);
      }

      // Handle loc property
      if (path.node?.loc) {
        if (!path.node.loc.start || !path.node.loc.start.line) {
          delete path.node.loc;
        }
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

        showLog(MIGRATION.SUCESSFULL.BEFORE_DESTROY_TO_BEFORE_UNMOUNT);
      }

      // Handle loc property
      if (path.node?.loc) {
        if (!path.node.loc.start || !path.node.loc.start.line) {
          delete path.node.loc;
        }
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

        showLog(MIGRATION.SUCESSFULL.DATA_OPTIONS);
      }

      // Handle loc property
      if (path.node?.loc) {
        if (!path.node.loc.start || !path.node.loc.start.line) {
          delete path.node.loc;
        }
      }
    }
  });

  return currentAst;
}

// Removed APIs

// - Filters
function filters(ast) {
  const currentAst = { ...ast };

  traverse(currentAst, {
    ObjectExpression(path) {
      let filtersNode = null;
      let methodsNode = null;

      path.node.properties.forEach((property) => {
        if (property.key?.name === 'filters' && path.parent.type === 'NewExpression') {
          filtersNode = property;
        } else if (property.key?.name === 'methods') {
          methodsNode = property;
        }
      });

      if (filtersNode) {
        if (methodsNode) {
          methodsNode.value.properties.push(...filtersNode.value.properties);
          path.node.properties = path.node.properties.filter(property => property !== filtersNode);

          showLog(MIGRATION.SUCESSFULL.FILTERS);
        } else {
          filtersNode.key.name = 'methods';

          showLog(MIGRATION.SUCESSFULL.FILTERS);
        }
      }

      // Handle loc property
      if (path.node?.loc) {
        if (!path.node.loc.start || !path.node.loc.start.line) {
          delete path.node.loc;
        }
      }
    }
  });

  return currentAst;
}

const VUE_SCRIPT_TRANSFORM_LIST = [
  setDefaultLoc,
  globalApiNewVue,
  destroyedToUnmouted,
  beforeDestroyToBeforeUnmount,
  dataOptions,
  filters,
]

module.exports = {
  setDefaultLoc,
  globalApiNewVue,
  destroyedToUnmouted,
  beforeDestroyToBeforeUnmount,
  dataOptions,
  filters,
  VUE_SCRIPT_TRANSFORM_LIST,
}