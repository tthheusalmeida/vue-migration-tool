const BaseSingleton = require("./base");

class ExistenceChecker extends BaseSingleton {
  constructor() {
    if (!ExistenceChecker.instance) {
      super({
        importVue: false,
        importVuex: false,
        importVueRouter: false,
        newVue: false,
        vuePropRender: false,
      });

      ExistenceChecker.instance = this;
    }

    return ExistenceChecker.instance;
  }

  reset() {
    Object.keys(this.state).forEach((key) => {
      this.state[key] = false;
    });
  }
}

module.exports = new ExistenceChecker();