'use strict';

const fs = require('fs');
const path = require('path');
const fsExtra = require('fs-extra');
const { runParser } = require('../parser/index');
const { runTransformer } = require('../transformer/index');
const { runRender } = require('../compiler/render');

async function copyOrMigrateFiles(sourceDirectory, targetDirectory) {
  try {
    await fsExtra.ensureDir(targetDirectory);

    const files = await fsExtra.readdir(sourceDirectory);

    for (const file of files) {
      const sourceFilePath = path.join(sourceDirectory, file);
      const targetFilePath = path.join(targetDirectory, file);
      const fileExtension = path.extname(file);

      const fileStat = await fsExtra.stat(sourceFilePath);
      if (fileStat.isFile()) {
        if (isConfigFile(file)
          || isDocFile(file)
          || isNodeFile(file)
          || isTestFile(file)
        ) {
          await fsExtra.copy(sourceFilePath, targetFilePath);
        }
        else if (fileExtension !== '.vue' && fileExtension !== '.js') {
          await fsExtra.copy(sourceFilePath, targetFilePath);
        }
        else {
          try {
            // if (file === 'main.js') { // TODO remove if
            migrateSingleFile(sourceFilePath, targetFilePath, fileExtension);
            // }
          } catch (e) {
            console.error(e);
          }
        }
      } else if (fileStat.isDirectory()) {
        await copyOrMigrateFiles(sourceFilePath, targetFilePath, fileExtension);
      }
    }
  } catch (err) {
    console.error(`Error copying files: ${err}`);
  }
}

async function migrateSingleFile(sourceFilePath, targetFilePath, fileExtension) {
  const ast = runParser(sourceFilePath, fileExtension);
  const tranformedAst = runTransformer(ast);
  const renderedComponent = await runRender(tranformedAst, fileExtension);

  fs.writeFileSync(targetFilePath, renderedComponent);
}


function isConfigFile(file) {
  if (file.startsWith('.', 0)
    || file.match('.config.')) {
    return true;
  }

  return false;
};

function isDocFile(file) {
  const docFiles = [
    'LICENSE',
    'README.md',
  ]

  if (docFiles.includes(file)) {
    return true;
  }

  return false;
};

function isNodeFile(file) {
  const docFiles = [
    'package-lock.json',
    'package.json'
  ]

  if (docFiles.includes(file)) {
    return true;
  }

  return false;
};

function isTestFile(file) {
  if (file.match('.spec.')
    || file.match('.test.')) {
    return true;
  }
}

module.exports = {
  copyOrMigrateFiles,
  migrateSingleFile,
  isConfigFile,
  isDocFile,
  isNodeFile,
  isTestFile,
}