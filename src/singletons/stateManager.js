const BaseSingleton = require("./base");

class StateManager extends BaseSingleton {
  constructor() {
    if (!StateManager.instance) {
      super({
        /*
          Real example: import Vue from 'vue';
          AST store: { type: 'ImportDeclaration' }
        */
        importVue: null,
        /*
          Real example: import Vuex from 'vuex';
          AST store: { type: 'ImportDeclaration' }
        */
        importVuex: null,
        /*
          Real example: const app = ...
          AST store: { type: 'VariableDeclaration' }
        */
        appVariableDeclaration: null,
        /*
          Real example: { store, router ...}
          AST store: [{ type: 'ExpressionStatement' }, ...]
        */
        newVueOtherProps: null,
        /*
          Real example: new Vue().$mount('#app');
          AST store: { type: 'ExpressionStatement' }
        */
        newVueMount: null
      });

      StateManager.instance = this;
    }

    return StateManager.instance = this;
  }

  reset() {
    Object.keys(this.state).forEach((key) => {
      this.state[key] = null;
    });
  }
}

module.exports = new StateManager();