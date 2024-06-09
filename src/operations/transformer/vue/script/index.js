'use strict';

const { MIGRATION } = require('../../constants');
const { showLog } = require('../../../../utils/message');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const existenceChecker = require('../../../../singletons/existenceChecker');
const stateManager = require('../../../../singletons/stateManager');

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

  // Find validations
  traverse(currentAst, {
    ImportDeclaration(path) {
      if (t.isImportDeclaration(path.node)
        && t.isStringLiteral(path.node.source, { value: 'vue' })) {
        existenceChecker.set('importVue', true);
      }

      if (t.isImportDeclaration(path.node)
        && t.isStringLiteral(path.node.source, { value: 'vuex' })) {
        existenceChecker.set('importVuex', true);
      }

      if (t.isImportDeclaration(path.node)
        && t.isStringLiteral(path.node.source, { value: 'vue-router' })) {
        existenceChecker.set('importVueRouter', true);
      }
    },
    NewExpression(path) {
      if (t.isIdentifier(path.node.callee, { name: 'Vue' })) {
        const args = path.node.arguments;
        if (args.length === 1 && t.isObjectExpression(args[0])) {
          const renderProp = args[0].properties.find(
            (prop) => t.isObjectProperty(prop) && prop.key.name === 'render'
          );
          if (!!renderProp) {
            existenceChecker.set('renderProp', true);
          }
        }
      }
    },
    ExpressionStatement(path) {
      const expression = path.node.expression;
      if (t.isCallExpression(expression)
        && t.isNewExpression(expression.callee.object)
        && t.isIdentifier(expression.callee.object.callee, { name: 'Vue' })
      ) {
        existenceChecker.set('newVue', true);
      }
    }
  });

  // Modify, Remove nodes 
  traverse(currentAst, {
    ImportDeclaration(path) {
      if (t.isImportDeclaration(path.node)
        && t.isStringLiteral(path.node.source, { value: 'vue' })
      ) {
        const isThereImportVue = path.node.specifiers.find(spec => spec.local.name === 'Vue');
        if (isThereImportVue) {
          const createApp = t.importSpecifier(
            t.identifier('createApp'), t.identifier('createApp')
          );
          const args = [createApp];
          showLog(MIGRATION.VUE.GLOBAL_API.CREATE_APP);

          const isThereRenderProp = existenceChecker.get('renderProp');
          if (isThereRenderProp) {
            const h = t.importSpecifier(
              t.identifier('h'), t.identifier('h')
            );
            args.push(h);

            showLog(MIGRATION.VUE.GLOBAL_API.H);
          }

          stateManager.set('importVue', t.importDeclaration(args, t.stringLiteral('vue')));
          path.remove();
        }
      }
    },
    VariableDeclaration(path) {
      const declarator = path.node.declarations[0];
      if (t.isNewExpression(declarator.init)
        && t.isIdentifier(declarator.init.callee, { name: 'Vue' })
        && !existenceChecker.get('newVue')
      ) {
        // Remove 'const' keyword
        path.node.kind = '';

        // Replace 'new Vue' with 'createApp'
        declarator.init.callee = t.identifier('createApp');

        // Remove 'el' property
        const elPropertyIndex = declarator.init.arguments[0].properties.findIndex(prop => prop.key.name === 'el');
        declarator.init.arguments[0].properties.splice(elPropertyIndex, 1);

        // Add .mount('#app')
        const mountCallExpression = t.callExpression(
          t.memberExpression(declarator.init, t.identifier('mount')),
          [t.stringLiteral('#app')]
        );
        path.insertAfter(mountCallExpression);

        // Remove original declaration
        path.remove();

        // Add import declaration if not added yet
        const importDeclaration = t.importDeclaration(
          [t.importSpecifier(t.identifier('createApp'), t.identifier('createApp'))], t.stringLiteral('vue')
        );
        ast.program.body.unshift(importDeclaration);

        showLog(MIGRATION.VUE.GLOBAL_API.NEW_VUE);

        // Handle loc property
        if (path.node?.loc) {
          if (!path.node.loc.start || !path.node.loc.start.line) {
            delete path.node.loc;
          }
        }
      }
    },
    CallExpression(path) {
      if (t.isMemberExpression(path.node.callee)
        && t.isIdentifier(path.node.callee.object, { name: 'Vue' })
        && !existenceChecker.get('importVuex')
      ) {
        path.node.callee.object = t.identifier('app');
        showLog(MIGRATION.VUE.GLOBAL_API.CALL_EXPRESSION);

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

      // Vue.config.productionTip
      if (t.isAssignmentExpression(expression)
        && t.isMemberExpression(expression.left)
        && t.isIdentifier(expression.left.object.object, { name: 'Vue' })
        && t.isIdentifier(expression.left.object.property, { name: 'config' })
        && t.isIdentifier(expression.left.property, { name: 'productionTip' })
      ) {
        path.remove();

        showLog(MIGRATION.VUE.GLOBAL_API.CALL_EXPRESSION_REMOVED);
      }

      // new Vue({...})
      if (t.isCallExpression(expression)
        && t.isNewExpression(expression.callee.object)
        && t.isIdentifier(expression.callee.object.callee, { name: 'Vue' })
      ) {
        const args = expression?.callee?.object?.arguments;
        if (args.length === 1 && t.isObjectExpression(args[0])) {
          const properties = args[0]?.properties;
          const renderPropIndex = properties.findIndex(
            (prop) => t.isObjectProperty(prop) && prop.key.name === 'render'
          );
          const renderProp = properties[renderPropIndex];
          const newFunctionForRenderProp = t.arrowFunctionExpression([], renderProp.value.body);

          renderProp.value = newFunctionForRenderProp;
          const otherProps = properties.filter((_, index) => index !== renderPropIndex);

          stateManager.set('appVariableDeclaration', t.variableDeclaration('const', [
            t.variableDeclarator(
              t.identifier('app'),
              t.callExpression(t.identifier('createApp'), [
                t.objectExpression(renderProp ? [renderProp] : []),
              ])
            ),
          ]));
          stateManager.set('newVueOtherProps', otherProps.map((prop) =>
            t.expressionStatement(
              t.callExpression(
                t.memberExpression(t.identifier('app'), t.identifier('use')),
                [prop.value]
              )
            )
          ));
          stateManager.set('newVueMount', t.expressionStatement(
            t.callExpression(
              t.memberExpression(t.identifier('app'), t.identifier('mount')),
              [t.stringLiteral('#app')]
            )
          ));

          path.remove();
        }
      }
    },
  });

  // Insert nodes
  traverse(currentAst, {
    Program(path) {
      const store = stateManager.getState();
      Object.keys(store).forEach(item => {
        if (item === 'appVariableDeclaration' && stateManager.get(item)) {
          const lastImportIndex = path.node.body.reduce((lastIndex, node, index) => {
            if (t.isImportDeclaration(node)) {
              return index;
            }
            return lastIndex;
          }, -1);

          path.node.body.splice(
            lastImportIndex + 1,
            0,
            stateManager.get('appVariableDeclaration'),
          );
        }
        else if (item === 'newVueOtherProps'
          && stateManager.get(item)) {
          path.node.body.push(...stateManager.get(item));
        }
        else if (item === 'importVue'
          && stateManager.get(item)
          && !existenceChecker.get('importVuex')
          && !existenceChecker.get('importVueRouter')) {
          path.node.body.unshift(stateManager.get('importVue'));
        }
        else if (item !== 'importVue' && stateManager.get(item)) {
          path.node.body.push(stateManager.get(item));
        }
      });
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

        showLog(MIGRATION.VUE.DESTROYED_TO_UNMOUNTED);
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

        showLog(MIGRATION.VUE.BEFORE_DESTROY_TO_BEFORE_UNMOUNT);
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
      if (path.node.key.name === 'data' && t.isObjectExpression(path.node.value)) {
        const newDataMethod = t.objectMethod(
          'method',
          t.identifier('data'),
          [],
          t.blockStatement([t.returnStatement(path.node.value)])
        );
        path.replaceWith(newDataMethod);

        showLog(MIGRATION.VUE.DATA_OPTIONS);
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

          showLog(MIGRATION.VUE.FILTERS);
        } else {
          filtersNode.key.name = 'methods';

          showLog(MIGRATION.VUE.FILTERS);
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