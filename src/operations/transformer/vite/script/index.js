'use strict';

const { MIGRATION } = require('../../constants');
const { showLog } = require('../../../../utils/message');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const { importToVariableName } = require('../../../../utils/string');

function requireIsNotSupported(ast) {
  const currentAst = { ...ast };

  const importFile = [];

  traverse(currentAst, {
    CallExpression(path) {
      if (t.isIdentifier(path.node.callee, { name: 'require' })) {
        const args = path.node.arguments;
        args.forEach((arg) => {
          if (t.isStringLiteral(arg)) {
            const importData = {
              name: importToVariableName(path.node.arguments[0]?.value) || '',
              path: path.node.arguments[0]?.value || '',
            };

            if (importData.name && importData.path) {
              path.replaceWith(t.identifier(importData.name));

              importFile.push(t.importDeclaration(
                [t.importDefaultSpecifier(t.identifier(importData.name))],
                t.stringLiteral(importData.path),
              ));
            }
          }
        })
      }
    },
  });

  traverse(currentAst, {
    Program(path) {
      if (importFile.length) {
        const lastImportIndex = path.node.body.reduce((lastIndex, node, index) => {
          if (t.isImportDeclaration(node)) {
            return index;
          }
          return lastIndex;
        }, -1);

        path.node.body.splice(
          lastImportIndex + 1,
          0,
          ...importFile,
        );

        showLog(MIGRATION.VITE.REQUIRE_IS_NOT_SUPPORTED);
      }
    },
  });

  return currentAst;
}

const VITE_SCRIPT_TRANSFORM_LIST = [
  requireIsNotSupported,
]

module.exports = {
  requireIsNotSupported,
  VITE_SCRIPT_TRANSFORM_LIST,
}