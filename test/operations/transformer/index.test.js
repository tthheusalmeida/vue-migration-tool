const {
  applyTransformerRules,
} = require("../../../src/operations/transformer");

describe("=> operations/transformer/index.js", () => {
  describe("applyTransformerRules()", () => {
    test("When passes an ast and rulesList, should apply transformer rules on ast.", () => {
      const ast = { a: 1, b: 2 };
      const rulesList = [
        (rawAst) => {
          const obj = {};
          Object.keys(rawAst).forEach((r) => (obj[r] = rawAst[r] * 2));
          return obj;
        },
      ];

      const expected = { a: 2, b: 4 };

      expect(applyTransformerRules(ast, rulesList)).toStrictEqual(expected);
    });
  });

  describe("applyTransformerRules()", () => {
    test("When passes an empty ast and rulesList, should not apply transformer rules on ast.", () => {
      const ast = {};
      const rulesList = [
        (rawAst) => {
          const obj = {};
          Object.keys(rawAst).forEach((r) => (obj[r] = rawAst[r] * 2));
          return obj;
        },
      ];

      const expected = {};

      expect(applyTransformerRules(ast, rulesList)).toStrictEqual(expected);
    });
  });
});
