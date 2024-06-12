const path = require('path');
const DIRECTORY_PATH_CODE = path.join(__dirname, 'code');
const DIRECTORY_PATH_MIGRATED = path.join(__dirname, 'migrated');

const { runMigrationFile } = require('./operations/file/index');
const { runMigratePackage } = require('./operations/package/index');
const {
  eventEmitter,
  runProcessMigration
} = require('./utils/process');

function runVueMigrationTool() {
  console.log('\tVue Migration Tool(2.x -> 3.x)')

  runProcessMigration(DIRECTORY_PATH_CODE, DIRECTORY_PATH_MIGRATED);

  eventEmitter.on('gitCheckoutBranch', async () => {
    await runMigrationFile(DIRECTORY_PATH_CODE, DIRECTORY_PATH_MIGRATED);
    runMigratePackage(DIRECTORY_PATH_CODE, DIRECTORY_PATH_MIGRATED);
  });
}

runVueMigrationTool();