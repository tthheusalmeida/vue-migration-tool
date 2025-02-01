const {
  requireIsNotSupported,
  componentMustHaveExtensionName,
} = require("../../../../../src/operations/transformer/vite/script/index");

const breakingChanges = require("../../../../../src/singletons/breakingChanges");

jest.mock("../../../../../src/singletons/breakingChanges");
jest.mock("../../../../../src/operations/file/index", () => ({
  isVueFile: (_) => false,
}));
jest.mock("path", () => ({
  extname: (importPath) => (importPath.endsWith(".vue") ? ".vue" : ""),
}));

beforeEach(() => {
  jest.clearAllMocks();
  global.breakingChanges = { increaseCount: jest.fn() };
});

describe("=> operations/transformer/vite/script/index.js", () => {
  describe("requireIsNotSupported()", () => {
    test("When passes an ast with require, should apply transformer for import", async () => {
      const ast = {
        type: "File",
        start: 0,
        end: 87,
        loc: {
          start: { line: 1, column: 0, index: 0 },
          end: { line: 4, column: 0, index: 87 },
        },
        errors: [],
        program: {
          type: "Program",
          start: 0,
          end: 87,
          loc: {},
          sourceType: "module",
          interpreter: null,
          body: [
            {
              type: "ExportDefaultDeclaration",
              start: 0,
              end: 85,
              loc: {
                start: { line: 1, column: 0, index: 0 },
                end: { line: 3, column: 2, index: 85 },
              },
              declaration: {
                type: "ObjectExpression",
                start: 15,
                end: 84,
                loc: {
                  start: { line: 1, column: 15, index: 15 },
                  end: { line: 3, column: 1, index: 84 },
                },
                properties: [
                  {
                    type: "ObjectProperty",
                    start: 20,
                    end: 80,
                    loc: {
                      start: { line: 2, column: 2, index: 20 },
                      end: { line: 2, column: 62, index: 80 },
                    },
                    method: false,
                    key: {
                      type: "Identifier",
                      start: 20,
                      end: 28,
                      loc: {
                        end: { line: 2, column: 10, index: 28 },
                        identifierName: "imageurl",
                      },
                      name: "imageurl",
                    },
                    computed: false,
                    shorthand: false,
                    value: {
                      type: "CallExpression",
                      start: 30,
                      end: 80,
                      loc: { start: { line: 2, column: 12, index: 30 } },
                      callee: {
                        type: "Identifier",
                        start: 30,
                        end: 37,
                        loc: {
                          end: { line: 2, column: 19, index: 37 },
                          identifierName: "require",
                        },
                        name: "require",
                      },
                      arguments: [
                        {
                          type: "StringLiteral",
                          start: 38,
                          end: 79,
                          loc: {
                            start: { line: 2, column: 20, index: 38 },
                            end: { line: 2, column: 61, index: 79 },
                          },
                          extra: {
                            rawValue: "./assets/clouds-fight-jumping-62376.jpg",
                            raw: '"./assets/clouds-fight-jumping-62376.jpg"',
                          },
                          value: "./assets/clouds-fight-jumping-62376.jpg",
                        },
                      ],
                    },
                  },
                ],
                extra: { trailingComma: 80 },
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
        end: 87,
        loc: {
          start: { line: 1, column: 0, index: 0 },
          end: { line: 4, column: 0, index: 87 },
        },
        errors: [],
        program: {
          type: "Program",
          start: 0,
          end: 87,
          loc: {},
          sourceType: "module",
          interpreter: null,
          body: [
            {
              type: "ImportDeclaration",
              specifiers: [
                {
                  type: "ImportDefaultSpecifier",
                  local: {
                    type: "Identifier",
                    name: "cloudsFightJumping62376",
                  },
                },
              ],
              source: {
                type: "StringLiteral",
                value: "./assets/clouds-fight-jumping-62376.jpg",
              },
            },
            {
              type: "ExportDefaultDeclaration",
              start: 0,
              end: 85,
              loc: {
                start: { line: 1, column: 0, index: 0 },
                end: { line: 3, column: 2, index: 85 },
              },
              declaration: {
                type: "ObjectExpression",
                start: 15,
                end: 84,
                loc: {
                  start: { line: 1, column: 15, index: 15 },
                  end: { line: 3, column: 1, index: 84 },
                },
                properties: [
                  {
                    type: "ObjectProperty",
                    start: 20,
                    end: 80,
                    loc: {
                      start: { line: 2, column: 2, index: 20 },
                      end: { line: 2, column: 62, index: 80 },
                    },
                    method: false,
                    key: {
                      type: "Identifier",
                      start: 20,
                      end: 28,
                      loc: {
                        end: { line: 2, column: 10, index: 28 },
                        identifierName: "imageurl",
                      },
                      name: "imageurl",
                    },
                    computed: false,
                    shorthand: false,
                    value: {
                      type: "Identifier",
                      name: "cloudsFightJumping62376",
                      trailingComments: [],
                      leadingComments: [],
                      innerComments: [],
                    },
                  },
                ],
                extra: { trailingComma: 80 },
              },
            },
          ],
          directives: [],
        },
        comments: [],
      };

      expect(await requireIsNotSupported(ast)).toStrictEqual(expected);
      expect(breakingChanges.increaseCount).toHaveBeenCalled();
    });

    test("When passes an ast with process.env, should apply transformer for import.meta.env", async () => {
      const ast = {
        type: "File",
        start: 0,
        end: 41,
        loc: {
          start: { line: 1, column: 0, index: 0 },
          end: { line: 2, column: 0, index: 41 },
        },
        errors: [],
        program: {
          type: "Program",
          start: 0,
          end: 41,
          loc: {},
          sourceType: "module",
          interpreter: null,
          body: [
            {
              type: "VariableDeclaration",
              start: 0,
              end: 39,
              loc: {
                start: { line: 1, column: 0, index: 0 },
                end: { line: 1, column: 39, index: 39 },
              },
              declarations: [
                {
                  type: "VariableDeclarator",
                  start: 6,
                  end: 38,
                  loc: {
                    start: { line: 1, column: 6, index: 6 },
                    end: { line: 1, column: 38, index: 38 },
                  },
                  id: {
                    type: "Identifier",
                    start: 6,
                    end: 12,
                    loc: {
                      end: { line: 1, column: 12, index: 12 },
                      identifierName: "config",
                    },
                    name: "config",
                  },
                  init: {
                    type: "MemberExpression",
                    start: 15,
                    end: 38,
                    loc: { start: { line: 1, column: 15, index: 15 } },
                    object: {
                      type: "MemberExpression",
                      start: 15,
                      end: 26,
                      loc: { end: { line: 1, column: 26, index: 26 } },
                      object: {
                        type: "Identifier",
                        start: 15,
                        end: 22,
                        loc: {
                          end: { line: 1, column: 22, index: 22 },
                          identifierName: "process",
                        },
                        name: "process",
                      },
                      computed: false,
                      property: {
                        type: "Identifier",
                        start: 23,
                        end: 26,
                        loc: {
                          start: { line: 1, column: 23, index: 23 },
                          identifierName: "env",
                        },
                        name: "env",
                      },
                    },
                    computed: false,
                    property: {
                      type: "Identifier",
                      start: 27,
                      end: 38,
                      loc: {
                        start: { line: 1, column: 27, index: 27 },
                        identifierName: "VUE_CARD_ID",
                      },
                      name: "VUE_CARD_ID",
                    },
                  },
                },
              ],
              kind: "const",
            },
          ],
          directives: [],
        },
        comments: [],
      };

      const expected = {
        type: "File",
        start: 0,
        end: 41,
        loc: {
          start: { line: 1, column: 0, index: 0 },
          end: { line: 2, column: 0, index: 41 },
        },
        errors: [],
        program: {
          type: "Program",
          start: 0,
          end: 41,
          loc: {},
          sourceType: "module",
          interpreter: null,
          body: [
            {
              type: "VariableDeclaration",
              start: 0,
              end: 39,
              loc: {
                start: { line: 1, column: 0, index: 0 },
                end: { line: 1, column: 39, index: 39 },
              },
              declarations: [
                {
                  type: "VariableDeclarator",
                  start: 6,
                  end: 38,
                  loc: {
                    start: { line: 1, column: 6, index: 6 },
                    end: { line: 1, column: 38, index: 38 },
                  },
                  id: {
                    type: "Identifier",
                    start: 6,
                    end: 12,
                    loc: {
                      end: { line: 1, column: 12, index: 12 },
                      identifierName: "config",
                    },
                    name: "config",
                  },
                  init: {
                    type: "MemberExpression",
                    object: {
                      type: "MemberExpression",
                      object: {
                        type: "MemberExpression",
                        object: { type: "Identifier", name: "import" },
                        property: { type: "Identifier", name: "meta" },
                        computed: false,
                        optional: null,
                      },
                      property: { type: "Identifier", name: "env" },
                      computed: false,
                      optional: null,
                    },
                    property: { type: "Identifier", name: "VITE_CARD_ID" },
                    computed: false,
                    optional: null,
                    trailingComments: [],
                    leadingComments: [],
                    innerComments: [],
                  },
                },
              ],
              kind: "const",
            },
          ],
          directives: [],
        },
        comments: [],
      };

      expect(await requireIsNotSupported(ast)).toStrictEqual(expected);
      expect(breakingChanges.increaseCount).toHaveBeenCalled();
    });
  });

  describe("componentMustHaveExtensionName()", () => {
    test("When the AST has a components object and a component import without an extension, should must add '.vue'", async () => {
      const ast = {
        type: "File",
        program: {
          type: "Program",
          body: [
            {
              type: "ExportDefaultDeclaration",
              declaration: {
                type: "ObjectExpression",
                properties: [
                  {
                    type: "ObjectProperty",
                    key: { type: "Identifier", name: "components" },
                    value: {
                      type: "ObjectExpression",
                      properties: [
                        {
                          type: "ObjectProperty",
                          key: { type: "Identifier", name: "ComponentA" },
                          value: { type: "Identifier", name: "ComponentA" },
                        },
                      ],
                    },
                  },
                ],
              },
            },
            {
              type: "ImportDeclaration",
              specifiers: [
                {
                  type: "ImportDefaultSpecifier",
                  local: { type: "Identifier", name: "ComponentA" },
                },
              ],
              source: {
                type: "StringLiteral",
                value: "./components/ComponentA",
              },
            },
          ],
        },
      };

      const expected = {
        type: "File",
        program: {
          type: "Program",
          body: [
            {
              type: "ExportDefaultDeclaration",
              declaration: {
                type: "ObjectExpression",
                properties: [
                  {
                    type: "ObjectProperty",
                    key: { type: "Identifier", name: "components" },
                    value: {
                      type: "ObjectExpression",
                      properties: [
                        {
                          type: "ObjectProperty",
                          key: { type: "Identifier", name: "ComponentA" },
                          value: { type: "Identifier", name: "ComponentA" },
                        },
                      ],
                    },
                  },
                ],
              },
            },
            {
              type: "ImportDeclaration",
              specifiers: [
                {
                  type: "ImportDefaultSpecifier",
                  local: { type: "Identifier", name: "ComponentA" },
                },
              ],
              source: {
                type: "StringLiteral",
                value: "./components/ComponentA.vue",
              },
              trailingComments: [],
              leadingComments: [],
              innerComments: [],
            },
          ],
        },
      };

      expect(await componentMustHaveExtensionName(ast)).toStrictEqual(expected);
      expect(breakingChanges.increaseCount).toHaveBeenCalled();
    });

    test("When the import already has an extension or is a Vue file, should not transform", async () => {
      const ast = {
        type: "File",
        program: {
          type: "Program",
          body: [
            {
              type: "ExportDefaultDeclaration",
              declaration: {
                type: "ObjectExpression",
                properties: [
                  {
                    type: "ObjectProperty",
                    key: { type: "Identifier", name: "components" },
                    value: {
                      type: "ObjectExpression",
                      properties: [
                        {
                          type: "ObjectProperty",
                          key: { type: "Identifier", name: "ComponentB" },
                          value: { type: "Identifier", name: "ComponentB" },
                        },
                      ],
                    },
                  },
                ],
              },
            },
            {
              type: "ImportDeclaration",
              specifiers: [
                {
                  type: "ImportDefaultSpecifier",
                  local: { type: "Identifier", name: "ComponentB" },
                },
              ],
              source: {
                type: "StringLiteral",
                value: "./components/ComponentB.vue",
              },
            },
          ],
        },
      };

      const expected = {
        type: "File",
        program: {
          type: "Program",
          body: [
            {
              type: "ExportDefaultDeclaration",
              declaration: {
                type: "ObjectExpression",
                properties: [
                  {
                    type: "ObjectProperty",
                    key: { type: "Identifier", name: "components" },
                    value: {
                      type: "ObjectExpression",
                      properties: [
                        {
                          type: "ObjectProperty",
                          key: { type: "Identifier", name: "ComponentB" },
                          value: { type: "Identifier", name: "ComponentB" },
                        },
                      ],
                    },
                  },
                ],
              },
            },
            {
              type: "ImportDeclaration",
              specifiers: [
                {
                  type: "ImportDefaultSpecifier",
                  local: { type: "Identifier", name: "ComponentB" },
                },
              ],
              source: {
                type: "StringLiteral",
                value: "./components/ComponentB.vue",
              },
            },
          ],
        },
      };

      expect(await componentMustHaveExtensionName(ast)).toStrictEqual(expected);
      expect(breakingChanges.increaseCount).not.toHaveBeenCalled();
    });
  });
});
