const StateManager = require("./../../src/singletons/stateManager");

describe("StateManager Singleton", () => {
  beforeEach(() => {
    StateManager.reset();
  });

  test("should initialize all properties as null", () => {
    expect(StateManager.getState()).toEqual({
      importVue: null,
      importVuex: null,
      importVueRouter: null,
      appVariableDeclaration: null,
      newVueOtherProps: null,
      newVueMount: null,
      routerPropMode: null,
    });
  });

  test("should allow setting and getting properties", () => {
    StateManager.set("importVue", { type: "ImportDeclaration" });
    expect(StateManager.get("importVue")).toEqual({
      type: "ImportDeclaration",
    });
  });

  test("should reset all properties to null", () => {
    StateManager.set("importVue", { type: "ImportDeclaration" });
    StateManager.set("routerPropMode", { value: "history" });
    StateManager.reset();
    expect(StateManager.getState()).toEqual({
      importVue: null,
      importVuex: null,
      importVueRouter: null,
      appVariableDeclaration: null,
      newVueOtherProps: null,
      newVueMount: null,
      routerPropMode: null,
    });
  });

  test("should maintain singleton instance", () => {
    const instance1 = require("./../../src/singletons/stateManager");
    const instance2 = require("./../../src/singletons/stateManager");
    expect(instance1).toBe(instance2);
  });
});
