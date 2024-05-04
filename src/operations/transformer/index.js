const transformTemplate = require('./script');
const transformScript = require('./script');

module.exports = {
  ...transformTemplate,
  ...transformScript,
}