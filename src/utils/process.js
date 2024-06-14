'use strict';

const { spawn } = require('child_process');
const path = require('path');
const fsExtra = require('fs-extra');
const packageInfo = require('../singletons/packageInfo');
const EventEmitter = require('events');
const {
  NEW_DEPENDENCIES,
  OLD_DEV_DEPENDENCIES,
  NEW_DEV_DEPENDENCIES,
  NEW_DEPENDENCIES_LIST,
  OLD_DEV_DEPENDENCIES_LIST,
  NEW_DEV_DEPENDENCIES_LIST,
} = require('../operations/package/constants');

const eventEmitter = new EventEmitter();

function runProcessMigration(fileDirectory) {
  const processList = [
    gitCloneProject,
  ];

  if (process.env.BRANCH) {
    processList.push(gitFetchAll);
    processList.push(gitCheckoutBranch);
  }

  processAction({}, fileDirectory, processList, 0);
}

function runProcessUpdatePackage(fileDirectory) {
  const processList = [
    npmRegeneratePackageLock,
    npmUninstall,
    npmInstallDependencies,
    npmInstallSaveDev,
    removePackageLock,
    removeSourceProject,
  ];

  processAction({}, fileDirectory, processList, 0);
}

function processAction(processObject = {}, fileDirectory = '', processList = null, currentProcess = undefined) {
  const {
    command = '', // String
    args = [],  // [String]
    processName = 'Undefined', // String
    functionName = '', // String
  } = processObject;

  const isProcessObjectEmpty = !Object.keys(processObject).length;
  if (isProcessObjectEmpty) {
    processList[currentProcess](fileDirectory, processList, currentProcess);
    return;
  };

  const processInstance = spawn(command, args, { cwd: fileDirectory });

  processInstance.on('spawn', () => {
    console.info(`⚪️"${processName}" process start...`);
  })

  processInstance.stdout.on('data', (data) => {
    if (process.env.SHOW_LOG === 'true') {
      console.info(`🔵 ${data}`);
    }
  });

  processInstance.stderr.on('data', (data) => {
    if (process.env.SHOW_LOG === 'true') {
      console.info(`🟡 ${data}`);
    }
  });

  processInstance.on('close', async (code) => {
    if (code !== 0) {
      console.error(`🔴 "${processName}" process error: ${code}`);
    } else {
      console.info(`🟢 "${processName}" process successfully!`);
      eventEmitter.emit(functionName);

      let currentDirectory = fileDirectory;
      if (functionName === 'gitCloneProject') {
        const [projectFolder, _] = await fsExtra.readdir(fileDirectory);
        currentDirectory = path.join(currentDirectory, projectFolder);
      }

      if (!!processList[currentProcess]) {
        processList[currentProcess](currentDirectory, processList, currentProcess);
      }
    }
  });
}

function gitCloneProject(fileDirectory, processList, currentProcess) {
  if (!process.env.REPOSITORY) {
    console.info('=> process.env.REPOSITORY is not defined.')
    process.exit(1);
  }

  const npmObject = {
    command: 'git',
    args: ['clone', process.env.REPOSITORY],
    processName: `git clone ${process.env.REPOSITORY}`,
    functionName: 'gitCloneProject',
  };

  processAction(npmObject, fileDirectory, processList, currentProcess + 1);
}

function gitFetchAll(fileDirectory, processList, currentProcess) {
  const npmObject = {
    command: 'git',
    args: ['fetch', '--all'],
    processName: 'git featch --all',
    functionName: 'gitFetchAll',
  };

  processAction(npmObject, fileDirectory, processList, currentProcess + 1);
}

function gitCheckoutBranch(fileDirectory, processList, currentProcess) {
  const branch = process.env.BRANCH;
  if (!branch) {
    console.info('=> process.env.BRANCH is not defined.')
    process.exit(1);
  }

  const npmObject = {
    command: 'git',
    args: ['checkout', branch],
    processName: `git checkout ${branch}`,
    functionName: 'gitCheckoutBranch',
  };

  processAction(npmObject, fileDirectory, processList, currentProcess + 1);
}

function npmRegeneratePackageLock(fileDirectory, processList, currentProcess) {
  const npmObject = {
    command: 'npm.cmd',
    args: ['install', '--package-lock-only'],
    processName: 'npm install --package-lock-only',
    functionName: 'npmRegeneratePackageLock',
  };

  processAction(npmObject, fileDirectory, processList, currentProcess + 1);
}

