'use strict';

const { MIGRATION } = require('../../constants');
const { showLog } = require('../../../../utils/message');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const stateManager = require('../../../../singletons/stateManager');

// https://vuex.vuejs.org/guide/migrating-to-4-0-from-3-x.html#breaking-changes

function createStore(ast) {
  const currentAst = { ...ast };

  traverse(currentAst, {
    ImportDeclaration(path) {
      if (t.isImportDeclaration(path.node)
        && t.isStringLiteral(path.node.source, { value: 'vuex' })
      ) {
        const isThereImportVuex = path.node.specifiers.find(spec => spec.local.name === 'Vuex');
        if (isThereImportVuex) {
          const createStore = t.importSpecifier(
            t.identifier('createStore'), t.identifier('createStore')
          );
          showLog(MIGRATION.VUEX.CREATE_STORE);

          stateManager.set('importVuex', t.importDeclaration([createStore], t.stringLiteral('vuex')));
          path.remove();
        }
      }
    },
    CallExpression(path) {
      if (t.isMemberExpression(path.node.callee)
        && t.isIdentifier(path.node.callee.object, { name: 'Vue' })
      ) {
        path.node.callee.object = t.identifier('app');

        showLog(MIGRATION.VUEX.REMOVE_VUE_USE);

        path.remove();
      }
    },
    NewExpression(path) {
      if (t.isNewExpression(path.node)
        && t.isMemberExpression(path.node.callee)
        && t.isIdentifier(path.node.callee.object, { name: 'Vuex' })
        && t.isIdentifier(path.node.callee.property, { name: 'Store' })
      ) {
        path.replaceWith(
          t.callExpression(t.identifier('createStore'), path.node.arguments)
        );

        showLog(MIGRATION.VUEX.VUEX_STORE);
      }
    },
  });

  traverse(currentAst, {
    Program(path) {
      const store = stateManager.getState();
      Object.keys(store).forEach(item => {
        if (item === 'importVuex'
          && stateManager.get(item)) {
          path.node.body.unshift(stateManager.get('importVuex'));
        }
      });
    }
  });

  return currentAst;
}

const VUEX_SCRIPT_TRANSFORM_LIST = [
  createStore,
]

module.exports = {
  createStore,
  VUEX_SCRIPT_TRANSFORM_LIST,
}