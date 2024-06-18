'use strict';

const t = require('@babel/types');
const traverse = require('@babel/traverse').default;
const path = require('path');
const { MIGRATION } = require('../../constants');
const { showLog } = require('../../../../utils/message');
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

function componentMustHaveExtensionName(ast) {
  const currentAst = { ...ast };

  const componentsName = [];

  traverse(currentAst, {
    ObjectExpression(path) {
      const properties = path.node.properties;
      properties.forEach(item => {
        if (t.isObjectProperty(item)
          && t.isIdentifier(item.key, { name: 'components' })
        ) {
          const objectProperties = item.value.properties;
          objectProperties.forEach(prop => {
            if (t.isObjectProperty(prop)
              && t.isIdentifier(prop.value)) {
              componentsName.push(prop.value.name);
            }
          });
        }
      });
    }
  });

  traverse(currentAst, {
    ImportDeclaration(path) {
      const { isVueFile } = require('../../../file/index');
      const { extname } = require('path');
      const [varDefinition, _] = path.node?.specifiers;
      if (varDefinition
        && Object.keys(varDefinition).length
        && t.isImportDefaultSpecifier(varDefinition)
        && componentsName.includes(varDefinition.local.name)
      ) {
        const importPath = path.node.source.value;

        if (importPath
          && !extname(importPath)
          && !isVueFile(importPath)) {
          path.replaceWith(
            t.importDeclaration(
              [t.importDefaultSpecifier(t.identifier(varDefinition.local.name))],
              t.stringLiteral(`${importPath}.vue`)
            )
          );

          showLog(MIGRATION.VITE.COMPONENT_IMPORT);
        }
      }
    }
  });

  return currentAst;
}

const VITE_SCRIPT_TRANSFORM_LIST = [
  requireIsNotSupported,
  componentMustHaveExtensionName,
]

module.exports = {
  requireIsNotSupported,
  VITE_SCRIPT_TRANSFORM_LIST,
}