'use strict';

const REGEX = {
  DESTROYED: /@hook:destroyed/g,
  BEFORE_DESTROY: /@hook:beforeDestroy/g,
  HOOK: /@hook/g,
  V_ON: /v-on/g,
  DIGIT: /\d+/g,
};

module.exports = {
  REGEX
}