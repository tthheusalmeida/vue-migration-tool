
'use strict';

const MIGRATION = {
  SUCESSFULL: {
    DESTROYED_TO_UNMOUNTED: '- The "destroyed" lifecycle option has been renamed to "unmounted".',
    BEFORE_DESTROY_TO_BEFORE_UNMOUNT: '- The "beforeDestroy" lifecycle option has been renamed to "beforeUnmount".',
    EVENTS_PREFIX_CHANGED: '- Events prefix on Lifecycle hook changed to vnode.',
    KEY_CODE_MODIFIERS: '- KeyCode support as v-on modifiers.',
    LISTENERS_REMOVED: '- $listeners has been removed / merged into $attrs.',
    DATA_OPTIONS: ' - The data option should always be declared as a function.',
    FILTERS: ' - Filters are removed from Vue 3.0 and no longer supported.',
    GLOBAL_API: {
      CREATE_APP: ' - [Global API] "import Vue" now is "import { createApp }", an app instance from new concept in Vue 3.',
      NEW_VUE: ' - [Global API] "new Vue" now is "createApp", an app instance from new concept in Vue 3.',
      CALL_EXPRESSION: ' - [Global API] API that globally mutate Vue behavior are now moved to the app instance.',
      CALL_EXPRESSION_REMOVED: ' - [Global API] Vue.config.productionTip API was removed.',
      H: ' - [Global API] Add "h" for "vue" declaration on app instance Vue 3.',
    }
  },
  ERROR: {
    KEY_CODE_IS_NOT_DEFINED: 'key code is not defined.',
    CREATE_DIRECTORY: 'Error creating directory',
  },
  WARNING: {
    EMPTY_DIRECTORY: 'There are no files to perform the migration.',
  }
}

function showLog(log) {
  const isShowLog = process.env.SHOW_LOG === 'true';
  if (isShowLog && !!log) {
    console.info(log);
  }
}

module.exports = {
  MIGRATION,
  showLog
}