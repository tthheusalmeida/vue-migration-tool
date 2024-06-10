'use strict';

const { MIGRATION } = require('../../constants');
const { showLog } = require('../../../../utils/message');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const stateManager = require('../../../../singletons/stateManager');

const MODE_TYPE = {
  history: 'createWebHistory',
  hash: 'createWebHashHistory',
  abstract: 'createMemoryHistory'
}

// https://router.vuejs.org/guide/migration/

function createRouter(ast) {
  const currentAst = { ...ast };

  traverse(currentAst, {
    ImportDeclaration(path) {
      if (t.isImportDeclaration(path.node)
        && t.isStringLiteral(path.node.source, { value: 'vue-router' })
      ) {
        const isThereImportVueRouter = path.node.specifiers.find(spec => spec.local.name === 'VueRouter');
        if (isThereImportVueRouter) {
          const createRouter = t.importSpecifier(
            t.identifier('createRouter'), t.identifier('createRouter')
          );
          const args = [createRouter];

          const modeProp = stateManager.get('routerPropMode').value;
          if (!!modeProp) {
            const prop = t.importSpecifier(
              t.identifier(MODE_TYPE[modeProp]), t.identifier(MODE_TYPE[modeProp])
            );
            args.push(prop);
          }

          stateManager.set('importVueRouter', t.importDeclaration(args, t.stringLiteral('vue-router')));
          path.remove();
        }
      }
    },
    NewExpression(path) {
      if (t.isNewExpression(path.node)
        && t.isIdentifier(path.node.callee, { name: 'VueRouter' })
      ) {
        const args = path.node.arguments;
        const modeIndex = args[0].properties.findIndex(prop => prop.key.name === 'mode');
        if (modeIndex >= 0) {
          const baseIndex = args[0].properties.findIndex(prop => prop.key.name === 'base');
          const isThereBaseProp = baseIndex >= 0;
          const baseValue = isThereBaseProp ? args[0].properties[baseIndex].value : null;
          const identifier = stateManager.get('routerPropMode').value;
          args[0].properties[modeIndex] =
            t.objectProperty(
              t.identifier(identifier),
              t.callExpression(
                t.identifier(MODE_TYPE[identifier]),
                isThereBaseProp ? [baseValue] : []
              ));

          if (isThereBaseProp) {
            args[0].properties.splice(baseIndex, 1);
          }
        }

        path.replaceWith(
          t.callExpression(t.identifier('createRouter'), args)
        );

        showLog(MIGRATION.ROUTER.VUE_ROUTER);
      }
    },
  });

  traverse(currentAst, {
    Program(path) {
      const store = stateManager.getState();
      Object.keys(store).forEach(item => {
        if (item === 'importVueRouter'
          && stateManager.get(item)) {
          path.node.body.unshift(stateManager.get('importVueRouter'));

          showLog(MIGRATION.ROUTER.CREATE_ROUTER);
        }
      });
    }
  });

  return currentAst;
}

const ROUTER_SCRIPT_TRANSFORM_LIST = [
  createRouter,
]

module.exports = {
  createRouter,
  ROUTER_SCRIPT_TRANSFORM_LIST,
}