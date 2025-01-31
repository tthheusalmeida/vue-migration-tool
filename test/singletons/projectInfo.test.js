const ProjectInfo = require("./../../src/singletons/projectInfo");

describe("ProjectInfo Singleton", () => {
  beforeEach(() => {
    ProjectInfo.reset();
  });

  test("should initialize folderName as an empty string", () => {
    expect(ProjectInfo.get("folderName")).toBe("");
  });

  test("should allow setting folderName", () => {
    ProjectInfo.set("folderName", "myProject");
    expect(ProjectInfo.get("folderName")).toBe("myProject");
  });

  test("should reset folderName to an empty string", () => {
    ProjectInfo.set("folderName", "myProject");
    ProjectInfo.reset();
    expect(ProjectInfo.get("folderName")).toBe("");
  });

  test("should maintain singleton instance", () => {
    const instance1 = require("./../../src/singletons/projectInfo");
    const instance2 = require("./../../src/singletons/projectInfo");
    expect(instance1).toBe(instance2);
  });
});
