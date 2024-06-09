class BaseSingleton {
  constructor(state = {}) {
    if (new.target === BaseSingleton) {
      throw new Error("Cannot instantiate BaseSingleton directly.");
    }

    this.state = state;
  }

  get(key) {
    if (this.state[key] === undefined) {
      throw new Error(`Undefined key "${key}" can not be get on ${this.constructor.name}.`);
    }

    return this.state[key];
  }

  getState() {
    return this.state;
  }

  set(key, value) {
    if (!this.state[key] === undefined) {
      throw new Error(`Undefined key "${key}" can not be set on ${this.constructor.name}.`);
    }

    this.state[key] = value;
  }
}

module.exports = BaseSingleton;