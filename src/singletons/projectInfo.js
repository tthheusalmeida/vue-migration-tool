const BaseSingleton = require("./base");

class ProjectInfo extends BaseSingleton {
  constructor() {
    if (!ProjectInfo.instance) {
      super({
        folderName: '',
      });

      ProjectInfo.instance = this;
    }

    return ProjectInfo.instance;
  }

  reset() {
    Object.keys(this.state).forEach((key) => {
      this.state[key] = '';
    });
  }
}

module.exports = new ProjectInfo();