function npmUninstall(fileDirectory, processList, currentProcess) {
  const dependencies = [
    'vue-template-compiler',
    'vue-cli-plugin-router',
    'vue-cli-plugin-vuex',
    // vue-cli-plugin,
    '@vue/cli-plugin-router',
    '@vue/cli-plugin-vuex',
    '@vue/cli-plugin-babel',
    '@vue/cli-plugin-eslint',
    '@vue/cli-plugin-pwa',
    '@vue/cli-plugin-unit-jest',
    '@vue/cli-service',
  ];

  const pkgDevDependencies = Object.keys(packageInfo.get('devDependencies'));

  pkgDevDependencies.forEach(dependency => {
    if (OLD_DEV_DEPENDENCIES_LIST.includes(dependency)) {
      dependencies.push(...OLD_DEV_DEPENDENCIES[dependency]);
    }
  });

  const npmObject = {
    command: 'npm.cmd',
    args: ['uninstall', ...dependencies],
    processName: 'npm uninstall',
    functionName: 'npmUninstall',
  };

  processAction(npmObject, fileDirectory, processList, currentProcess + 1);
}

function npmInstallDependencies(fileDirectory, processList, currentProcess) {
  const dependencies = [
    'create-vite-app',
    'vue@3.4.27',
  ];

  const pkgDependencies = Object.keys(packageInfo.get('dependencies'));

  pkgDependencies.forEach(dependency => {
    if (NEW_DEPENDENCIES_LIST.includes(dependency)) {
      dependencies.push(`${dependency}@${NEW_DEPENDENCIES[dependency]} `);
    }
  });

  const npmObject = {
    command: 'npm.cmd',
    args: ['install', ...dependencies],
    processName: 'npm install',
    functionName: 'npmInstallDependencies',
  };

  processAction(npmObject, fileDirectory, processList, currentProcess + 1);
}

function npmInstallSaveDev(fileDirectory, processList, currentProcess) {
  const dependencies = [
    'vite@5.2.13',
    '@vitejs/plugin-vue@5.0.5',
    '@vue/compiler-sfc@3.4.27',
    '@vue/test-utils@2.0.0',
  ];

  const pkgDevDependencies = Object.keys(packageInfo.get('devDependencies'));

  pkgDevDependencies.forEach(dependency => {
    if (NEW_DEV_DEPENDENCIES_LIST.includes(dependency)) {
      dependencies.push(`${dependency}@${NEW_DEV_DEPENDENCIES[dependency]} `);
    }
  });

  const npmObject = {
    command: 'npm.cmd',
    args: ['install', '--save-dev', ...dependencies],
    processName: 'npm install devDependencies',
    functionName: 'npmInstallSaveDev',
  };

  processAction(npmObject, fileDirectory, processList, currentProcess + 1);
}

function npmAuditFix(fileDirectory, processList, currentProcess) {
  const npmObject = {
    command: 'npm.cmd',
    args: ['audit', 'fix'],
    processName: 'npm audit fix',
    functionName: 'npmAuditFix',
  };

  processAction(npmObject, fileDirectory, processList, currentProcess + 1);
}

function removePackageLock(fileDirectory, processList, currentProcess) {
  const npmObject = {
    command: 'powershell.exe',
    args: ['-Command', 'Remove-Item -Recurse -Force -ErrorAction Stop node_modules'],
    processName: 'Remove node_modules',
    functionName: 'removePackageLock',
  };

  processAction(npmObject, fileDirectory, processList, currentProcess + 1);
}

function removeSourceProject(fileDirectory, processList, currentProcess) {
  const splitPath = fileDirectory.split(path.sep);
  const migratedIndex = splitPath.indexOf("migrated");
  splitPath[migratedIndex] = 'code';
  const projectFolder = splitPath.join(path.sep);

  const npmObject = {
    command: 'powershell.exe',
    args: ['-Command', `Remove-Item -Recurse -Force -ErrorAction Stop ${projectFolder}`],
    processName: 'Remove source project folder',
    functionName: 'removePackageLock',
  };

  processAction(npmObject, fileDirectory, processList, currentProcess + 1);

  packageInfo.reset();
}

module.exports = {
  runProcessMigration,
  runProcessUpdatePackage,
  processAction,
  gitCloneProject,
  gitFetchAll,
  gitCheckoutBranch,
  npmRegeneratePackageLock,
  npmUninstall,
  npmInstallDependencies,
  npmInstallSaveDev,
  npmAuditFix,
  removePackageLock,
  removeSourceProject,
  eventEmitter,
}
