'use strict';

const fs = require('fs');
const path = require('path');
const fsExtra = require('fs-extra');
const { runParser } = require('../parser/index');
const { runTransformer } = require('../transformer/index');
const { runRender } = require('../compiler/render');
const { runMigratePackage } = require('../package/index');
const {
  splitfilePath,
  insertTagScript,
} = require('../../utils/string');

async function migration(sourceDirectory, targetDirectory) {
  await copyOrMigrateFiles(sourceDirectory, targetDirectory);
  createViteConfigFile(targetDirectory);
}

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
        if (shouldCopyFile(file)) {
          if (!isVueConfigFile(file)) {
            //await copyFile(sourceFilePath, targetFilePath);
          }
        }
        else if (isIndexHtmlFile(file)) {
          //await copyIndexHtmlFile(sourceFilePath, targetFilePath);
        }
        else {
          try {
            if (isPackageFile(file)) {
              runMigratePackage(sourceFilePath, targetFilePath, targetDirectory);
            } else {
              //await migrateSingleFile(sourceFilePath, targetFilePath, fileExtension);
            }
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

async function copyFile(sourceFilePath, targetFilePath) {
  console.info(`=> Running copy  for "${splitfilePath(targetFilePath, 'migrated\\')}".`);

  await fsExtra.copy(sourceFilePath, targetFilePath);
}

async function copyIndexHtmlFile(sourceFilePath, targetFilePath) {
  const file = {
    name: path.basename(targetFilePath),
    directory: path.dirname(targetFilePath),
  }

  console.info(`=> Adding script for "${file.name}".`);

  const newTargetFilePath = path.join(
    file.directory.replace(path.join(path.sep, 'public'), ''),
    file.name
  );

  const htmlContent = fs.readFileSync(sourceFilePath, 'utf8');
  const newHtmlContent = insertTagScript(htmlContent);
  fs.writeFileSync(newTargetFilePath, newHtmlContent, 'utf8');
}

async function migrateSingleFile(sourceFilePath, targetFilePath, fileExtension) {
  const ast = runParser(sourceFilePath, fileExtension);
  const tranformedAst = runTransformer(ast);
  const renderedComponent = await runRender(tranformedAst, fileExtension);

  fs.writeFileSync(targetFilePath, renderedComponent);
}

function shouldCopyFile(file) {
  return (
    isConfigFile(file)
    || isDocFile(file)
    || isPackageLockFile(file)
    || isTestFile(file)
    ||
    (!isVueFile(file)
      && !isJavascriptFile(file)
      && !isPackageFile(file)
      && !isIndexHtmlFile(file)
    )
  );
}

function isConfigFile(file) {
  return file.startsWith('.', 0) || file.match('.config.');
}

function isVueConfigFile(file) {
  return file === 'vue.config.js';
}

function isDocFile(file) {
  const docFiles = [
    'LICENSE',
    'README.md',
  ]

  if (docFiles.includes(file)) {
    return true;
  }

  return false;
}

function isPackageLockFile(file) {
  return file === 'package-lock.json';
}

function isPackageFile(file) {
  return file === 'package.json';
}

function isTestFile(file) {
  return file.match('.spec.') || file.match('.test.');
}

function isVueFile(file) {
  return file.endsWith('.vue');
}

function isJavascriptFile(file) {
  return file.endsWith('.js');
}

function isIndexHtmlFile(file) {
  return file === 'index.html';
}

function createViteConfigFile(directory = '') {
  const file = {
    path: path.join(directory, 'vite.config.js'),
    name: 'vite.config.js',
    content: "import { defineConfig } from 'vite';\n"
      + "import vue from '@vitejs/plugin-vue';\n\n"
      + "// https://vitejs.dev/config/\n"
      + "export default defineConfig({\n"
      + "  plugins: [vue()],\n"
      + "  resolve: {\n"
      + "    alias: {\n"
      + "      '@': '/src',\n"
      + "    },\n"
      + "  },\n"
      + "  define: {\n"
      + "    'process.env': {},\n"
      + "  },\n"
      + "});\n",
  };

  try {
    fs.writeFileSync(file.path, file.content);

    console.info(`=> "${file.name}" created successfully!`);
  } catch (err) {
    console.error(`=> Error trying to create file "${file.name}": `, err);
  }
}

module.exports = {
  migration,
  copyOrMigrateFiles,
  migrateSingleFile,
  isConfigFile,
  isDocFile,
  isPackageLockFile,
  isPackageFile,
  isTestFile,
  isVueFile,
  isJavascriptFile,
  isIndexHtmlFile,
  createViteConfigFile,
}