const fs = require('fs');
const path = require('path');

const { runParser } = require('./operations/parser/index');
const { runTransformer } = require('./operations/transformer/index');
const { runRender } = require('./operations/compiler/render');
const { getFilesInfo } = require('./operations/file/index');

async function runVueMigrationTool() {
  const {
    filesPath,
    filesPathToSave
  } = await getFilesInfo(__dirname);

  const promises = filesPath.map(async (filePath, index) => {
    const ast = runParser(filePath);
    const tranformedAst = runTransformer(ast);

    const newRenderedComponent = await runRender(tranformedAst);

    fs.writeFileSync(filesPathToSave[index], newRenderedComponent);
  });

  await Promise.all(promises);
}

runVueMigrationTool();