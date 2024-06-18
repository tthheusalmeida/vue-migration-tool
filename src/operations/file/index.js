'use strict';

const fs = require('fs');
const path = require('path');
const fsExtra = require('fs-extra');
const { runParser } = require('../parser/index');
const { runTransformer } = require('../transformer/index');
const { runRender } = require('../compiler/render');
const {
  MIGRATION,
  showLog,
} = require('../../utils/message.js');
const {
  splitfilePath,
  insertTagScript,
  changeUnescapedInterpolation,
} = require('../../utils/string');
const projectInfo = require('../../singletons/projectInfo.js');

async function runMigrationFile(sourceDirectory, targetDirectory) {
  await copyOrMigrateFiles(sourceDirectory, targetDirectory);
  await createFiles(targetDirectory);
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
            await copyFile(sourceFilePath, targetFilePath);
          }
        }
        else if (isIndexHtmlFile(file)) {
          await copyIndexHtmlFile(sourceFilePath, targetFilePath);
        }
        else if (isEnvFile(file)) {
          await copyEnvFile(sourceFilePath, targetFilePath);
        }
        else {
          try {
            if (!isPackageFile(file)) {
              await migrateSingleFile(sourceFilePath, targetFilePath, fileExtension);
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

  let htmlContent = fs.readFileSync(sourceFilePath, 'utf8');

  htmlContent = changeUnescapedInterpolation(htmlContent);
  htmlContent = insertTagScript(htmlContent);

  fs.writeFileSync(newTargetFilePath, htmlContent, 'utf8');
}

async function copyEnvFile(sourceFilePath, targetFilePath) {
  console.info(`=> Running parse for "${path.basename(targetFilePath)}".`);

  let htmlContent = fs.readFileSync(sourceFilePath, 'utf8');

  htmlContent = htmlContent.replace(/VUE_/g, 'VITE_');
  showLog(MIGRATION.VITE.CHANGE_VUE_ENV_VAR);

  fs.writeFileSync(targetFilePath, htmlContent, 'utf8');
}

async function migrateSingleFile(sourceFilePath, targetFilePath, fileExtension) {
  const ast = runParser(sourceFilePath, fileExtension);
  const tranformedAst = runTransformer(ast);
  const renderedComponent = await runRender(tranformedAst, fileExtension);

  fs.writeFileSync(targetFilePath, renderedComponent);
}

function shouldCopyFile(file) {
  return (
    isDocFile(file)
    || isPackageLockFile(file)
    || isTestFile(file)
    ||
    (!isVueFile(file)
      && !isJavascriptFile(file)
      && !isPackageFile(file)
      && !isIndexHtmlFile(file)
      && !isEnvFile(file)
    )
  );
}

function isConfigFile(file) {
  return file.startsWith('.', 0) || file.match('.config.');
}

function isEnvFile(file) {
  return file && file.startsWith('.env', 0);
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

async function createFiles(directory) {
  const projectFolder = projectInfo.get('folderName');
  const projectPath = path.join(directory, projectFolder);

  createViteConfigFile(projectPath);
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
  runMigrationFile,
  copyOrMigrateFiles,
  copyFile,
  copyIndexHtmlFile,
  copyEnvFile,
  migrateSingleFile,
  shouldCopyFile,
  isVueConfigFile,
  isConfigFile,
  isEnvFile,
  isDocFile,
  isPackageLockFile,
  isPackageFile,
  isTestFile,
  isVueFile,
  isJavascriptFile,
  isIndexHtmlFile,
  createFiles,
  createViteConfigFile,
}