'use strict';

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');
const packageInfo = require('../singletons/packageInfo');
const projectInfo = require('../singletons/projectInfo');
const EventEmitter = require('events');

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
    npmRemovePackageLock,
    npmInstall,
    removeNodeModules,
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
    jumpProcess = false, // Boolean
  } = processObject;

  const isProcessObjectEmpty = !Object.keys(processObject).length;
  if (isProcessObjectEmpty) {
    processList[currentProcess](fileDirectory, processList, currentProcess);
    return;
  };

  if (jumpProcess) {
    processList[currentProcess](fileDirectory, processList, currentProcess + 1);
    return;
  }

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
        projectInfo.set('folderName', projectFolder);
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

function npmRemovePackageLock(fileDirectory, processList, currentProcess) {
  const npmObject = {
    command: 'powershell.exe',
    args: ['-Command', 'Remove-Item', '-Force', '-ErrorAction', 'Stop', 'package-lock.json'],
    processName: 'remove package-lock.json',
    functionName: 'npmRemovePackageLock',
  };

  const isTherePackageLockFile = fs.existsSync(path.join(fileDirectory, 'package-lock.json'));
  if (!isTherePackageLockFile) {
    npmObject['jumpProcess'] = true;
  }

  processAction(npmObject, fileDirectory, processList, currentProcess + 1);
}

function npmInstall(fileDirectory, processList, currentProcess) {
  const npmObject = {
    command: 'npm.cmd',
    args: ['install'],
    processName: 'npm install',
    functionName: 'npmInstall',
  };

  processAction(npmObject, fileDirectory, processList, currentProcess + 1);
}

function removeNodeModules(fileDirectory, processList, currentProcess) {
  const npmObject = {
    command: 'powershell.exe',
    args: ['-Command', 'Remove-Item -Recurse -Force -ErrorAction Stop node_modules'],
    processName: 'Remove node_modules',
    functionName: 'removeNodeModules',
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
    functionName: 'removeSourceProject',
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
  npmRemovePackageLock,
  npmInstall,
  removeNodeModules,
  removeSourceProject,
  eventEmitter,
}
