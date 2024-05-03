const {
  stringifyCircularStructureToJson,
} = require('../../src/utils/object');

describe('=> utils/object', () => {
  describe('stringifyCircularStructureToJson()', () => {
    test('When passes simple object, should return the object.', () => {
      const object = { a: 1, b: 'two' };
      const expected = '{"a":1,"b":"two"}';

      expect(stringifyCircularStructureToJson(object)).toBe(expected);
    });

    test('When passes an object with circular reference, should return object without circular reference.', () => {
      const object = { a: 1 };
      object.b = object;
      const expected = '{"a":1}';

      expect(stringifyCircularStructureToJson(object)).toBe(expected);
    });
  });
});