'use strict';

const { SUCESSFULL_MESSAGE } = require('../constants');
const { traverseTemplate } = require('./traverse');

// Other Minor Changes | https://v3-migration.vuejs.org/breaking-changes/#other-minor-changes

// - Lifecycle hook: events prefix changed to vnode
// https://v3-migration.vuejs.org/breaking-changes/vnode-lifecycle-events.html#vnode-lifecycle-events
function eventsPrefixChanged(ast) {
  const currentAst = { ...ast };

  traverseTemplate(currentAst, {
    action: (node) => {
      const regexDestroyed = /@hook:destroyed/g;
      const regexBeforeDestroy = /@hook:beforeDestroy/g;
      const regexHook = /@hook/g;

      if (node?.attrsMap) {
        Object.keys(node.attrsMap).forEach(item => {
          if (item.match(regexDestroyed)) {
            node.attrsMap['@vue:unmounted'] = 'unmounted';
            delete node.attrsMap[item];

            console.info(SUCESSFULL_MESSAGE.EVENTS_PREFIX_CHANGED);
          } else if (item.match(regexBeforeDestroy)) {
            node.attrsMap['@vue:beforeUnmount'] = 'beforeUnmount';
            delete node.attrsMap[item];

            console.info(SUCESSFULL_MESSAGE.EVENTS_PREFIX_CHANGED);
          } else if (item.match(regexHook)) {
            const newKey = item.replace(regexHook, '@vue');
            node.attrsMap[newKey] = node.attrsMap[item];
            delete node.attrsMap[item];

            console.info(SUCESSFULL_MESSAGE.EVENTS_PREFIX_CHANGED);
          }
        });
      }
    }
  });

  return currentAst;
}

module.exports = {
  eventsPrefixChanged,
}