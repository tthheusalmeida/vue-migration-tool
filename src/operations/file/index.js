'use strict';

const fs = require('fs');
const path = require('path');

async function getFilesInfo(projectDir) {
  const folderName = 'code';
  const folderNameToSave = 'migrated';

  const directory = path.join(projectDir, folderName);
  const filesPath = await getFilesPath(directory);
  const filesPathToSave = getNewPathToSave(filesPath, folderName, folderNameToSave);

  return {
    directory,
    filesPath,
    filesPathToSave,
  }
}

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

module.exports = {
  getFilesInfo,
  getFilesPath,
  getNewPathToSave,
}