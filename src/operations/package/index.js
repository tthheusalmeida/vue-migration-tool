'use strict';

const fs = require('fs');
const { format } = require('prettier');
const { runProcesses } = require('./process');

async function runMigratePackage(sourceFilePath, targetFilePath, fileDirectory) {
  const fileContent = fs.readFileSync(sourceFilePath, 'utf8');
  let packageObj = JSON.parse(fileContent);

  packageObj = updateEngines(packageObj);
  packageObj = updateType(packageObj);
  packageObj = updateScripts(packageObj);

  const formattedJson = await format(JSON.stringify(packageObj), {
    parser: 'json',
    trailingComma: 'all',
    tabWidth: 2,
    printWidth: 40,
    semi: true,
    singleQuote: true,
    bracketSpacing: true,
  });

  fs.writeFileSync(targetFilePath, formattedJson, 'utf8');

  runProcesses(fileDirectory);
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