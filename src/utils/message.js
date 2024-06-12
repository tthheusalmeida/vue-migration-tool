
'use strict';

const VUE = {
  DESTROYED_TO_UNMOUNTED: ' - (VUE) The "destroyed" lifecycle option has been renamed to "unmounted".',
  BEFORE_DESTROY_TO_BEFORE_UNMOUNT: ' - (VUE) The "beforeDestroy" lifecycle option has been renamed to "beforeUnmount".',
  EVENTS_PREFIX_CHANGED: ' - (VUE) Events prefix on Lifecycle hook changed to vnode.',
  KEY_CODE_MODIFIERS: ' - (VUE) KeyCode support as v-on modifiers.',
  LISTENERS_REMOVED: ' - (VUE) $listeners has been removed / merged into $attrs.',
  DATA_OPTIONS: ' - (VUE) The data option should always be declared as a function.',
  FILTERS: ' - (VUE) Filters are removed from Vue 3.0 and no longer supported.',
  REMOVE_VUE_USE: ' - (VUE) "Vue.use" has been removed from vue.',
  GLOBAL_API: {
    CREATE_APP: ' - (VUE) [Global API] "import Vue" now is "import { createApp }", an app instance from new concept in Vue 3.',
    NEW_VUE: ' - (VUE) [Global API] "new Vue" now is "createApp", an app instance from new concept in Vue 3.',
    CALL_EXPRESSION: ' - (VUE) [Global API] API that globally mutate Vue behavior are now moved to the app instance.',
    CALL_EXPRESSION_REMOVED: ' - (VUE) [Global API] Vue.config.productionTip API was removed.',
    H: ' - (VUE) [Global API] Add "h" for "vue" declaration on app instance Vue 3.',
  }
};

const VUEX = {
  CREATE_STORE: ' - (VUEX) Create a new store, users are now encouraged to use the newly introduced createStore function',
  VUEX_STORE: ' - (VUEX) "new Vuex.Store" has been change for createStore.',
};

const ROUTER = {
  CREATE_ROUTER: ' - (VUE-ROUTER) "new Router" becomes "createRouter".',
  VUE_ROUTER: ' - (VUE-ROUTER) Instead of writing new VueRouter(), you now have to call "createRouter".'
};

const HIGHCHARTS = {
  RENAME_HIGHCHARTS_TAG: ' - (HIGHCHARTS) Rename render tag to "Highcharts".',
  COMPONENT_DEFINITION: ' - (HIGHCHARTS) Remove component definition on export default.'
}

const MIGRATION = {
  VUE,
  VUEX,
  ROUTER,
  HIGHCHARTS,
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