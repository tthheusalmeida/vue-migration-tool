'use strict';

const { MIGRATION } = require('../../constants');
const { showLog } = require('../../../../utils/message');
const t = require('@babel/types');
const traverse = require('@babel/traverse').default;
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

// Checks for the existence of variables for later use in node modification, editing and deletion rules.
function existenceCheckerForRules(ast) {
  const currentAst = { ...ast };

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
          const isThereRenderProp = args[0].properties.find(
            (prop) => t.isObjectProperty(prop) && prop.key.name === 'render'
          );
          if (!!isThereRenderProp) {
            existenceChecker.set('vuePropRender', true);
          }
        }
      }

      if (t.isIdentifier(path.node.callee, { name: 'VueRouter' })) {
        const args = path.node.arguments;
        if (args.length === 1 && t.isObjectExpression(args[0])) {
          const isThereModeProp = args[0].properties.find(
            (prop) => t.isObjectProperty(prop) && prop.key.name === 'mode'
          );
          if (!!isThereModeProp) {
            const value = args[0].properties.filter(prop => prop.key.name === 'mode')[0].value;
            stateManager.set('routerPropMode', value);
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

  return currentAst;
}

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
      if (t.isImportDeclaration(path.node)
        && t.isStringLiteral(path.node.source, { value: 'vue' })
      ) {
        const isThereImportVue = path.node.specifiers.find(spec => spec.local.name === 'Vue');
        if (isThereImportVue) {
          const createApp = t.importSpecifier(
            t.identifier('createApp'), t.identifier('createApp')
          );
          const args = [createApp];

          const isThereRenderProp = existenceChecker.get('vuePropRender');
          if (isThereRenderProp) {
            const h = t.importSpecifier(
              t.identifier('h'), t.identifier('h')
            );
            args.push(h);
          }

          stateManager.set('importVue', t.importDeclaration(args, t.stringLiteral('vue')));
          path.remove();
        }
      }
    },
    CallExpression(path) {
      if (t.isMemberExpression(path.node.callee)
        && t.isIdentifier(path.node.callee.object, { name: 'Vue' })
        && !existenceChecker.get('importVuex')
        && !existenceChecker.get('importVueRouter')
      ) {
        path.node.callee.object = t.identifier('app');
        showLog(MIGRATION.VUE.GLOBAL_API.CALL_EXPRESSION);
      }

      if (t.isMemberExpression(path.node.callee)
        && t.isIdentifier(path.node.callee.object, { name: 'Vue' })
        && t.isIdentifier(path.node.callee.property, { name: 'use' })
        && (existenceChecker.get('importVuex')
          || existenceChecker.get('importVueRouter'))
      ) {
        path.remove();
        showLog(MIGRATION.VUE.REMOVE_VUE_USE);
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

          showLog(MIGRATION.VUE.GLOBAL_API.CREATE_APP);

          const hasHImport = stateManager.get('importVue').specifiers
            .find(key => key.local.name === 'h' && key.imported.name === 'h');
          if (hasHImport) {
            showLog(MIGRATION.VUE.GLOBAL_API.H);
          }
        }
        else if (item !== 'importVue'
          && item !== 'routerPropMode' // routerPropMode is just to store object, not to render component
          && stateManager.get(item)) {
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

const BEFORE_START_RULES = [
  setDefaultLoc,
  existenceCheckerForRules,
];

const VUE_SCRIPT_TRANSFORM_LIST = [
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
  BEFORE_START_RULES,
  VUE_SCRIPT_TRANSFORM_LIST,
}