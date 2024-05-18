'use strict';

const MIGRATION = {
  SUCESSFULL: {
    DESTROYED_TO_UNMOUNTED: '- The "destroyed" lifecycle option has been renamed to "unmounted".',
    BEFORE_DESTROY_TO_BEFORE_UNMOUNT: '- The "beforeDestroy" lifecycle option has been renamed to "beforeUnmount".',
    EVENTS_PREFIX_CHANGED: '- Events prefix on Lifecycle hook changed to vnode.',
    KEY_CODE_MODIFIERS: '- KeyCode support as v-on modifiers.',
    LISTENERS_REMOVED: '- $listeners has been removed / merged into $attrs.',
    DATA_OPTIONS: '- The data option should always be declared as a function.',
    NEW_VUE: ' - [Global API] new Vue now is createApp, an app instance from new concept in Vue 3.',
    FILTERS: ' - Filters are removed from Vue 3.0 and no longer supported.'
  },
  ERROR: {
    KEY_CODE_IS_NOT_DEFINED: 'key code is not defined.',
    CREATE_DIRECTORY: 'Error creating directory',
  },
  WARNING: {
    EMPTY_DIRECTORY: 'There are no files to perform the migration.',
  }
}

module.exports = {
  MIGRATION,
}