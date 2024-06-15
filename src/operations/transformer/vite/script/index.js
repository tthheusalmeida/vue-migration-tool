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
    MemberExpression(path) {
      if (t.isMemberExpression(path.node.object)
        && t.isIdentifier(path.node.object.object, { name: 'process' })
        && t.isIdentifier(path.node.object.property, { name: 'env' })
      ) {
        const propertyName = path.node.property.name;
        const isVueEnvVar = propertyName.startsWith('VUE_');
        const newPropertyName = isVueEnvVar
          ? `VITE_${propertyName.slice(4)}`
          : propertyName;

        const newMemberExpression = t.memberExpression(
          t.memberExpression(
            t.memberExpression(t.identifier('import'), t.identifier('meta')),
            t.identifier('env')
          ),
          t.identifier(newPropertyName)
        );

        path.replaceWith(newMemberExpression);

        showLog(MIGRATION.VITE.PROCESS_ENV_NOT_SUPPORTED);
        if (isVueEnvVar) {
          showLog(MIGRATION.VITE.CHANGE_VUE_ENV_VAR);
        }
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