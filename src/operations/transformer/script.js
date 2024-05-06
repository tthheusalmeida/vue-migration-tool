'use strict';

const { SUCESSFULL_MESSAGE } = require('./constants');
const traverse = require('@babel/traverse').default;

// Other Minor Changes | https://v3-migration.vuejs.org/breaking-changes/#other-minor-changes

// - The destroyed lifecycle option has been renamed to unmounted
function destroyedToUnmouted(ast) {
  const currentAst = { ...ast };
  traverse(currentAst, {
    enter(path) {
      if (path.isIdentifier({ name: 'destroyed' })) {
        path.node.name = 'unmounted';

        console.info(SUCESSFULL_MESSAGE.DESTROYED_TO_UNMOUNTED);
      }
    }
  });

  return currentAst;
}

// - The beforeDestroy lifecycle option has been renamed to beforeUnmount
function beforeDestroyToBeforeUnmount(ast) {
  const currentAst = { ...ast };
  traverse(currentAst, {
    enter(path) {
      if (path.isIdentifier({ name: 'beforeDestroy' })) {
        path.node.name = 'beforeUnmount';

        console.info(SUCESSFULL_MESSAGE.BEFORE_DESTROY_TO_BEFORE_UNMOUNT);
      }
    }
  });

  return currentAst;
}

module.exports = {
  destroyedToUnmouted,
  beforeDestroyToBeforeUnmount,
}