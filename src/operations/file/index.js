'use strict';

const fs = require('fs');
const path = require('path');
const fsExtra = require('fs-extra');
const recursive = require('recursive-readdir');
const { runParser } = require('../parser/index');
const { runTransformer } = require('../transformer/index');
const { runRender } = require('../compiler/render');
const { MIGRATION } = require('../../utils/message');

async function getFilesPath(directory) {
  let fullPathFiles = [];

  const files = new Promise((resolve, reject) => {
    return fs.readdir(
      directory,
      (err, filenames) => err != null ? reject(err) : resolve(filenames))
  });

  await Promise.all([files]).then(values => {
    const [first, _] = values;
    fullPathFiles = first;
  });

  return fullPathFiles?.map(file => path.join(directory, file));
}

function getNewPathToSave(filesFullPath, currentFolderName, newFolderName) {
  if (!filesFullPath
    || filesFullPath.lenght <= 0
    || !currentFolderName
    || !newFolderName) {
    return [];
  }

  return filesFullPath.map(file => file.replace(currentFolderName, newFolderName));
}

function getProjectFileStructure(directory) {
  return recursive(directory)
    .then(files => {
      const fileStructure = {};

      files.forEach(file => {
        const relativePath = path.relative(directory, file);
        const parts = relativePath.split(path.sep);

        parts.reduce((acc, part, index) => {
          if (index === parts.length - 1) {
            if (!acc._files) {
              acc._files = [];
            }

            acc._files.push(part);
          } else {
            if (!acc[part]) {
              acc[part] = {};
            }
          }

          return acc[part];
        }, fileStructure);
      });

      return fileStructure;
    })
    .catch(err => console.error(err));
}

async function createFoldersForMigration(sourceDirectory) {
  const projectStructure = await getProjectFileStructure(sourceDirectory);

  const isThereProject = !Object.keys(projectStructure);
  if (isThereProject) {
    console.warn(MIGRATION.WARNING.EMPTY_DIRECTORY);
    return false;
  }

  const directories = extractDirectories(sourceDirectory, projectStructure);
  const promises = directories.map(async (folderPath) => {
    try {
      fsExtra.ensureDir(folderPath);
    } catch (err) {
      console.error(`${MIGRATION.ERROR.CREATE_DIRECTORY} ${folderPath}:`, err);
    }
  });

  await Promise.all[promises];
  return true;
}

function extractDirectories(basePath, projectStructure, directories = []) {
  for (const key in projectStructure) {
    if (key === '_files') continue;

    const currentPath = path.join(basePath, key);
    directories.push(currentPath);

    extractDirectories(currentPath, projectStructure[key], directories);
  }
  return directories;
}

async function copyOrMigrateFiles(sourceDirectory, targetDirectory) {
  try {
    await fsExtra.ensureDir(targetDirectory);

    const files = await fsExtra.readdir(sourceDirectory);

    for (const file of files) {
      const sourceFilePath = path.join(sourceDirectory, file);
      const targetFilePath = path.join(targetDirectory, file);
      const fileExtension = path.extname(file);
      // console.log(file, fileExtension);

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
          migrateSingleFile(sourceFilePath, targetFilePath, fileExtension);
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
  const ast = runParser(sourceFilePath);
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
  getFilesPath,
  getNewPathToSave,
  getProjectFileStructure,
  createFoldersForMigration,
  copyOrMigrateFiles,
  migrateSingleFile,
}