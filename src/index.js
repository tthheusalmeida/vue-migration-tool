const path = require('path');
const DIRECTORY_PATH_CODE = path.join(__dirname, 'code');
const DIRECTORY_PATH_MIGRATED = path.join(__dirname, 'migrated');

const { migration } = require('./operations/file/index');

async function runVueMigrationTool() {
  console.log('\tVue Migration Tool(2.x -> 3.x)')

  await migration(DIRECTORY_PATH_CODE, DIRECTORY_PATH_MIGRATED);
}

runVueMigrationTool();