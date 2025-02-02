const {
  getModeType,
  createRouter,
} = require("../../../../../src/operations/transformer/router/script/index");
const { parse } = require("@babel/parser");

const stateManager = require("../../../../../src/singletons/stateManager");
const breakingChanges = require("../../../../../src/singletons/breakingChanges");

jest.mock("../../../../../src/singletons/breakingChanges");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("=> operations/transformer/router/script/index.js", () => {
  describe("getModeType()", () => {
    test("When passes a history mode, should return 'createWebHistory'.", () => {
      expect(getModeType("history")).toBe("createWebHistory");
    });

    test("When passes a hash mode, should return 'createWebHashHistory'.", () => {
      expect(getModeType("hash")).toBe("createWebHashHistory");
    });

    test("When passes a abstract mode, should return 'createMemoryHistory'.", () => {
      expect(getModeType("abstract")).toBe("createMemoryHistory");
    });

    test("When do not passes mode, should return 'createWebHistory' as default.", () => {
      expect(getModeType()).toBe("createWebHistory");
    });
  });

  describe("createRouter()", () => {
    test("When passes an ast with new Vuex.VueRouter, should apply transformer for createRouter.", async () => {
      const spyGet = jest
        .spyOn(stateManager, "get")
        .mockReturnValue({ value: "history" });
      const spySet = jest.spyOn(stateManager, "set");

      const ast = {
        type: "File",
        start: 0,
        end: 332,
        loc: {
          start: { line: 1, column: 0, index: 0 },
          end: { line: 22, column: 0, index: 332 },
        },
        errors: [],
        program: {
          type: "Program",
          start: 0,
          end: 332,
          sourceType: "module",
          interpreter: null,
          body: [
            {
              type: "ImportDeclaration",
              start: 23,
              end: 58,
              loc: {
                start: { line: 2, column: 0, index: 23 },
                end: { line: 2, column: 35, index: 58 },
              },
              specifiers: [
                {
                  type: "ImportDefaultSpecifier",
                  start: 30,
                  end: 39,
                  loc: {
                    start: { line: 2, column: 7, index: 30 },
                    end: { line: 2, column: 16, index: 39 },
                  },
                  local: {
                    type: "Identifier",
                    start: 30,
                    end: 39,
                    name: "VueRouter",
                  },
                },
              ],
              source: {
                type: "StringLiteral",
                start: 45,
                end: 57,
                loc: {
                  start: { line: 2, column: 22, index: 45 },
                  end: { line: 2, column: 34, index: 57 },
                },
                extra: { rawValue: "vue-router", raw: "'vue-router'" },
                value: "vue-router",
              },
            },
            {
              type: "ImportDeclaration",
              start: 59,
              end: 101,
              loc: {
                start: { line: 3, column: 0, index: 59 },
                end: { line: 3, column: 42, index: 101 },
              },
              specifiers: [
                {
                  type: "ImportDefaultSpecifier",
                  start: 66,
                  end: 73,
                  loc: {
                    start: { line: 3, column: 7, index: 66 },
                    end: { line: 3, column: 14, index: 73 },
                  },
                  local: {
                    type: "Identifier",
                    start: 66,
                    end: 73,
                    name: "Pokedex",
                  },
                },
              ],
              source: {
                type: "StringLiteral",
                start: 79,
                end: 100,
                loc: {
                  start: { line: 3, column: 20, index: 79 },
                  end: { line: 3, column: 41, index: 100 },
                },
                extra: {
                  rawValue: "@/views/Pokedex.vue",
                  raw: "'@/views/Pokedex.vue'",
                },
                value: "@/views/Pokedex.vue",
              },
            },
            {
              type: "VariableDeclaration",
              start: 124,
              end: 212,
              loc: {
                start: { line: 7, column: 0, index: 124 },
                end: { line: 13, column: 2, index: 212 },
              },
              declarations: [
                {
                  type: "VariableDeclarator",
                  start: 130,
                  end: 211,
                  loc: {
                    start: { line: 7, column: 6, index: 130 },
                    end: { line: 13, column: 1, index: 211 },
                  },
                  id: {
                    type: "Identifier",
                    start: 130,
                    end: 136,
                    name: "routes",
                  },
                  init: {
                    type: "ArrayExpression",
                    start: 139,
                    end: 211,
                    loc: { start: { line: 7, column: 15, index: 139 } },
                    extra: { trailingComma: 208 },
                    elements: [
                      {
                        type: "ObjectExpression",
                        start: 143,
                        end: 208,
                        loc: {
                          start: { line: 8, column: 2, index: 143 },
                          end: { line: 12, column: 3, index: 208 },
                        },
                        properties: [
                          {
                            type: "ObjectProperty",
                            start: 149,
                            end: 158,
                            loc: {
                              start: { line: 9, column: 4, index: 149 },
                              end: { line: 9, column: 13, index: 158 },
                            },
                            method: false,
                            key: {
                              type: "Identifier",
                              start: 149,
                              end: 153,
                              name: "path",
                            },
                            computed: false,
                            shorthand: false,
                            value: {
                              type: "StringLiteral",
                              start: 155,
                              end: 158,
                              loc: {
                                start: { line: 9, column: 10, index: 155 },
                              },
                              extra: { rawValue: "/", raw: "'/'" },
                              value: "/",
                            },
                          },
                          {
                            type: "ObjectProperty",
                            start: 164,
                            end: 179,
                            loc: {
                              start: { line: 10, column: 4, index: 164 },
                              end: { line: 10, column: 19, index: 179 },
                            },
                            method: false,
                            key: {
                              type: "Identifier",
                              start: 164,
                              end: 168,
                              name: "name",
                            },
                            computed: false,
                            shorthand: false,
                            value: {
                              type: "StringLiteral",
                              start: 170,
                              end: 179,
                              loc: {
                                start: { line: 10, column: 10, index: 170 },
                              },
                              extra: { rawValue: "Pokedex", raw: "'Pokedex'" },
                              value: "Pokedex",
                            },
                          },
                          {
                            type: "ObjectProperty",
                            start: 185,
                            end: 203,
                            loc: {
                              start: { line: 11, column: 4, index: 185 },
                              end: { line: 11, column: 22, index: 203 },
                            },
                            method: false,
                            key: {
                              type: "Identifier",
                              start: 185,
                              end: 194,
                              name: "component",
                            },
                            computed: false,
                            shorthand: false,
                            value: {
                              type: "Identifier",
                              start: 196,
                              end: 203,
                              loc: {
                                start: { line: 11, column: 15, index: 196 },
                                identifierName: "Pokedex",
                              },
                              name: "Pokedex",
                            },
                          },
                        ],
                        extra: { trailingComma: 203 },
                      },
                    ],
                  },
                },
              ],
              kind: "const",
            },
            {
              type: "VariableDeclaration",
              start: 214,
              end: 307,
              loc: {
                start: { line: 15, column: 0, index: 214 },
                end: { line: 19, column: 3, index: 307 },
              },
              declarations: [
                {
                  type: "VariableDeclarator",
                  start: 220,
                  end: 306,
                  loc: {
                    start: { line: 15, column: 6, index: 220 },
                    end: { line: 19, column: 2, index: 306 },
                  },
                  id: {
                    type: "Identifier",
                    start: 220,
                    end: 226,
                    name: "router",
                  },
                  init: {
                    type: "NewExpression",
                    start: 229,
                    end: 306,
                    loc: { start: { line: 15, column: 15, index: 229 } },
                    callee: {
                      type: "Identifier",
                      start: 233,
                      end: 242,
                      loc: {
                        start: { line: 15, column: 19, index: 233 },
                        end: { line: 15, column: 28, index: 242 },
                        identifierName: "VueRouter",
                      },
                      name: "VueRouter",
                    },
                    arguments: [
                      {
                        type: "ObjectExpression",
                        start: 243,
                        end: 305,
                        loc: {
                          start: { line: 15, column: 29, index: 243 },
                          end: { line: 19, column: 1, index: 305 },
                        },
                        properties: [
                          {
                            type: "ObjectProperty",
                            start: 247,
                            end: 262,
                            loc: {
                              start: { line: 16, column: 2, index: 247 },
                              end: { line: 16, column: 17, index: 262 },
                            },
                            method: false,
                            key: {
                              type: "Identifier",
                              start: 247,
                              end: 251,
                              name: "mode",
                            },
                            computed: false,
                            shorthand: false,
                            value: {
                              type: "StringLiteral",
                              start: 253,
                              end: 262,
                              loc: {
                                start: { line: 16, column: 8, index: 253 },
                              },
                              extra: { rawValue: "history", raw: "'history'" },
                              value: "history",
                            },
                          },
                          {
                            type: "ObjectProperty",
                            start: 266,
                            end: 292,
                            loc: {
                              start: { line: 17, column: 2, index: 266 },
                              end: { line: 17, column: 28, index: 292 },
                            },
                            method: false,
                            key: {
                              type: "Identifier",
                              start: 266,
                              end: 270,
                              name: "base",
                            },
                            computed: false,
                            shorthand: false,
                            value: {
                              type: "MemberExpression",
                              object: {
                                type: "MemberExpression",
                                object: {
                                  type: "MemberExpression",
                                  object: {
                                    type: "Identifier",
                                    name: "import",
                                  },
                                  property: {
                                    type: "Identifier",
                                    name: "meta",
                                  },
                                  computed: false,
                                  optional: null,
                                },
                                property: { type: "Identifier", name: "env" },
                                computed: false,
                                optional: null,
                              },
                              property: {
                                type: "Identifier",
                                name: "BASE_URL",
                              },
                              computed: false,
                              optional: null,
                              trailingComments: [],
                              leadingComments: [],
                              innerComments: [],
                            },
                          },
                          {
                            type: "ObjectProperty",
                            start: 296,
                            end: 302,
                            loc: {
                              start: { line: 18, column: 2, index: 296 },
                              end: { line: 18, column: 8, index: 302 },
                            },
                            method: false,
                            key: {
                              type: "Identifier",
                              start: 296,
                              end: 302,
                              name: "routes",
                            },
                            computed: false,
                            shorthand: true,
                            value: {
                              type: "Identifier",
                              start: 296,
                              end: 302,
                              name: "routes",
                            },
                            extra: { shorthand: true },
                          },
                        ],
                        extra: { trailingComma: 302 },
                      },
                    ],
                  },
                },
              ],
              kind: "const",
            },
            {
              type: "ExportDefaultDeclaration",
              start: 309,
              end: 331,
              loc: {
                start: { line: 21, column: 0, index: 309 },
                end: { line: 21, column: 22, index: 331 },
              },
              declaration: {
                type: "Identifier",
                start: 324,
                end: 330,
                loc: {
                  start: { line: 21, column: 15, index: 324 },
                  end: { line: 21, column: 21, index: 330 },
                  identifierName: "router",
                },
                name: "router",
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
        end: 332,
        loc: {
          start: { line: 1, column: 0, index: 0 },
          end: { line: 22, column: 0, index: 332 },
        },
        errors: [],
        program: {
          type: "Program",
          start: 0,
          end: 332,
          sourceType: "module",
          interpreter: null,
          body: [
            {
              value: "history",
            },
            {
              type: "ImportDeclaration",
              start: 59,
              end: 101,
              loc: {
                start: { line: 3, column: 0, index: 59 },
                end: { line: 3, column: 42, index: 101 },
              },
              specifiers: [
                {
                  type: "ImportDefaultSpecifier",
                  start: 66,
                  end: 73,
                  loc: {
                    start: { line: 3, column: 7, index: 66 },
                    end: { line: 3, column: 14, index: 73 },
                  },
                  local: {
                    type: "Identifier",
                    start: 66,
                    end: 73,
                    name: "Pokedex",
                  },
                },
              ],
              source: {
                type: "StringLiteral",
                start: 79,
                end: 100,
                loc: {
                  start: { line: 3, column: 20, index: 79 },
                  end: { line: 3, column: 41, index: 100 },
                },
                extra: {
                  rawValue: "@/views/Pokedex.vue",
                  raw: "'@/views/Pokedex.vue'",
                },
                value: "@/views/Pokedex.vue",
              },
            },
            {
              type: "VariableDeclaration",
              start: 124,
              end: 212,
              loc: {
                start: { line: 7, column: 0, index: 124 },
                end: { line: 13, column: 2, index: 212 },
              },
              declarations: [
                {
                  type: "VariableDeclarator",
                  start: 130,
                  end: 211,
                  loc: {
                    start: { line: 7, column: 6, index: 130 },
                    end: { line: 13, column: 1, index: 211 },
                  },
                  id: {
                    type: "Identifier",
                    start: 130,
                    end: 136,
                    name: "routes",
                  },
                  init: {
                    type: "ArrayExpression",
                    start: 139,
                    end: 211,
                    loc: { start: { line: 7, column: 15, index: 139 } },
                    extra: { trailingComma: 208 },
                    elements: [
                      {
                        type: "ObjectExpression",
                        start: 143,
                        end: 208,
                        loc: {
                          start: { line: 8, column: 2, index: 143 },
                          end: { line: 12, column: 3, index: 208 },
                        },
                        properties: [
                          {
                            type: "ObjectProperty",
                            start: 149,
                            end: 158,
                            loc: {
                              start: { line: 9, column: 4, index: 149 },
                              end: { line: 9, column: 13, index: 158 },
                            },
                            method: false,
                            key: {
                              type: "Identifier",
                              start: 149,
                              end: 153,
                              name: "path",
                            },
                            computed: false,
                            shorthand: false,
                            value: {
                              type: "StringLiteral",
                              start: 155,
                              end: 158,
                              loc: {
                                start: { line: 9, column: 10, index: 155 },
                              },
                              extra: { rawValue: "/", raw: "'/'" },
                              value: "/",
                            },
                          },
                          {
                            type: "ObjectProperty",
                            start: 164,
                            end: 179,
                            loc: {
                              start: { line: 10, column: 4, index: 164 },
                              end: { line: 10, column: 19, index: 179 },
                            },
                            method: false,
                            key: {
                              type: "Identifier",
                              start: 164,
                              end: 168,
                              name: "name",
                            },
                            computed: false,
                            shorthand: false,
                            value: {
                              type: "StringLiteral",
                              start: 170,
                              end: 179,
                              loc: {
                                start: { line: 10, column: 10, index: 170 },
                              },
                              extra: { rawValue: "Pokedex", raw: "'Pokedex'" },
                              value: "Pokedex",
                            },
                          },
                          {
                            type: "ObjectProperty",
                            start: 185,
                            end: 203,
                            loc: {
                              start: { line: 11, column: 4, index: 185 },
                              end: { line: 11, column: 22, index: 203 },
                            },
                            method: false,
                            key: {
                              type: "Identifier",
                              start: 185,
                              end: 194,
                              name: "component",
                            },
                            computed: false,
                            shorthand: false,
                            value: {
                              type: "Identifier",
                              start: 196,
                              end: 203,
                              loc: {
                                start: { line: 11, column: 15, index: 196 },
                                identifierName: "Pokedex",
                              },
                              name: "Pokedex",
                            },
                          },
                        ],
                        extra: { trailingComma: 203 },
                      },
                    ],
                  },
                },
              ],
              kind: "const",
            },
            {
              type: "VariableDeclaration",
              start: 214,
              end: 307,
              loc: {
                start: { line: 15, column: 0, index: 214 },
                end: { line: 19, column: 3, index: 307 },
              },
              declarations: [
                {
                  type: "VariableDeclarator",
                  start: 220,
                  end: 306,
                  loc: {
                    start: { line: 15, column: 6, index: 220 },
                    end: { line: 19, column: 2, index: 306 },
                  },
                  id: {
                    type: "Identifier",
                    start: 220,
                    end: 226,
                    name: "router",
                  },
                  init: {
                    innerComments: [],
                    leadingComments: [],
                    trailingComments: [],
                    type: "CallExpression",
                    callee: {
                      type: "Identifier",
                      name: "createRouter",
                    },
                    arguments: [
                      {
                        type: "ObjectExpression",
                        start: 243,
                        end: 305,
                        loc: {
                          start: { line: 15, column: 29, index: 243 },
                          end: { line: 19, column: 1, index: 305 },
                        },
                        properties: [
                          {
                            type: "ObjectProperty",
                            computed: false,
                            decorators: null,
                            key: {
                              name: "history",
                              type: "Identifier",
                            },
                            shorthand: false,
                            type: "ObjectProperty",
                            value: {
                              arguments: [
                                {
                                  computed: false,
                                  innerComments: [],
                                  leadingComments: [],
                                  object: {
                                    computed: false,
                                    object: {
                                      computed: false,
                                      object: {
                                        name: "import",
                                        type: "Identifier",
                                      },
                                      optional: null,
                                      property: {
                                        name: "meta",
                                        type: "Identifier",
                                      },
                                      type: "MemberExpression",
                                    },
                                    optional: null,
                                    property: {
                                      name: "env",
                                      type: "Identifier",
                                    },
                                    type: "MemberExpression",
                                  },
                                  optional: null,
                                  property: {
                                    name: "BASE_URL",
                                    type: "Identifier",
                                  },
                                  trailingComments: [],
                                  type: "MemberExpression",
                                },
                              ],
                              callee: {
                                name: "createWebHistory",
                                type: "Identifier",
                              },
                              type: "CallExpression",
                            },
                          },
                          {
                            computed: false,
                            key: {
                              type: "Identifier",
                              name: "history",
                            },
                            computed: false,
                            shorthand: false,
                            value: {
                              arguments: [
                                {
                                  type: "MemberExpression",
                                  object: {
                                    type: "MemberExpression",
                                    object: {
                                      type: "MemberExpression",
                                      object: {
                                        type: "Identifier",
                                        name: "import",
                                      },
                                      property: {
                                        type: "Identifier",
                                        name: "meta",
                                      },
                                      computed: false,
                                      optional: null,
                                    },
                                    property: {
                                      type: "Identifier",
                                      name: "env",
                                    },
                                    computed: false,
                                    optional: null,
                                  },
                                  property: {
                                    type: "Identifier",
                                    name: "BASE_URL",
                                  },
                                  computed: false,
                                  optional: null,
                                  trailingComments: [],
                                  leadingComments: [],
                                  innerComments: [],
                                },
                              ],
                            },
                            type: "ObjectProperty",
                            start: 296,
                            end: 302,
                            loc: {
                              start: { line: 18, column: 2, index: 296 },
                              end: { line: 18, column: 8, index: 302 },
                            },
                            method: false,
                            key: {
                              type: "Identifier",
                              start: 296,
                              end: 302,
                              name: "routes",
                            },
                            computed: false,
                            shorthand: true,
                            value: {
                              type: "Identifier",
                              start: 296,
                              end: 302,
                              name: "routes",
                            },
                            extra: { shorthand: true },
                          },
                        ],
                        extra: { trailingComma: 302 },
                      },
                    ],
                  },
                },
              ],
              kind: "const",
            },
            {
              type: "ExportDefaultDeclaration",
              start: 309,
              end: 331,
              loc: {
                start: { line: 21, column: 0, index: 309 },
                end: { line: 21, column: 22, index: 331 },
              },
              declaration: {
                type: "Identifier",
                start: 324,
                end: 330,
                loc: {
                  start: { line: 21, column: 15, index: 324 },
                  end: { line: 21, column: 21, index: 330 },
                  identifierName: "router",
                },
                name: "router",
              },
            },
          ],
          directives: [],
        },
        comments: [],
      };

      expect(await createRouter(ast)).toStrictEqual(expected);
      expect(spySet).toHaveBeenCalled();
      expect(spyGet).toHaveBeenCalled();
      expect(breakingChanges.increaseCount).toHaveBeenCalled();

      spyGet.mockRestore();
      spySet.mockRestore();
    });
  });
});
