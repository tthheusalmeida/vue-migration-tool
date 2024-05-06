'use strict';

function traverseTemplate(ast, options) {
  walk(ast, options?.action);
}

function walk(node, action = undefined) {
  if (!node) {
    return;
  }
  if (action) {
    action(node);
  }

  node.children?.forEach(child => {
    walk(child, action);
  });
}

module.exports = {
  traverseTemplate,
  walk,
}