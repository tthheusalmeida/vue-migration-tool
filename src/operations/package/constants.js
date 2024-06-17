'use strict';

const NEW_DEPENDENCIES = {
  vuex: '4.1.0',
  highcharts: '10.0.0',
  'vue-router': '4.3.3',
  'highcharts-vue': '1.4.0',
  'sass': '1.77.5',
  'core-js': '3.37.1',
}

const OLD_DEPENDENCIES = {
  'vue-template-compiler': [
    'vue-template-compiler',
    // vue-cli-plugin,
    'vue-cli-plugin-router',
    'vue-cli-plugin-vuex',
    '@vue/cli-plugin-router',
    '@vue/cli-plugin-vuex',
    '@vue/cli-plugin-babel',
    '@vue/cli-plugin-eslint',
    '@vue/cli-plugin-pwa',
    '@vue/cli-plugin-unit-jest',
    '@vue/cli-service',
  ],
  // sass
  sass: ['node-sass', 'sass-loader'],
  'node-sass': ['node-sass', 'sass-loader'],
  'sass-loader': ['node-sass', 'sass-loader'],
}

const SWAP_DEPENDENCIES = {
  // sass
  'node-sass': 'sass',
  'sass-loader': 'sass',
};

const NEW_DEPENDENCIES_LIST = Object.keys(NEW_DEPENDENCIES);
const OLD_DEPENDENCIES_LIST = Object.keys(OLD_DEPENDENCIES);

module.exports = {
  NEW_DEPENDENCIES,
  OLD_DEPENDENCIES,
  NEW_DEPENDENCIES_LIST,
  OLD_DEPENDENCIES_LIST,
  SWAP_DEPENDENCIES,
}