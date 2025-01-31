const BaseSingleton = require("./../../src/singletons/base");

describe("BaseSingleton", () => {
  test("should not allow direct instantiation", () => {
    expect(() => new BaseSingleton()).toThrow(
      "cannot instantiate BaseSingleton directly."
    );
  });

  test("should return the correct state when accessed", () => {
    class TestSingleton extends BaseSingleton {}
    const instance = new TestSingleton({ key1: "value1" });
    expect(instance.get("key1")).toBe("value1");
  });

  test("should throw an error when trying to get an undefined key", () => {
    class TestSingleton extends BaseSingleton {}
    const instance = new TestSingleton({ key1: "value1" });
    expect(() => instance.get("key2")).toThrow(
      'undefined key "key2" can not be get on TestSingleton.'
    );
  });

  test("should set a value correctly", () => {
    class TestSingleton extends BaseSingleton {}
    const instance = new TestSingleton({ key1: "value1" });
    instance.set("key1", "newValue");
    expect(instance.get("key1")).toBe("newValue");
  });

  test("should throw an error when trying to set an undefined key", () => {
    class TestSingleton extends BaseSingleton {}
    const instance = new TestSingleton({ key1: "value1" });
    expect(() => instance.set("key2", "newValue")).toThrow(
      'undefined key "key2" can not be set on TestSingleton.'
    );
  });

  test("should return the full state object", () => {
    class TestSingleton extends BaseSingleton {}
    const initialState = { key1: "value1", key2: "value2" };
    const instance = new TestSingleton(initialState);
    expect(instance.getState()).toEqual(initialState);
  });
});
