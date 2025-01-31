const {
  stringifyCircularStructureToJson,
  removeEmptyObjects,
} = require("../../src/utils/object");

describe("=> utils/object", () => {
  describe("stringifyCircularStructureToJson()", () => {
    test("When passes simple object, should return the object as a string.", () => {
      const object = { a: 1 };
      const expected = `{\"a\":1}`;

      expect(stringifyCircularStructureToJson(object)).toBe(expected);
    });

    test("When passes an object with circular reference, should return object without circular reference.", () => {
      const object = { a: 1 };
      object.b = object;
      const expected = '{"a":1}';

      expect(stringifyCircularStructureToJson(object)).toBe(expected);
    });
  });

  describe("removeEmptyObjects()", () => {
    test("should remove empty nested objects", () => {
      const obj = {
        a: {},
        b: { c: {} },
        d: { e: 1 },
      };

      removeEmptyObjects(obj);
      expect(obj).toEqual({ d: { e: 1 } });
    });

    test("should not remove non-empty objects", () => {
      const obj = {
        a: { b: 2 },
        c: { d: {} },
      };

      removeEmptyObjects(obj);
      expect(obj).toEqual({ a: { b: 2 } });
    });

    test("should handle deeply nested empty objects", () => {
      const obj = {
        a: {
          b: {
            c: {
              d: {},
            },
          },
        },
      };

      removeEmptyObjects(obj);
      expect(obj).toEqual({});
    });

    test("should not modify the object if no empty objects are present", () => {
      const obj = { a: { b: 2 }, c: { d: 3 } };

      removeEmptyObjects(obj);
      expect(obj).toEqual({ a: { b: 2 }, c: { d: 3 } });
    });

    test("should handle an empty object", () => {
      const obj = {};

      removeEmptyObjects(obj);
      expect(obj).toEqual({});
    });
  });
});
