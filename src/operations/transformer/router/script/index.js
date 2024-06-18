'use strict';

const { MIGRATION } = require('../../constants');
const { showLog } = require('../../../../utils/message');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const stateManager = require('../../../../singletons/stateManager');

const getModeType = (mode) => {
  const MODE_TYPE = {
    history: 'createWebHistory',
    hash: 'createWebHashHistory',
    abstract: 'createMemoryHistory'
  }
  return MODE_TYPE[mode];
}

// https://router.vuejs.org/guide/migration/

function createRouter(ast) {
  const currentAst = { ...ast };

  traverse(currentAst, {
    ImportDeclaration(path) {
      if (t.isImportDeclaration(path.node)
        && t.isStringLiteral(path.node.source, { value: 'vue-router' })
      ) {
        const isThereImportVueRouter = path.node?.specifiers.find(spec =>
          spec.local.name === 'VueRouter'
          || spec.local.name === 'Router'
        );
        if (isThereImportVueRouter) {
          const createRouter = t.importSpecifier(
            t.identifier('createRouter'), t.identifier('createRouter')
          );
          const args = [createRouter];

          const isThereModeProp = !!stateManager.get('routerPropMode')?.value;
          let modeProp = '';
          if (isThereModeProp) {
            modeProp = stateManager.get('routerPropMode').value;
          } else {
            modeProp = 'history';
            stateManager.set('routerPropMode', modeProp);
          }

          const prop = t.importSpecifier(
            t.identifier(getModeType(modeProp)), t.identifier(getModeType(modeProp))
          );
          args.push(prop);

          stateManager.set('importVueRouter', t.importDeclaration(args, t.stringLiteral('vue-router')));
          path.remove();
        }
      }
    },
    NewExpression(path) {
      if (path.node?.callee
        && (t.isIdentifier(path.node.callee, { name: 'VueRouter' })
          || t.isIdentifier(path.node.callee, { name: 'Router' }))
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
                t.identifier(getModeType(identifier)),
                isThereBaseProp ? [baseValue] : []
              ));

          if (isThereBaseProp) {
            args[0].properties.splice(baseIndex, 1);
          }
        } else {
          const args = path.node.arguments;
          const properties = args[0].properties;
          const defaultMode = 'history';
          properties.push(
            t.objectProperty(
              t.identifier(defaultMode),
              t.callExpression(
                t.identifier(getModeType(defaultMode)),
                []
              ))
          );
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