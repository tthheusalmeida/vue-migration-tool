const SUCESSFULL_MESSAGE = {
  DESTROYED_TO_UNMOUNTED: '- The "destroyed" lifecycle option has been renamed to "unmounted".\n',
}

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

module.exports = {
  destroyedToUnmouted,
}