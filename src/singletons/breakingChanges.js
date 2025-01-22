const BaseSingleton = require("./base");

class BreakingChanges extends BaseSingleton {
  constructor() {
    if (!BreakingChanges.instance) {
      super({
        count: 0,
      });

      BreakingChanges.instance = this;
    }

    return BreakingChanges.instance;
  }

  reset() {
    Object.keys(this.state).forEach((key) => {
      this.state[key] = 0;
    });
  }

  increaseCount(value) {
    this.set("count", this.state.count + (value || 1));
  }
}

module.exports = new BreakingChanges();
