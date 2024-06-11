'use strict';

const { spawn } = require('child_process');
const { showLog } = require('../../utils/message');

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
      showLog(`🟡 ${data}`);
    }
  });

  processInstance.stderr.on('data', (data) => {
    if (logStderr) {
      showLog(`🔵 Debbug mode: \n${data}`);
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
  const dependencies = ['vue-template-compiler'];
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
  const dependencies = ['vue@3.4.27', 'vuex@4.1.0', 'vue-router@4.3.3'];
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
