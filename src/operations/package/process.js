'use strict';

const { spawn } = require('child_process');
const { showLog } = require('../../utils/message');
const packageInfo = require('../../singletons/packageInfo');
const {
  NEW_DEPENDENCIES,
  NEW_DEPENDENCIES_LIST
} = require('./constants');

function runProcessUpdatePackage(fileDirectory) {
  const processList = [
    npmRegeneratePackageLock,
    npmUninstall,
    npmInstallDependencies,
    npmInstallSaveDev,
    removePackageLock,
  ];

  process({}, fileDirectory, processList, 0);
}

function process(processObject = {}, fileDirectory = '', processList = null, currentProcess = undefined) {
  const {
    command = '', // String
    args = [],  // [String]
    logStdout = false, // Boolean
    logStderr = false, // Boolean
    processName = 'Undefined', // String
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
    if (logStdout) {
      showLog(`🔵 ${data}`);
    }
  });

  processInstance.stderr.on('data', (data) => {
    if (logStderr) {
      showLog(`🟡 ${data}`);
    }
  });

  processInstance.on('close', (code) => {
    if (code !== 0) {
      console.error(`🔴 "${processName}" process error: ${code}`);
    } else {
      console.info(`🟢 "${processName}" process successfully!`);
      if (!!processList[currentProcess]) {
        processList[currentProcess](fileDirectory, processList, currentProcess);
      }
    }
  });
}

function npmRegeneratePackageLock(fileDirectory, processList, currentProcess) {
  const npmObject = {
    command: 'npm.cmd',
    args: ['install', '--package-lock-only'],
    logStdout: true,
    logStderr: false,
    processName: 'npm install --package-lock-only',
  };

  process(npmObject, fileDirectory, processList, currentProcess + 1);
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
  const npmObject = {
    command: 'npm.cmd',
    args: ['uninstall', ...dependencies],
    logStdout: true,
    logStderr: false,
    processName: 'npm uninstall',
  };

  process(npmObject, fileDirectory, processList, currentProcess + 1);
}

function npmInstallDependencies(fileDirectory, processList, currentProcess) {
  const dependencies = [
    'create-vite-app',
    'vue@3.4.27',
  ];

  const pkgDependencies = Object.keys(packageInfo.get('dependencies'));

  pkgDependencies.forEach(dependencie => {
    if (NEW_DEPENDENCIES_LIST.includes(dependencie)) {
      dependencies.push(`${dependencie}@${NEW_DEPENDENCIES[dependencie]}`);
    }
  });

  const npmObject = {
    command: 'npm.cmd',
    args: ['install', ...dependencies],
    logStdout: true,
    logStderr: false,
    processName: 'npm install',
  };

  process(npmObject, fileDirectory, processList, currentProcess + 1);
}

function npmInstallSaveDev(fileDirectory, processList, currentProcess) {
  const dependencies = [
    'vite@5.2.13',
    '@vitejs/plugin-vue@5.0.5',
    '@vue/compiler-sfc@3.4.27',
    '@vue/test-utils@2.0.0',
  ];

  const npmObject = {
    command: 'npm.cmd',
    args: ['install', '--save-dev', ...dependencies],
    logStdout: true,
    logStderr: false,
    processName: 'npm install devDependencies',
  };

  process(npmObject, fileDirectory, processList, currentProcess + 1);
}

function npmAuditFix(fileDirectory, processList, currentProcess) {
  const npmObject = {
    command: 'npm.cmd',
    args: ['audit', 'fix'],
    logStdout: true,
    logStderr: true,
    processName: 'npm audit fix',
  };

  process(npmObject, fileDirectory, processList, currentProcess + 1);
}

function removePackageLock(fileDirectory, processList, currentProcess) {
  const npmObject = {
    command: 'powershell.exe',
    args: ['-Command', 'Remove-Item -Recurse -Force -ErrorAction Stop node_modules'],
    logStdout: true,
    logStderr: false,
    processName: 'Remove node_modules',
  };

  process(npmObject, fileDirectory, processList, currentProcess + 1);
  packageInfo.reset();
}

module.exports = {
  runProcessUpdatePackage,
  process,
  npmRegeneratePackageLock,
  npmUninstall,
  npmInstallDependencies,
  npmInstallSaveDev,
  npmAuditFix,
  removePackageLock,
}
