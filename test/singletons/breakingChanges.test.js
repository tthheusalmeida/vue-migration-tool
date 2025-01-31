const BreakingChanges = require("./../../src/singletons/breakingChanges");

describe("BreakingChanges Singleton", () => {
  beforeEach(() => {
    BreakingChanges.reset();
  });

  test("should initialize with count 0", () => {
    expect(BreakingChanges.get("count")).toBe(0);
  });

  test("should increase count by 1 when no value is provided", () => {
    BreakingChanges.increaseCount();
    expect(BreakingChanges.get("count")).toBe(1);
  });

  test("should increase count by given value", () => {
    BreakingChanges.increaseCount(5);
    expect(BreakingChanges.get("count")).toBe(5);
  });

  test("should reset count to 0", () => {
    BreakingChanges.increaseCount(10);
    BreakingChanges.reset();
    expect(BreakingChanges.get("count")).toBe(0);
  });

  test("should maintain singleton instance", () => {
    const instance1 = require("./../../src/singletons/breakingChanges");
    const instance2 = require("./../../src/singletons/breakingChanges");
    expect(instance1).toBe(instance2);
  });
});
