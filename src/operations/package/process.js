'use strict';

const { spawn } = require('child_process');
const { showLog } = require('../../utils/message');
const packageInfo = require('../../singletons/packageInfo');
const {
  NEW_DEPENDENCIES,
  NEW_DEPENDENCIES_LIST
} = require('./constants');

function runProcesses(fileDirectory) {
  npmRegeneratePackageLock(fileDirectory);
}

function process(npmObject = {}, fileDirectory = '', nextCommand = null) {
  const {
    command = '', // String
    args = [],  // [String]
    logStdout = false, // Boolean
    logStderr = false, // Boolean
    processName = 'Undefined', // String
  } = npmObject;
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
      if (!!nextCommand) {
        nextCommand(fileDirectory);
      }
    }
  });
}

function npmRegeneratePackageLock(fileDirectory) {
  const npmObject = {
    command: 'npm.cmd',
    args: ['install', '--package-lock-only'],
    logStdout: true,
    logStderr: false,
    processName: 'npm install --package-lock-only',
  };

  process(npmObject, fileDirectory, npmUninstall);
}

function npmUninstall(fileDirectory) {
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

  process(npmObject, fileDirectory, npmInstallDependencies);
}

function npmInstallDependencies(fileDirectory) {
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

  process(npmObject, fileDirectory, npmInstallSaveDev);
}

function npmInstallSaveDev(fileDirectory) {
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

  process(npmObject, fileDirectory, removePackageLock);
}

// function npmAuditFix(fileDirectory) {
//   const npmObject = {
//     command: 'npm.cmd',
//     args: ['audit', 'fix'],
//     logStdout: true,
//     logStderr: true,
//     processName: 'npm audit fix',
//   };

//   process(npmObject, fileDirectory, removePackageLock);
// }

function removePackageLock(fileDirectory) {
  const npmObject = {
    command: 'powershell.exe',
    args: ['-Command', 'Remove-Item -Recurse -Force -ErrorAction Stop node_modules'],
    logStdout: true,
    logStderr: false,
    processName: 'Remove node_modules',
  };

  process(npmObject, fileDirectory);
  packageInfo.reset();
}

module.exports = {
  runProcesses,
  process,
  npmRegeneratePackageLock,
  npmUninstall,
  npmInstallDependencies,
  npmInstallSaveDev,
  // npmAuditFix,
  removePackageLock,
}
