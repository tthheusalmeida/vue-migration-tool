const {
  changeHighchartImport,
} = require("../../../../../src/operations/transformer/highcharts/script/index");

describe("=> operations/transformer/highcharts/script/index.js", () => {
  describe("changeHighchartImport()", () => {
    test("When passes an ast with import of Chart, should remove highchart import on ast.", async () => {
      const ast = {
        type: "File",
        start: 0,
        end: 80,
        loc: {
          start: {
            line: 1,
            column: 0,
            index: 0,
          },
          end: {
            line: 2,
            column: 39,
            index: 80,
          },
        },
        errors: [],
        program: {
          type: "Program",
          start: 0,
          end: 80,
          loc: {},
          sourceType: "module",
          interpreter: null,
          body: [
            {
              type: "ImportDeclaration",
              start: 0,
              end: 39,
              loc: {
                start: {
                  line: 1,
                  column: 0,
                  index: 0,
                },
                end: {
                  line: 1,
                  column: 39,
                  index: 39,
                },
              },
              specifiers: [
                {
                  type: "ImportSpecifier",
                  start: 9,
                  end: 14,
                  loc: {
                    start: {
                      line: 1,
                      column: 9,
                      index: 9,
                    },
                    end: {
                      line: 1,
                      column: 14,
                      index: 14,
                    },
                  },
                  imported: {
                    type: "Identifier",
                    start: 9,
                    end: 14,
                    loc: {
                      identifierName: "Chart",
                    },
                    name: "Chart",
                  },
                  local: {
                    type: "Identifier",
                    start: 9,
                    end: 14,
                    name: "Chart",
                  },
                },
              ],
              source: {
                type: "StringLiteral",
                start: 22,
                end: 38,
                loc: {
                  start: {
                    line: 1,
                    column: 22,
                    index: 22,
                  },
                  end: {
                    line: 1,
                    column: 38,
                    index: 38,
                  },
                },
                extra: {
                  rawValue: "highcharts-vue",
                  raw: '"highcharts-vue"',
                },
                value: "highcharts-vue",
              },
              trailingComments: [
                {
                  type: "CommentLine",
                  value: ' import Highcharts from "highcharts";',
                  start: 41,
                  end: 80,
                  loc: {
                    start: {
                      line: 2,
                      column: 0,
                      index: 41,
                    },
                    end: {
                      line: 2,
                      column: 39,
                      index: 80,
                    },
                  },
                },
              ],
            },
          ],
          directives: [],
        },
        comments: [null],
      };

      const expected = {
        type: "File",
        start: 0,
        end: 80,
        loc: {
          start: { line: 1, column: 0, index: 0 },
          end: { line: 2, column: 39, index: 80 },
        },
        errors: [],
        program: {
          type: "Program",
          start: 0,
          end: 80,
          loc: {},
          sourceType: "module",
          interpreter: null,
          body: [],
          directives: [],
        },
        comments: [null],
      };

      expect(await changeHighchartImport(ast)).toStrictEqual(expected);
    });

    test("When passes an ast, should change highchart import on ast.", async () => {
      const ast = {
        type: "File",
        start: 0,
        end: 36,
        loc: {
          start: { line: 1, column: 0, index: 0 },
          end: { line: 1, column: 36, index: 36 },
        },
        errors: [],
        program: {
          type: "Program",
          start: 0,
          end: 36,
          loc: {},
          sourceType: "module",
          interpreter: null,
          body: [
            {
              type: "ImportDeclaration",
              start: 0,
              end: 36,
              loc: {
                start: { line: 1, column: 0, index: 0 },
                end: { line: 1, column: 36, index: 36 },
              },
              specifiers: [
                {
                  type: "ImportDefaultSpecifier",
                  start: 7,
                  end: 17,
                  loc: {
                    start: { line: 1, column: 7, index: 7 },
                    end: { line: 1, column: 17, index: 17 },
                  },
                  local: {
                    type: "Identifier",
                    start: 7,
                    end: 17,
                    loc: { identifierName: "Highcharts" },
                    name: "Highcharts",
                  },
                },
              ],
              source: {
                type: "StringLiteral",
                start: 23,
                end: 35,
                loc: {
                  start: { line: 1, column: 23, index: 23 },
                  end: { line: 1, column: 35, index: 35 },
                },
                extra: { rawValue: "highcharts", raw: '"highcharts"' },
                value: "highcharts",
              },
            },
          ],
          directives: [],
        },
        comments: [],
      };

      const expected = {
        type: "File",
        start: 0,
        end: 36,
        loc: {
          start: { line: 1, column: 0, index: 0 },
          end: { line: 1, column: 36, index: 36 },
        },
        errors: [],
        program: {
          type: "Program",
          start: 0,
          end: 36,
          loc: {},
          sourceType: "module",
          interpreter: null,
          body: [
            {
              type: "ImportDeclaration",
              start: 0,
              end: 36,
              loc: {
                start: { line: 1, column: 0, index: 0 },
                end: { line: 1, column: 36, index: 36 },
              },
              specifiers: [
                {
                  type: "ImportDefaultSpecifier",
                  start: 7,
                  end: 17,
                  loc: {
                    start: { line: 1, column: 7, index: 7 },
                    end: { line: 1, column: 17, index: 17 },
                  },
                  local: {
                    type: "Identifier",
                    start: 7,
                    end: 17,
                    loc: { identifierName: "Highcharts" },
                    name: "Highcharts",
                  },
                },
              ],
              source: {
                type: "StringLiteral",
                start: 23,
                end: 35,
                loc: {
                  start: { line: 1, column: 23, index: 23 },
                  end: { line: 1, column: 35, index: 35 },
                },
                extra: { rawValue: "highcharts", raw: '"highcharts"' },
                value: "highcharts",
              },
            },
          ],
          directives: [],
        },
        comments: [],
      };

      expect(await changeHighchartImport(ast)).toStrictEqual(expected);
    });
  });
});
