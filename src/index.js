const fs = require('fs');
const {
  runParser,
} = require('./operations/parser/index');
const {
  stringifyCircularStructureToJson,
} = require('./utils/object');
const {
  replaceExtensionVueToJson,
} = require('./utils/string');
const {
  renderTemplate,
} = require('./operations/compiler/render');

function runVueMigrationTool() {
  const fileName = './src/migration_src/Template.vue';
  const newFileName = './src/migration_src/NewTemplate.vue';

  const rawAst = runParser(fileName);
  const stringAst = stringifyCircularStructureToJson(rawAst);
  const ast = JSON.parse(stringAst).template.ast;

  const jsonFileName = replaceExtensionVueToJson(fileName);
  fs.writeFileSync(jsonFileName, stringAst);

  const vueTemplateRender = renderTemplate(ast);
  fs.writeFileSync(newFileName, vueTemplateRender);
}

runVueMigrationTool();