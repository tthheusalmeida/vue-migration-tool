const ExistenceChecker = require("./../../src/singletons/existenceChecker");

describe("ExistenceChecker Singleton", () => {
  beforeEach(() => {
    ExistenceChecker.reset();
  });

  test("should initialize all properties as false", () => {
    expect(ExistenceChecker.getState()).toEqual({
      importVue: false,
      importVuex: false,
      importVueRouter: false,
      newVue: false,
      vuePropRender: false,
    });
  });

  test("should allow setting a property to true", () => {
    ExistenceChecker.set("importVue", true);
    expect(ExistenceChecker.get("importVue")).toBe(true);
  });

  test("should reset all properties to false", () => {
    ExistenceChecker.set("importVue", true);
    ExistenceChecker.set("newVue", true);
    ExistenceChecker.reset();
    expect(ExistenceChecker.getState()).toEqual({
      importVue: false,
      importVuex: false,
      importVueRouter: false,
      newVue: false,
      vuePropRender: false,
    });
  });

  test("should maintain singleton instance", () => {
    const instance1 = require("./../../src/singletons/existenceChecker");
    const instance2 = require("./../../src/singletons/existenceChecker");
    expect(instance1).toBe(instance2);
  });
});
