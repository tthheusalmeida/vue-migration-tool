const PackageInfo = require("./../../src/singletons/packageInfo");

describe("PackageInfo Singleton", () => {
  beforeEach(() => {
    PackageInfo.reset();
  });

  test("should initialize dependencies and devDependencies as empty objects", () => {
    expect(PackageInfo.getState()).toEqual({
      dependencies: {},
      devDependencies: {},
    });
  });

  test("should allow adding dependencies", () => {
    PackageInfo.set("dependencies", { vue: "3.2.0" });
    expect(PackageInfo.get("dependencies")).toEqual({ vue: "3.2.0" });
  });

  test("should allow adding devDependencies", () => {
    PackageInfo.set("devDependencies", { jest: "29.0.0" });
    expect(PackageInfo.get("devDependencies")).toEqual({ jest: "29.0.0" });
  });

  test("should reset dependencies and devDependencies to empty objects", () => {
    PackageInfo.set("dependencies", { vue: "3.2.0" });
    PackageInfo.set("devDependencies", { jest: "29.0.0" });
    PackageInfo.reset();
    expect(PackageInfo.getState()).toEqual({
      dependencies: {},
      devDependencies: {},
    });
  });

  test("should maintain singleton instance", () => {
    const instance1 = require("./../../src/singletons/packageInfo");
    const instance2 = require("./../../src/singletons/packageInfo");
    expect(instance1).toBe(instance2);
  });
});
