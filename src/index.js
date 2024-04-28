const fs = require('fs');
const {
  runParser,
} = require('./operations');
const {
  stringifyCircularStructureToJson,
} = require('./utils/object');
const {
  replaceExtensionVueToJson
} = require('./utils/string');

const fileName = './validation/Template.vue';
const ast = runParser(fileName);
const astObject = stringifyCircularStructureToJson(ast);
const fileToSave = replaceExtensionVueToJson(fileName);

fs.writeFileSync(fileToSave, astObject);

