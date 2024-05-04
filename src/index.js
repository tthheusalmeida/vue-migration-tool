const fs = require('fs');
const { runParser } = require('./operations/parser/index');
const { stringifyCircularStructureToJson } = require('./utils/object');
const { replaceExtensionVueToJson } = require('./utils/string');
const {
  renderTemplate,
  renderScript,
} = require('./operations/compiler/render');
const {
  destroyedToUnmouted,
} = require('./operations/transforme/index');

async function runVueMigrationTool() {
  const fileName = './src/migration_src/SimpleTemplate.vue';
  const newFileName = './src/migration_src/NewTemplate.vue';

  const rawAst = runParser(fileName);
  const stringAst = stringifyCircularStructureToJson(rawAst);
  const ast = JSON.parse(stringAst);

  // TODO remove save file as json when finish all compiler modules {
  const jsonFileName = replaceExtensionVueToJson(fileName);
  fs.writeFileSync(jsonFileName, stringAst);

  // Run ast transforme
  const modifiedAst = destroyedToUnmouted(ast.script);

  // Render code after tranform the breaking changes
  const vueTemplateRendered = await renderTemplate(ast.template.ast);
  const vueScriptRendered = await renderScript(modifiedAst);

  const compiledVueComponent = `${vueTemplateRendered}\n${vueScriptRendered}\n${rawAst.styleString}\n`;

  fs.writeFileSync(newFileName, compiledVueComponent);
}

runVueMigrationTool();