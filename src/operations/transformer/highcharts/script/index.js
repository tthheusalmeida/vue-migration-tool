'use strict';

const { MIGRATION } = require('../../constants');
const { REGEX } = require('../../../../utils/regex.js');
const { showLog } = require('../../../../utils/message');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');

function changeHighchartImport(ast) {
  const currentAst = { ...ast };

  traverse(currentAst, {
    Program(path) {
      const highchartsImportIndex = path.node.body.findIndex(
        item => t.isImportDeclaration(item)
          && t.isStringLiteral(item.source, { value: 'highcharts-vue' })
      )
      if (highchartsImportIndex >= 0) {
        path.node.body.splice(highchartsImportIndex, 1);

        const importHighcharts = t.importDeclaration(
          [t.importDefaultSpecifier(t.identifier('Highcharts'))],
          t.stringLiteral('highcharts'),
        );
        const importHighchartsExporting = t.importDeclaration(
          [t.importDefaultSpecifier(t.identifier('exportingInit'))],
          t.stringLiteral('highcharts/modules/exporting'),
        );

        path.node.body.unshift(
          importHighcharts,
          importHighchartsExporting,
        );

        const lastImportIndex = path.node.body.reduce((lastIndex, node, index) => {
          if (t.isImportDeclaration(node)) {
            return index;
          }
          return lastIndex;
        }, -1);
        const callExpressionExportingInit = t.callExpression(
          t.identifier('exportingInit'),
          [t.identifier('Highcharts')],
        );

        path.node.body.splice(
          lastImportIndex + 1,
          0,
          callExpressionExportingInit,
        );

      }
    },
    ExportDefaultDeclaration(path) {
      const declaration = path.node.declaration;
      if (t.isObjectExpression(declaration)) {
        const properties = declaration.properties;

        properties.forEach((prop, index) => {
          if (t.isObjectProperty(prop) && prop.key.name === 'components') {
            const components = prop.value;
            if (t.isObjectExpression(components)) {
              const componentProperties = components.properties;
              componentProperties.forEach((item, compPropIndex) => {
                if (t.isObjectProperty(item)
                  && item.key.name.match(REGEX.TRANSFORMER.HIGHCHARTS)
                ) {
                  componentProperties.splice(compPropIndex, 1);

                  showLog(MIGRATION.HIGHCHARTS.COMPONENT_DEFINITION);
                }
              });

              if (componentProperties.length === 0) {
                properties.splice(index, 1);
              }
            }
          }
        });
      }
    }
  });

  return currentAst;
}

const HIGHCHARTS_SCRIPT_TRANSFORM_LIST = [
  changeHighchartImport,
]

module.exports = {
  changeHighchartImport,
  HIGHCHARTS_SCRIPT_TRANSFORM_LIST,
}