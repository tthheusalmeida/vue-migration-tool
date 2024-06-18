'use strict';

const fs = require('fs');
const path = require('path');
const fsExtra = require('fs-extra');
const { format } = require('prettier');
const { runProcessUpdatePackage } = require('../../utils/process');
const { removeEmptyObjects } = require('../../utils/object');
const {
  NEW_DEPENDENCIES,
  OLD_DEPENDENCIES,
  OLD_DEPENDENCIES_LIST,
  SWAP_DEPENDENCIES,
} = require('./constants');
const packageInfo = require('../../singletons/packageInfo');
const projectInfo = require('../../singletons/projectInfo');

async function runMigratePackage(sourceDirectory, targetDirectory) {
  const projectFolder = projectInfo.get('folderName');
  const packageSourceDirectory = path.join(sourceDirectory, projectFolder);
  const packageTargetDirectory = path.join(targetDirectory, projectFolder);
  const packageSourceFilePath = path.join(packageSourceDirectory, 'package.json');
  const packageTargetFilePath = path.join(packageTargetDirectory, 'package.json');

  const fileContent = fs.readFileSync(packageSourceFilePath, 'utf8');
  let packageObj = JSON.parse(fileContent);

  removeEmptyObjects(packageObj);

  packageObj = updateEngines(packageObj);
  packageObj = updateType(packageObj);
  packageObj = updateScripts(packageObj);
  packageObj = updateAllDependencies(packageObj);

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

  projectInfo.reset();
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

function updateAllDependencies(packageObj) {
  packageObj = updateDependencies(packageObj);
  packageObj = updateDependencies(packageObj, true);

  return packageObj;
}

function updateDependencies(packageObj, areDevDependencies = false) {
  let packageData = { ...packageObj };
  let packageDependencies = areDevDependencies
    ? 'devDependencies'
    : 'dependencies';

  const packageDependenciesList = Object.keys(packageData[packageDependencies]);

  packageDependenciesList.forEach(dependency => {
    if (OLD_DEPENDENCIES_LIST.includes(dependency)) {
      OLD_DEPENDENCIES[dependency].forEach(item => {
        const newItem = SWAP_DEPENDENCIES[item];
        if (newItem) {
          packageData[packageDependencies][newItem] = NEW_DEPENDENCIES[newItem];
        }
        delete packageData[packageDependencies][item];
      })
    }
  });

  Object.keys(packageData[packageDependencies]).forEach(dependency => {
    if (NEW_DEPENDENCIES[dependency]) {
      packageData[packageDependencies][dependency] = `^${NEW_DEPENDENCIES[dependency]}`;
    }
  });

  if (packageDependencies === 'dependencies') {
    const newDependencies = [
      { 'create-vite': '5.2.3' },
      { 'vue': '3.4.27' },
    ];

    packageData = addDependency(packageData, packageDependencies, newDependencies);
  } else {
    const newDependencies = [
      { 'vite': '5.2.13' },
      { '@vitejs/plugin-vue': '5.0.5' },
      { '@vue/compiler-sfc': '3.4.27' },
      { '@vue/test-utils': '2.0.0' },
    ];

    packageData = addDependency(packageData, packageDependencies, newDependencies);
  }

  return packageData;
}

function addDependency(_packageData, dependency, newDependencies) {
  let packageData = { ..._packageData };

  newDependencies.forEach((currentDependency) => {
    const name = Object.keys(currentDependency)[0];
    packageData[dependency][name] = `^${currentDependency[name]}`;
  });

  return packageData;
}

module.exports = {
  runMigratePackage,
}