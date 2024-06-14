'use strict';

const NEW_DEPENDENCIES = {
  vuex: '4.1.0',
  highcharts: '10.0.0',
  'vue-router': '4.3.3',
  'highcharts-vue': '1.4.0',
}

const NEW_DEV_DEPENDENCIES = {
  'sass': '1.77.5',
}

const OLD_DEPENDENCIES = {

}

const OLD_DEV_DEPENDENCIES = {
  sass: ['node-sass', 'sass-loader'],
}

const NEW_DEPENDENCIES_LIST = Object.keys(NEW_DEPENDENCIES);
const NEW_DEV_DEPENDENCIES_LIST = Object.keys(NEW_DEV_DEPENDENCIES);
const OLD_DEPENDENCIES_LIST = Object.keys(OLD_DEPENDENCIES);
const OLD_DEV_DEPENDENCIES_LIST = Object.keys(OLD_DEV_DEPENDENCIES);

module.exports = {
  NEW_DEPENDENCIES,
  NEW_DEV_DEPENDENCIES,
  OLD_DEPENDENCIES,
  OLD_DEV_DEPENDENCIES,
  NEW_DEPENDENCIES_LIST,
  NEW_DEV_DEPENDENCIES_LIST,
  OLD_DEPENDENCIES_LIST,
  OLD_DEV_DEPENDENCIES_LIST,
}