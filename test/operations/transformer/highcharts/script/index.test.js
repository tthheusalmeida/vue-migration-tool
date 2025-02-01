const {
  changeHighchartImport,
} = require("../../../../../src/operations/transformer/highcharts/script/index");
const breakingChanges = require("../../../../../src/singletons/breakingChanges");

jest.mock("../../../../../src/singletons/breakingChanges");

beforeEach(() => {
  jest.clearAllMocks();
});

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
      expect(breakingChanges.increaseCount).toHaveBeenCalled();
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
      expect(breakingChanges.increaseCount).not.toHaveBeenCalled();
    });

    test("When passes an ast with empty components, should remove component.", async () => {
      const ast = {
        type: "File",
        start: 0,
        end: 64,
        loc: {
          start: { line: 1, column: 0, index: 0 },
          end: { line: 5, column: 0, index: 64 },
        },
        errors: [],
        program: {
          type: "Program",
          start: 0,
          end: 64,
          loc: {},
          sourceType: "module",
          interpreter: null,
          body: [
            {
              type: "ExportDefaultDeclaration",
              start: 0,
              end: 62,
              loc: {
                start: { line: 1, column: 0, index: 0 },
                end: { line: 4, column: 2, index: 62 },
              },
              declaration: {
                type: "ObjectExpression",
                start: 15,
                end: 61,
                loc: {
                  start: { line: 1, column: 15, index: 15 },
                  end: { line: 4, column: 1, index: 61 },
                },
                properties: [
                  {
                    type: "ObjectProperty",
                    start: 20,
                    end: 38,
                    loc: {
                      start: { line: 2, column: 2, index: 20 },
                      end: { line: 2, column: 20, index: 38 },
                    },
                    method: false,
                    key: {
                      type: "Identifier",
                      start: 20,
                      end: 24,
                      loc: {
                        end: { line: 2, column: 6, index: 24 },
                        identifierName: "name",
                      },
                      name: "name",
                    },
                    computed: false,
                    shorthand: false,
                    value: {
                      type: "StringLiteral",
                      start: 26,
                      end: 38,
                      loc: { start: { line: 2, column: 8, index: 26 } },
                      extra: { rawValue: "PolarChart", raw: '"PolarChart"' },
                      value: "PolarChart",
                    },
                  },
                  {
                    type: "ObjectProperty",
                    start: 43,
                    end: 57,
                    loc: {
                      start: { line: 3, column: 2, index: 43 },
                      end: { line: 3, column: 16, index: 57 },
                    },
                    method: false,
                    key: {
                      type: "Identifier",
                      start: 43,
                      end: 53,
                      loc: {
                        end: { line: 3, column: 12, index: 53 },
                        identifierName: "components",
                      },
                      name: "components",
                    },
                    computed: false,
                    shorthand: false,
                    value: {
                      type: "ObjectExpression",
                      start: 55,
                      end: 57,
                      loc: { start: { line: 3, column: 14, index: 55 } },
                      properties: [],
                    },
                  },
                ],
                extra: { trailingComma: 57 },
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
        end: 64,
        loc: {
          start: { line: 1, column: 0, index: 0 },
          end: { line: 5, column: 0, index: 64 },
        },
        errors: [],
        program: {
          type: "Program",
          start: 0,
          end: 64,
          loc: {},
          sourceType: "module",
          interpreter: null,
          body: [
            {
              type: "ExportDefaultDeclaration",
              start: 0,
              end: 62,
              loc: {
                start: { line: 1, column: 0, index: 0 },
                end: { line: 4, column: 2, index: 62 },
              },
              declaration: {
                type: "ObjectExpression",
                start: 15,
                end: 61,
                loc: {
                  start: { line: 1, column: 15, index: 15 },
                  end: { line: 4, column: 1, index: 61 },
                },
                properties: [
                  {
                    type: "ObjectProperty",
                    start: 20,
                    end: 38,
                    loc: {
                      start: { line: 2, column: 2, index: 20 },
                      end: { line: 2, column: 20, index: 38 },
                    },
                    method: false,
                    key: {
                      type: "Identifier",
                      start: 20,
                      end: 24,
                      loc: {
                        end: { line: 2, column: 6, index: 24 },
                        identifierName: "name",
                      },
                      name: "name",
                    },
                    computed: false,
                    shorthand: false,
                    value: {
                      type: "StringLiteral",
                      start: 26,
                      end: 38,
                      loc: { start: { line: 2, column: 8, index: 26 } },
                      extra: { rawValue: "PolarChart", raw: '"PolarChart"' },
                      value: "PolarChart",
                    },
                  },
                ],
                extra: { trailingComma: 57 },
              },
            },
          ],
          directives: [],
        },
        comments: [],
      };

      expect(changeHighchartImport(ast)).toStrictEqual(expected);
      expect(breakingChanges.increaseCount).not.toHaveBeenCalled();
    });

    test("When passes an ast with highcharts and other components, should remove highcharts and keep other components.", async () => {
      const ast = {
        type: "File",
        start: 0,
        end: 111,
        loc: {
          start: { line: 1, column: 0, index: 0 },
          end: { line: 8, column: 0, index: 111 },
        },
        errors: [],
        program: {
          type: "Program",
          start: 0,
          end: 111,
          loc: {},
          sourceType: "module",
          interpreter: null,
          body: [
            {
              type: "ExportDefaultDeclaration",
              start: 0,
              end: 109,
              loc: {
                start: { line: 1, column: 0, index: 0 },
                end: { line: 7, column: 2, index: 109 },
              },
              declaration: {
                type: "ObjectExpression",
                start: 15,
                end: 108,
                loc: {
                  start: { line: 1, column: 15, index: 15 },
                  end: { line: 7, column: 1, index: 108 },
                },
                properties: [
                  {
                    type: "ObjectProperty",
                    start: 20,
                    end: 38,
                    loc: {
                      start: { line: 2, column: 2, index: 20 },
                      end: { line: 2, column: 20, index: 38 },
                    },
                    method: false,
                    key: {
                      type: "Identifier",
                      start: 20,
                      end: 24,
                      loc: {
                        end: { line: 2, column: 6, index: 24 },
                        identifierName: "name",
                      },
                      name: "name",
                    },
                    computed: false,
                    shorthand: false,
                    value: {
                      type: "StringLiteral",
                      start: 26,
                      end: 38,
                      loc: { start: { line: 2, column: 8, index: 26 } },
                      extra: { rawValue: "PolarChart", raw: '"PolarChart"' },
                      value: "PolarChart",
                    },
                  },
                  {
                    type: "ObjectProperty",
                    start: 43,
                    end: 104,
                    loc: {
                      start: { line: 3, column: 2, index: 43 },
                      end: { line: 6, column: 3, index: 104 },
                    },
                    method: false,
                    key: {
                      type: "Identifier",
                      start: 43,
                      end: 53,
                      loc: {
                        end: { line: 3, column: 12, index: 53 },
                        identifierName: "components",
                      },
                      name: "components",
                    },
                    computed: false,
                    shorthand: false,
                    value: {
                      type: "ObjectExpression",
                      start: 55,
                      end: 104,
                      loc: { start: { line: 3, column: 14, index: 55 } },
                      properties: [
                        {
                          type: "ObjectProperty",
                          start: 62,
                          end: 80,
                          loc: {
                            start: { line: 4, column: 4, index: 62 },
                            end: { line: 4, column: 22, index: 80 },
                          },
                          method: false,
                          key: {
                            type: "Identifier",
                            start: 62,
                            end: 72,
                            loc: {
                              end: { line: 4, column: 14, index: 72 },
                              identifierName: "Highcharts",
                            },
                            name: "Highcharts",
                          },
                          computed: false,
                          shorthand: false,
                          value: {
                            type: "Identifier",
                            start: 74,
                            end: 80,
                            loc: {
                              start: { line: 4, column: 16, index: 74 },
                              identifierName: "Charts",
                            },
                            name: "Charts",
                          },
                        },
                        {
                          type: "ObjectProperty",
                          start: 87,
                          end: 98,
                          loc: {
                            start: { line: 5, column: 4, index: 87 },
                            end: { line: 5, column: 15, index: 98 },
                          },
                          method: false,
                          key: {
                            type: "Identifier",
                            start: 87,
                            end: 98,
                            loc: { identifierName: "MyComponent" },
                            name: "MyComponent",
                          },
                          computed: false,
                          shorthand: true,
                          value: {
                            type: "Identifier",
                            start: 87,
                            end: 98,
                            name: "MyComponent",
                          },
                          extra: { shorthand: true },
                        },
                      ],
                      extra: { trailingComma: 98 },
                    },
                  },
                ],
                extra: { trailingComma: 104 },
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
        end: 111,
        loc: {
          start: { line: 1, column: 0, index: 0 },
          end: { line: 8, column: 0, index: 111 },
        },
        errors: [],
        program: {
          type: "Program",
          start: 0,
          end: 111,
          loc: {},
          sourceType: "module",
          interpreter: null,
          body: [
            {
              type: "ExportDefaultDeclaration",
              start: 0,
              end: 109,
              loc: {
                start: { line: 1, column: 0, index: 0 },
                end: { line: 7, column: 2, index: 109 },
              },
              declaration: {
                type: "ObjectExpression",
                start: 15,
                end: 108,
                loc: {
                  start: { line: 1, column: 15, index: 15 },
                  end: { line: 7, column: 1, index: 108 },
                },
                properties: [
                  {
                    type: "ObjectProperty",
                    start: 20,
                    end: 38,
                    loc: {
                      start: { line: 2, column: 2, index: 20 },
                      end: { line: 2, column: 20, index: 38 },
                    },
                    method: false,
                    key: {
                      type: "Identifier",
                      start: 20,
                      end: 24,
                      loc: {
                        end: { line: 2, column: 6, index: 24 },
                        identifierName: "name",
                      },
                      name: "name",
                    },
                    computed: false,
                    shorthand: false,
                    value: {
                      type: "StringLiteral",
                      start: 26,
                      end: 38,
                      loc: { start: { line: 2, column: 8, index: 26 } },
                      extra: { rawValue: "PolarChart", raw: '"PolarChart"' },
                      value: "PolarChart",
                    },
                  },
                  {
                    type: "ObjectProperty",
                    start: 43,
                    end: 104,
                    loc: {
                      start: { line: 3, column: 2, index: 43 },
                      end: { line: 6, column: 3, index: 104 },
                    },
                    method: false,
                    key: {
                      type: "Identifier",
                      start: 43,
                      end: 53,
                      loc: {
                        end: { line: 3, column: 12, index: 53 },
                        identifierName: "components",
                      },
                      name: "components",
                    },
                    computed: false,
                    shorthand: false,
                    value: {
                      type: "ObjectExpression",
                      start: 55,
                      end: 104,
                      loc: { start: { line: 3, column: 14, index: 55 } },
                      properties: [
                        {
                          type: "ObjectProperty",
                          start: 87,
                          end: 98,
                          loc: {
                            start: { line: 5, column: 4, index: 87 },
                            end: { line: 5, column: 15, index: 98 },
                          },
                          method: false,
                          key: {
                            type: "Identifier",
                            start: 87,
                            end: 98,
                            loc: { identifierName: "MyComponent" },
                            name: "MyComponent",
                          },
                          computed: false,
                          shorthand: true,
                          value: {
                            type: "Identifier",
                            start: 87,
                            end: 98,
                            name: "MyComponent",
                          },
                          extra: { shorthand: true },
                        },
                      ],
                      extra: { trailingComma: 98 },
                    },
                  },
                ],
                extra: { trailingComma: 104 },
              },
            },
          ],
          directives: [],
        },
        comments: [],
      };

      expect(changeHighchartImport(ast)).toStrictEqual(expected);
      expect(breakingChanges.increaseCount).toHaveBeenCalled();
    });
  });
});
