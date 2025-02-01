const {
  createStore,
} = require("../../../../../src/operations/transformer/vuex/script/index");

const stateManager = require("../../../../../src/singletons/stateManager");
const breakingChanges = require("../../../../../src/singletons/breakingChanges");

jest.mock("../../../../../src/singletons/breakingChanges");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("=> operations/transformer/vuex/script/index.js", () => {
  describe("createStore()", () => {
    test("When passes an ast wuth new Vuex.Store, should apply transformer for createStore.", async () => {
      const spyGet = jest.spyOn(stateManager, "get");
      const spySet = jest.spyOn(stateManager, "set");

      const ast = {
        type: "File",
        start: 0,
        end: 175,
        loc: {
          start: { line: 1, column: 0, index: 0 },
          end: { line: 12, column: 0, index: 175 },
        },
        errors: [],
        program: {
          type: "Program",
          start: 0,
          end: 175,
          loc: {},
          sourceType: "module",
          interpreter: null,
          body: [
            {
              type: "ImportDeclaration",
              start: 0,
              end: 22,
              loc: {
                start: { line: 1, column: 0, index: 0 },
                end: { line: 1, column: 22, index: 22 },
              },
              specifiers: [
                {
                  type: "ImportDefaultSpecifier",
                  start: 7,
                  end: 10,
                  loc: {
                    start: { line: 1, column: 7, index: 7 },
                    end: { line: 1, column: 10, index: 10 },
                  },
                  local: {
                    type: "Identifier",
                    start: 7,
                    end: 10,
                    loc: { identifierName: "Vue" },
                    name: "Vue",
                  },
                },
              ],
              source: {
                type: "StringLiteral",
                start: 16,
                end: 21,
                loc: {
                  start: { line: 1, column: 16, index: 16 },
                  end: { line: 1, column: 21, index: 21 },
                },
                extra: { rawValue: "vue", raw: '"vue"' },
                value: "vue",
              },
            },
            {
              type: "ImportDeclaration",
              start: 24,
              end: 48,
              loc: {
                start: { line: 2, column: 0, index: 24 },
                end: { line: 2, column: 24, index: 48 },
              },
              specifiers: [
                {
                  type: "ImportDefaultSpecifier",
                  start: 31,
                  end: 35,
                  loc: {
                    start: { line: 2, column: 7, index: 31 },
                    end: { line: 2, column: 11, index: 35 },
                  },
                  local: {
                    type: "Identifier",
                    start: 31,
                    end: 35,
                    loc: { identifierName: "Vuex" },
                    name: "Vuex",
                  },
                },
              ],
              source: {
                type: "StringLiteral",
                start: 41,
                end: 47,
                loc: {
                  start: { line: 2, column: 17, index: 41 },
                  end: { line: 2, column: 23, index: 47 },
                },
                extra: { rawValue: "vuex", raw: '"vuex"' },
                value: "vuex",
              },
            },
            {
              type: "ImportDeclaration",
              start: 50,
              end: 84,
              loc: {
                start: { line: 3, column: 0, index: 50 },
                end: { line: 3, column: 34, index: 84 },
              },
              specifiers: [
                {
                  type: "ImportDefaultSpecifier",
                  start: 57,
                  end: 61,
                  loc: {
                    start: { line: 3, column: 7, index: 57 },
                    end: { line: 3, column: 11, index: 61 },
                  },
                  local: {
                    type: "Identifier",
                    start: 57,
                    end: 61,
                    loc: { identifierName: "card" },
                    name: "card",
                  },
                },
              ],
              source: {
                type: "StringLiteral",
                start: 67,
                end: 83,
                loc: {
                  start: { line: 3, column: 17, index: 67 },
                  end: { line: 3, column: 33, index: 83 },
                },
                extra: {
                  rawValue: "./modules/card",
                  raw: '"./modules/card"',
                },
                value: "./modules/card",
              },
            },
            {
              type: "ExpressionStatement",
              start: 88,
              end: 102,
              loc: {
                start: { line: 5, column: 0, index: 88 },
                end: { line: 5, column: 14, index: 102 },
              },
              expression: {
                type: "CallExpression",
                start: 88,
                end: 101,
                loc: { end: { line: 5, column: 13, index: 101 } },
                callee: {
                  type: "MemberExpression",
                  start: 88,
                  end: 95,
                  loc: { end: { line: 5, column: 7, index: 95 } },
                  object: {
                    type: "Identifier",
                    start: 88,
                    end: 91,
                    loc: {
                      end: { line: 5, column: 3, index: 91 },
                      identifierName: "Vue",
                    },
                    name: "Vue",
                  },
                  computed: false,
                  property: {
                    type: "Identifier",
                    start: 92,
                    end: 95,
                    loc: {
                      start: { line: 5, column: 4, index: 92 },
                      identifierName: "use",
                    },
                    name: "use",
                  },
                },
                arguments: [
                  {
                    type: "Identifier",
                    start: 96,
                    end: 100,
                    loc: {
                      start: { line: 5, column: 8, index: 96 },
                      end: { line: 5, column: 12, index: 100 },
                      identifierName: "Vuex",
                    },
                    name: "Vuex",
                  },
                ],
              },
            },
            {
              type: "ExportDefaultDeclaration",
              start: 106,
              end: 173,
              loc: {
                start: { line: 7, column: 0, index: 106 },
                end: { line: 11, column: 3, index: 173 },
              },
              declaration: {
                type: "NewExpression",
                start: 121,
                end: 172,
                loc: {
                  start: { line: 7, column: 15, index: 121 },
                  end: { line: 11, column: 2, index: 172 },
                },
                callee: {
                  type: "MemberExpression",
                  start: 125,
                  end: 135,
                  loc: {
                    start: { line: 7, column: 19, index: 125 },
                    end: { line: 7, column: 29, index: 135 },
                  },
                  object: {
                    type: "Identifier",
                    start: 125,
                    end: 129,
                    loc: {
                      end: { line: 7, column: 23, index: 129 },
                      identifierName: "Vuex",
                    },
                    name: "Vuex",
                  },
                  computed: false,
                  property: {
                    type: "Identifier",
                    start: 130,
                    end: 135,
                    loc: {
                      start: { line: 7, column: 24, index: 130 },
                      identifierName: "Store",
                    },
                    name: "Store",
                  },
                },
                arguments: [
                  {
                    type: "ObjectExpression",
                    start: 136,
                    end: 171,
                    loc: {
                      start: { line: 7, column: 30, index: 136 },
                      end: { line: 11, column: 1, index: 171 },
                    },
                    properties: [
                      {
                        type: "ObjectProperty",
                        start: 141,
                        end: 167,
                        loc: {
                          start: { line: 8, column: 2, index: 141 },
                          end: { line: 10, column: 3, index: 167 },
                        },
                        method: false,
                        key: {
                          type: "Identifier",
                          start: 141,
                          end: 148,
                          loc: {
                            end: { line: 8, column: 9, index: 148 },
                            identifierName: "modules",
                          },
                          name: "modules",
                        },
                        computed: false,
                        shorthand: false,
                        value: {
                          type: "ObjectExpression",
                          start: 150,
                          end: 167,
                          loc: { start: { line: 8, column: 11, index: 150 } },
                          properties: [
                            {
                              type: "ObjectProperty",
                              start: 157,
                              end: 161,
                              loc: {
                                start: { line: 9, column: 4, index: 157 },
                                end: { line: 9, column: 8, index: 161 },
                              },
                              method: false,
                              key: {
                                type: "Identifier",
                                start: 157,
                                end: 161,
                                loc: { identifierName: "card" },
                                name: "card",
                              },
                              computed: false,
                              shorthand: true,
                              value: {
                                type: "Identifier",
                                start: 157,
                                end: 161,
                                name: "card",
                              },
                              extra: { shorthand: true },
                            },
                          ],
                          extra: { trailingComma: 161 },
                        },
                      },
                    ],
                    extra: { trailingComma: 167 },
                  },
                ],
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
        end: 175,
        loc: {
          start: { line: 1, column: 0, index: 0 },
          end: { line: 12, column: 0, index: 175 },
        },
        errors: [],
        program: {
          type: "Program",
          start: 0,
          end: 175,
          loc: {},
          sourceType: "module",
          interpreter: null,
          body: [
            {
              type: "ImportDeclaration",
              specifiers: [
                {
                  type: "ImportSpecifier",
                  local: { type: "Identifier", name: "createStore" },
                  imported: { type: "Identifier", name: "createStore" },
                },
              ],
              source: { type: "StringLiteral", value: "vuex" },
            },
            {
              type: "ImportDeclaration",
              start: 0,
              end: 22,
              loc: {
                start: { line: 1, column: 0, index: 0 },
                end: { line: 1, column: 22, index: 22 },
              },
              specifiers: [
                {
                  type: "ImportDefaultSpecifier",
                  start: 7,
                  end: 10,
                  loc: {
                    start: { line: 1, column: 7, index: 7 },
                    end: { line: 1, column: 10, index: 10 },
                  },
                  local: {
                    type: "Identifier",
                    start: 7,
                    end: 10,
                    loc: { identifierName: "Vue" },
                    name: "Vue",
                  },
                },
              ],
              source: {
                type: "StringLiteral",
                start: 16,
                end: 21,
                loc: {
                  start: { line: 1, column: 16, index: 16 },
                  end: { line: 1, column: 21, index: 21 },
                },
                extra: { rawValue: "vue", raw: '"vue"' },
                value: "vue",
              },
            },
            {
              type: "ImportDeclaration",
              start: 50,
              end: 84,
              loc: {
                start: { line: 3, column: 0, index: 50 },
                end: { line: 3, column: 34, index: 84 },
              },
              specifiers: [
                {
                  type: "ImportDefaultSpecifier",
                  start: 57,
                  end: 61,
                  loc: {
                    start: { line: 3, column: 7, index: 57 },
                    end: { line: 3, column: 11, index: 61 },
                  },
                  local: {
                    type: "Identifier",
                    start: 57,
                    end: 61,
                    loc: { identifierName: "card" },
                    name: "card",
                  },
                },
              ],
              source: {
                type: "StringLiteral",
                start: 67,
                end: 83,
                loc: {
                  start: { line: 3, column: 17, index: 67 },
                  end: { line: 3, column: 33, index: 83 },
                },
                extra: { rawValue: "./modules/card", raw: '"./modules/card"' },
                value: "./modules/card",
              },
            },
            {
              type: "ExpressionStatement",
              start: 88,
              end: 102,
              loc: {
                start: { line: 5, column: 0, index: 88 },
                end: { line: 5, column: 14, index: 102 },
              },
              expression: {
                type: "CallExpression",
                start: 88,
                end: 101,
                loc: { end: { line: 5, column: 13, index: 101 } },
                callee: {
                  type: "MemberExpression",
                  start: 88,
                  end: 95,
                  loc: { end: { line: 5, column: 7, index: 95 } },
                  object: {
                    type: "Identifier",
                    start: 88,
                    end: 91,
                    loc: {
                      end: { line: 5, column: 3, index: 91 },
                      identifierName: "Vue",
                    },
                    name: "Vue",
                  },
                  computed: false,
                  property: {
                    type: "Identifier",
                    start: 92,
                    end: 95,
                    loc: {
                      start: { line: 5, column: 4, index: 92 },
                      identifierName: "use",
                    },
                    name: "use",
                  },
                },
                arguments: [
                  {
                    type: "Identifier",
                    start: 96,
                    end: 100,
                    loc: {
                      start: { line: 5, column: 8, index: 96 },
                      end: { line: 5, column: 12, index: 100 },
                      identifierName: "Vuex",
                    },
                    name: "Vuex",
                  },
                ],
              },
            },
            {
              type: "ExportDefaultDeclaration",
              start: 106,
              end: 173,
              loc: {
                start: { line: 7, column: 0, index: 106 },
                end: { line: 11, column: 3, index: 173 },
              },
              declaration: {
                type: "CallExpression",
                callee: { type: "Identifier", name: "createStore" },
                arguments: [
                  {
                    type: "ObjectExpression",
                    start: 136,
                    end: 171,
                    loc: {
                      start: { line: 7, column: 30, index: 136 },
                      end: { line: 11, column: 1, index: 171 },
                    },
                    properties: [
                      {
                        type: "ObjectProperty",
                        start: 141,
                        end: 167,
                        loc: {
                          start: { line: 8, column: 2, index: 141 },
                          end: { line: 10, column: 3, index: 167 },
                        },
                        method: false,
                        key: {
                          type: "Identifier",
                          start: 141,
                          end: 148,
                          loc: {
                            end: { line: 8, column: 9, index: 148 },
                            identifierName: "modules",
                          },
                          name: "modules",
                        },
                        computed: false,
                        shorthand: false,
                        value: {
                          type: "ObjectExpression",
                          start: 150,
                          end: 167,
                          loc: { start: { line: 8, column: 11, index: 150 } },
                          properties: [
                            {
                              type: "ObjectProperty",
                              start: 157,
                              end: 161,
                              loc: {
                                start: { line: 9, column: 4, index: 157 },
                                end: { line: 9, column: 8, index: 161 },
                              },
                              method: false,
                              key: {
                                type: "Identifier",
                                start: 157,
                                end: 161,
                                loc: { identifierName: "card" },
                                name: "card",
                              },
                              computed: false,
                              shorthand: true,
                              value: {
                                type: "Identifier",
                                start: 157,
                                end: 161,
                                name: "card",
                              },
                              extra: { shorthand: true },
                            },
                          ],
                          extra: { trailingComma: 161 },
                        },
                      },
                    ],
                    extra: { trailingComma: 167 },
                  },
                ],
                trailingComments: [],
                leadingComments: [],
                innerComments: [],
              },
            },
          ],
          directives: [],
        },
        comments: [],
      };

      expect(await createStore(ast)).toStrictEqual(expected);
      expect(spySet).toHaveBeenCalledWith("importVuex", {
        source: { type: "StringLiteral", value: "vuex" },
        specifiers: [
          {
            imported: { name: "createStore", type: "Identifier" },
            local: { name: "createStore", type: "Identifier" },
            type: "ImportSpecifier",
          },
        ],
        type: "ImportDeclaration",
      });
      expect(spyGet).toHaveBeenCalledWith("importVuex");
      expect(breakingChanges.increaseCount).toHaveBeenCalled();

      spyGet.mockRestore();
      spySet.mockRestore();
    });
  });
});
