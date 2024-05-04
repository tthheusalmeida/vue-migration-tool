const fs = require('fs');
const { runParser } = require('./operations/parser/index');
const { runTransformer } = require('./operations/transformer/index');
const {
  renderTemplate,
  renderScript,
} = require('./operations/compiler/render');

async function runVueMigrationTool() {
  const fileName = './src/migration_src/SimpleTemplate.vue';
  const newFileName = './src/migration_src/NewTemplate.vue';

  const ast = runParser(fileName);
  const tranformedAst = runTransformer(ast);

  // Render code after tranform the breaking changes
  const vueTemplateRendered = await renderTemplate(tranformedAst.template.ast);
  const vueScriptRendered = await renderScript(tranformedAst.script);

  const compiledVueComponent = `${vueTemplateRendered}\n${vueScriptRendered}\n${tranformedAst.styleString}\n`;

  fs.writeFileSync(newFileName, compiledVueComponent);
}

runVueMigrationTool();