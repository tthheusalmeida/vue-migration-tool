'use strict';

const {
  SUCESSFULL_MESSAGE,
  ERROR_MESSAGE,
  KEY_CODE_KEBAB_CASE,
} = require('../constants');
const { REGEX } = require('../regex');
const { traverseTemplate } = require('./traverse');

// Render Function

// $listeners has been removed / merged into $attrs
function templateListenersRemoved(ast) {
  const currentAst = { ...ast };

  traverseTemplate(currentAst, {
    action: (node) => {
      const isThereListeners = node?.attrsMap && node.attrsMap['v-on'] === '$listeners';
      const isThereListenersAndAttributes = isThereListeners && node.attrsMap['v-bind'] === '$attrs';
      if (isThereListeners) {
        node.attrsMap['v-bind'] = '$attrs';
        delete node.attrsMap['v-on'];

        console.info(SUCESSFULL_MESSAGE.LISTENERS_REMOVED);
      } else if (isThereListenersAndAttributes) {
        delete node.attrsMap['v-on'];

        console.info(SUCESSFULL_MESSAGE.LISTENERS_REMOVED);
      }
    }
  });

  return currentAst;
}

// Other Minor Changes | https://v3-migration.vuejs.org/breaking-changes/#other-minor-changes

// - Lifecycle hook: events prefix changed to vnode
// https://v3-migration.vuejs.org/breaking-changes/vnode-lifecycle-events.html#vnode-lifecycle-events
function eventsPrefixChanged(ast) {
  const currentAst = { ...ast };

  traverseTemplate(currentAst, {
    action: (node) => {
      if (node?.attrsMap) {
        Object.keys(node.attrsMap).forEach(item => {
          if (item.match(REGEX.DESTROYED)) {
            node.attrsMap['@vue:unmounted'] = 'unmounted';
            delete node.attrsMap[item];

            console.info(SUCESSFULL_MESSAGE.EVENTS_PREFIX_CHANGED);
          } else if (item.match(REGEX.BEFORE_DESTROY)) {
            node.attrsMap['@vue:beforeUnmount'] = 'beforeUnmount';
            delete node.attrsMap[item];

            console.info(SUCESSFULL_MESSAGE.EVENTS_PREFIX_CHANGED);
          } else if (item.match(REGEX.HOOK)) {
            const newKey = item.replace(REGEX.HOOK, '@vue');
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

// keyCode support as v-on modifiers
// https://v3-migration.vuejs.org/breaking-changes/keycode-modifiers.html
function keyCodeModifiers(ast) {
  const currentAst = { ...ast };

  traverseTemplate(currentAst, {
    action: (node) => {
      if (node?.attrsMap) {
        Object.keys(node.attrsMap).forEach(item => {
          const keyCode = item.match(REGEX.DIGIT);
          const isThereVOn = item.match(REGEX.V_ON);
          if (isThereVOn && keyCode) {
            const isThereKeyCodeMapped = KEY_CODE_KEBAB_CASE[keyCode[0]];

            try {
              if (!isThereKeyCodeMapped) {
                throw new Error(`"${keyCode}" ${ERROR_MESSAGE.KEY_CODE_IS_NOT_DEFINED}`);
              }
              const newKey = item.replace(REGEX.DIGIT, isThereKeyCodeMapped);
              node.attrsMap[newKey] = node.attrsMap[item];
              delete node.attrsMap[item];

              console.info(SUCESSFULL_MESSAGE.KEY_CODE_MODIFIERS);
            } catch (e) {
              console.error(e);
            }
          }
        });
      }
    }
  });

  return currentAst;
}

module.exports = {
  eventsPrefixChanged,
  keyCodeModifiers,
  templateListenersRemoved,
}