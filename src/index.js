const fs = require('fs');

const { runParser } = require('./operations/parser/index');
const { runTransformer } = require('./operations/transformer/index');
const { runRender } = require('./operations/compiler/render');
const { getFilesInfo } = require('./operations/file/index');

async function runVueMigrationTool() {
  console.log('\tVue Migration Tool(2.x -> 3.x)')

  const {
    filesPath,
    filesPathToSave
  } = await getFilesInfo(__dirname);

  const promises = filesPath.map(
    (filePath, index) => migrateSingleFile(filePath, filesPathToSave[index])
  );

  await Promise.all(promises);
}

async function migrateSingleFile(filePath, filePathToSave) {
  const ast = runParser(filePath);
  const tranformedAst = runTransformer(ast);
  const renderedComponent = await runRender(tranformedAst);

  fs.writeFileSync(filePathToSave, renderedComponent);
}

runVueMigrationTool();