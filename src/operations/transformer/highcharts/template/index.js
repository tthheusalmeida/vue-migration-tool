"use strict";

const { REGEX } = require("../../../../utils/regex.js");
const { MIGRATION } = require("../../constants");
const { showLog } = require("../../../../utils/message");
const { traverseTemplate } = require("../../../../utils/traverse");
const breakingChanges = require("../../../../singletons/breakingChanges.js");

function renameHighchartsTag(ast) {
  const currentAst = { ...ast };

  traverseTemplate(currentAst, {
    action: (node) => {
      if (node?.tag?.match(REGEX.TRANSFORMER.HIGHCHARTS)) {
        node.tag = "Highcharts";

        breakingChanges.increaseCount();
        showLog(MIGRATION.HIGHCHARTS.RENAME_HIGHCHARTS_TAG);
      }
    },
  });

  return currentAst;
}

const HIGHCHARTS_TEMPLATE_TRANSFORM_LIST = [renameHighchartsTag];

module.exports = {
  renameHighchartsTag,
  HIGHCHARTS_TEMPLATE_TRANSFORM_LIST,
};
