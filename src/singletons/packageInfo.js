const BaseSingleton = require("./base");

class PackageInfo extends BaseSingleton {
  constructor() {
    if (!PackageInfo.instance) {
      super({
        dependencies: {},
        devDependencies: {},
      });

      PackageInfo.instance = this;
    }

    return PackageInfo.instance;
  }

  reset() {
    Object.keys(this.state).forEach((key) => {
      this.state[key] = {};
    });
  }
}

module.exports = new PackageInfo();