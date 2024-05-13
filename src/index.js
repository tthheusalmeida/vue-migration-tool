const fs = require('fs');
const { runParser } = require('./operations/parser/index');
const { runTransformer } = require('./operations/transformer/index');
const { runRender } = require('./operations/compiler/render');

async function runVueMigrationTool() {
  const fileName = './src/book_example/yellow_belt.vue';
  const newFileName = './src/book_example/yellow_belt_migrated.vue';

  const ast = runParser(fileName);
  const tranformedAst = runTransformer(ast);

  const newRenderedComponent = await runRender(tranformedAst);

  fs.writeFileSync(newFileName, newRenderedComponent);
}

runVueMigrationTool();