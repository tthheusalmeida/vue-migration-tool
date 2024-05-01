const fs = require('fs');
const {
  runParser,
} = require('./operations');
const {
  stringifyCircularStructureToJson,
} = require('./utils/object');
const {
  replaceExtensionVueToJson,
} = require('./utils/string');
const {
  renderTemplate,
} = require('./operations/compiler/render');

const fileName = './src/migration_src/Template.vue';
const fileNameToSave = './src/migration_src/NewTemplate.vue';
const rawAst = runParser(fileName);
const stringifiedAst = stringifyCircularStructureToJson(rawAst);
const vueTemplateRender = renderTemplate(JSON.parse(stringifiedAst).template.ast);

// const jsonToSave = replaceExtensionVueToJson(fileName);
// fs.writeFileSync(jsonToSave, astObject);

fs.writeFileSync(fileNameToSave, vueTemplateRender);

