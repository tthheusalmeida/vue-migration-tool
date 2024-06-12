'use strict';

const fs = require('fs');
const path = require('path');
const fsExtra = require('fs-extra');
const { format } = require('prettier');
const { runProcessUpdatePackage } = require('../../utils/process');
const packageInfo = require('../../singletons/packageInfo');

async function runMigratePackage(sourceDirectory, targetDirectory) {
  const [projectFolder, _] = await fsExtra.readdir(sourceDirectory);

  const packageSourceDirectory = path.join(sourceDirectory, projectFolder);
  const packageTargetDirectory = path.join(targetDirectory, projectFolder);
  const packageSourceFilePath = path.join(packageSourceDirectory, 'package.json');
  const packageTargetFilePath = path.join(packageTargetDirectory, 'package.json');

  const fileContent = fs.readFileSync(packageSourceFilePath, 'utf8');
  let packageObj = JSON.parse(fileContent);

  packageObj = updateEngines(packageObj);
  packageObj = updateType(packageObj);
  packageObj = updateScripts(packageObj);

  packageInfo.set('dependencies', packageObj.dependencies);
  packageInfo.set('devDependencies', packageObj.devDependencies);

  const formattedJson = await format(JSON.stringify(packageObj), {
    parser: 'json',
    trailingComma: 'all',
    tabWidth: 2,
    printWidth: 40,
    semi: true,
    singleQuote: true,
    bracketSpacing: true,
  });

  fs.writeFileSync(packageTargetFilePath, formattedJson, 'utf8');

  runProcessUpdatePackage(packageTargetDirectory);
}

function updateEngines(packageObj) {
  packageObj['engines'] = { node: '20.11.1', npm: '10.2.4' };

  return packageObj;
}

function updateType(packageObj) {
  packageObj['type'] = 'module';

  return packageObj;
}

function updateScripts(packageObj) {
  if (packageObj.scripts) {
    packageObj.scripts['start'] = 'vite';
    packageObj.scripts['serve'] = 'vite';
  }

  return packageObj;
}

module.exports = {
  runMigratePackage,
}