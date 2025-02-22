const {
  setDefaultLoc,
  existenceCheckerForRules,
  globalApiNewVue,
  destroyedToUnmouted,
  beforeDestroyToBeforeUnmount,
  dataOptions,
  filters,
} = require("../../../../../src/operations/transformer/vue/script/index");

const breakingChanges = require("../../../../../src/singletons/breakingChanges");
const existenceChecker = require("../../../../../src/singletons/existenceChecker");
const stateManager = require("../../../../../src/singletons/stateManager");
const t = require("@babel/types");

breakingChanges.increaseCount = jest.fn();
stateManager.get = jest.fn();
stateManager.set = jest.fn();
stateManager.getState = jest.fn().mockReturnValue({});

describe("=> operations/transformer/vuex/script/index.js", () => {
  describe("setDefaultLoc()", () => {
    test("When passes an ast without loc values, should add default values.", () => {
      const ast = {
        type: "Program",
        body: [{ type: "ExpressionStatement" }],
      };

      const expected = {
        type: "Program",
        body: [
          {
            type: "ExpressionStatement",
            loc: {
              start: { line: 0, column: 0 },
              end: { line: 0, column: 0 },
            },
          },
        ],
      };

      expect(setDefaultLoc(ast)).toStrictEqual(expected);
    });

    test("When passes an ast with loc values, should not set default values.", () => {
      const ast = {
        type: "Program",
        body: [
          {
            type: "ExpressionStatement",
            loc: {
              start: { line: 123, column: 4 },
              end: { line: 32, column: 6 },
            },
          },
        ],
      };

      const expected = {
        type: "Program",
        body: [
          {
            type: "ExpressionStatement",
            loc: {
              start: { line: 123, column: 4 },
              end: { line: 32, column: 6 },
            },
          },
        ],
      };

      expect(setDefaultLoc(ast)).toStrictEqual(expected);
    });
  });

  describe("existenceCheckerForRules()", () => {
    test("ImportDeclaration()", () => {
      const astVue = {
        type: "Program",
        body: [
          {
            type: "ImportDeclaration",
            source: {
              type: "StringLiteral",
              value: "vue",
            },
          },
        ],
      };

      const astVuex = {
        type: "Program",
        body: [
          {
            type: "ImportDeclaration",
            source: {
              type: "StringLiteral",
              value: "vuex",
            },
          },
        ],
      };

      const astVueRouter = {
        type: "Program",
        body: [
          {
            type: "ImportDeclaration",
            source: {
              type: "StringLiteral",
              value: "vue-router",
            },
          },
        ],
      };

      existenceCheckerForRules(astVue);
      existenceCheckerForRules(astVuex);
      existenceCheckerForRules(astVueRouter);

      expect(existenceChecker.getState().importVue).toBe(true);
      expect(existenceChecker.getState().importVuex).toBe(true);
      expect(existenceChecker.getState().importVueRouter).toBe(true);
    });

    test("NewExpression()", () => {
      const spySetExistenceChecker = jest.spyOn(existenceChecker, "set");
      const spySetStateManager = jest.spyOn(stateManager, "set");

      const astVue = {
        type: "Program",
        body: [
          {
            type: "ExpressionStatement",
            expression: {
              type: "NewExpression",
              callee: { type: "Identifier", name: "Vue" },
              arguments: [
                {
                  type: "ObjectExpression",
                  properties: [
                    {
                      type: "ObjectProperty",
                      key: { type: "Identifier", name: "render" },
                      value: { type: "StringLiteral", value: "dummy" },
                      computed: false,
                      shorthand: false,
                      decorators: null,
                    },
                  ],
                },
              ],
            },
          },
        ],
        directives: [],
        sourceType: "script",
        interpreter: null,
      };

      const astVueRouter = {
        type: "Program",
        body: [
          {
            type: "ExpressionStatement",
            expression: {
              type: "NewExpression",
              callee: { type: "Identifier", name: "VueRouter" },
              arguments: [
                {
                  type: "ObjectExpression",
                  properties: [
                    {
                      type: "ObjectProperty",
                      key: { type: "Identifier", name: "mode" },
                      value: { type: "StringLiteral", value: "history" },
                      computed: false,
                      shorthand: false,
                      decorators: null,
                    },
                  ],
                },
              ],
            },
          },
        ],
        directives: [],
        sourceType: "script",
        interpreter: null,
      };

      existenceCheckerForRules(astVue);
      existenceCheckerForRules(astVueRouter);

      expect(spySetExistenceChecker).toHaveBeenCalledWith(
        "vuePropRender",
        true
      );
      expect(spySetStateManager).toHaveBeenCalledWith("routerPropMode", {
        type: "StringLiteral",
        value: "history",
      });
    });

    test("ExpressionStatement()", () => {
      const spySetExistenceChecker = jest.spyOn(existenceChecker, "set");

      const astVue = {
        type: "Program",
        body: [
          {
            type: "ExpressionStatement",
            expression: {
              type: "CallExpression",
              callee: {
                type: "MemberExpression",
                object: {
                  type: "NewExpression",
                  callee: { type: "Identifier", name: "Vue" },
                  arguments: [],
                },
                property: { type: "Identifier", name: "someMethod" },
                computed: false,
                optional: null,
              },
              arguments: [],
            },
          },
        ],
        directives: [],
        sourceType: "script",
        interpreter: null,
      };

      existenceCheckerForRules(astVue);

      expect(spySetExistenceChecker).toHaveBeenCalledWith("newVue", true);
    });
  });

  describe("globalApiNewVue", () => {
    test("transforma import Vue e new Vue() corretamente", () => {
      const ast = {
        type: "File",
        program: {
          type: "Program",
          body: [
            {
              type: "ImportDeclaration",
              specifiers: [
                {
                  type: "ImportDefaultSpecifier",
                  local: { name: "Vue" },
                },
              ],
              source: { type: "StringLiteral", value: "vue" },
            },
            {
              type: "ExpressionStatement",
              expression: {
                type: "CallExpression",
                callee: {
                  object: {
                    type: "NewExpression",
                    callee: { type: "Identifier", name: "Vue" },
                    arguments: [
                      {
                        type: "ObjectExpression",
                        properties: [
                          {
                            type: "ObjectProperty",
                            key: { type: "Identifier", name: "render" },
                            value: {
                              type: "FunctionExpression",
                              body: { type: "BlockStatement", body: [] },
                            },
                          },
                          {
                            type: "ObjectProperty",
                            key: { type: "Identifier", name: "foo" },
                            value: { type: "StringLiteral", value: "bar" },
                          },
                        ],
                      },
                    ],
                  },
                },
              },
            },
            {
              type: "ExpressionStatement",
              expression: {
                type: "AssignmentExpression",
                operator: "=",
                left: {
                  type: "MemberExpression",
                  object: {
                    type: "MemberExpression",
                    object: { type: "Identifier", name: "Vue" },
                    property: { type: "Identifier", name: "config" },
                  },
                  property: { type: "Identifier", name: "productionTip" },
                },
                right: { type: "BooleanLiteral", value: false },
              },
            },
            {
              type: "ExpressionStatement",
              expression: {
                type: "CallExpression",
                callee: {
                  type: "MemberExpression",
                  object: { type: "Identifier", name: "Vue" },
                  property: { type: "Identifier", name: "someMethod" },
                },
                arguments: [],
              },
            },
            {
              type: "ExpressionStatement",
              expression: {
                type: "CallExpression",
                callee: {
                  type: "MemberExpression",
                  object: { type: "Identifier", name: "Vue" },
                  property: { type: "Identifier", name: "use" },
                },
                arguments: [{ type: "Identifier", name: "SomePlugin" }],
              },
            },
          ],
        },
      };

      const expected = {
        program: {
          body: [
            {
              expression: {
                arguments: [],
                callee: {
                  object: {
                    name: "Vue",
                    type: "Identifier",
                  },
                  property: {
                    name: "someMethod",
                    type: "Identifier",
                  },
                  type: "MemberExpression",
                },
                type: "CallExpression",
              },
              type: "ExpressionStatement",
            },
          ],
          type: "Program",
        },
        type: "File",
      };

      expect(globalApiNewVue(ast)).toStrictEqual(expected);
    });
  });

  describe("destroyedToUnmouted()", () => {
    test("Should replace 'destroyed' with 'unmounted' in AST identifiers", () => {
      const ast = {
        type: "File",
        start: 0,
        end: 14,
        loc: {
          start: { line: 1, column: 0, index: 0 },
          end: { line: 2, column: 0, index: 14 },
        },
        errors: [],
        program: {
          type: "Program",
          start: 0,
          end: 14,
          loc: {},
          sourceType: "module",
          interpreter: null,
          body: [
            {
              type: "ExpressionStatement",
              start: 0,
              end: 12,
              loc: {
                start: { line: 1, column: 0, index: 0 },
                end: { line: 1, column: 12, index: 12 },
              },
              expression: {
                type: "CallExpression",
                start: 0,
                end: 11,
                loc: { end: { line: 1, column: 11, index: 11 } },
                callee: {
                  type: "Identifier",
                  start: 0,
                  end: 9,
                  loc: {
                    end: { line: 1, column: 9, index: 9 },
                    identifierName: "destroyed",
                  },
                  name: "destroyed",
                },
                arguments: [],
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
        end: 14,
        loc: {
          start: { line: 1, column: 0, index: 0 },
          end: { line: 2, column: 0, index: 14 },
        },
        errors: [],
        program: {
          type: "Program",
          start: 0,
          end: 14,
          sourceType: "module",
          interpreter: null,
          body: [
            {
              type: "ExpressionStatement",
              start: 0,
              end: 12,
              loc: {
                start: { line: 1, column: 0, index: 0 },
                end: { line: 1, column: 12, index: 12 },
              },
              expression: {
                type: "CallExpression",
                start: 0,
                end: 11,
                callee: {
                  type: "Identifier",
                  start: 0,
                  end: 9,
                  name: "unmounted",
                },
                arguments: [],
              },
            },
          ],
          directives: [],
        },
        comments: [],
      };

      expect(destroyedToUnmouted(ast)).toStrictEqual(expected);
    });

    test("Should remove incorrect loc values from nodes", () => {
      const ast = {
        type: "Program",
        body: [
          {
            type: "ExpressionStatement",
            loc: {
              start: {},
              end: { line: 10, column: 5 },
            },
          },
        ],
      };

      const expected = {
        type: "Program",
        body: [
          {
            type: "ExpressionStatement",
          },
        ],
      };

      expect(destroyedToUnmouted(ast)).toStrictEqual(expected);
    });
  });

  describe("beforeDestroyToBeforeUnmount()", () => {
    test("Should replace 'beforeDestroy' with 'beforeUnmount' in AST identifiers", () => {
      const ast = {
        type: "File",
        start: 0,
        end: 14,
        loc: {
          start: { line: 1, column: 0, index: 0 },
          end: { line: 2, column: 0, index: 14 },
        },
        errors: [],
        program: {
          type: "Program",
          start: 0,
          end: 14,
          loc: {},
          sourceType: "module",
          interpreter: null,
          body: [
            {
              type: "ExpressionStatement",
              start: 0,
              end: 12,
              loc: {
                start: { line: 1, column: 0, index: 0 },
                end: { line: 1, column: 12, index: 12 },
              },
              expression: {
                type: "CallExpression",
                start: 0,
                end: 11,
                loc: { end: { line: 1, column: 11, index: 11 } },
                callee: {
                  type: "Identifier",
                  start: 0,
                  end: 9,
                  loc: {
                    end: { line: 1, column: 9, index: 9 },
                    identifierName: "beforeDestroy",
                  },
                  name: "beforeDestroy",
                },
                arguments: [],
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
        end: 14,
        loc: {
          start: { line: 1, column: 0, index: 0 },
          end: { line: 2, column: 0, index: 14 },
        },
        errors: [],
        program: {
          type: "Program",
          start: 0,
          end: 14,
          sourceType: "module",
          interpreter: null,
          body: [
            {
              type: "ExpressionStatement",
              start: 0,
              end: 12,
              loc: {
                start: { line: 1, column: 0, index: 0 },
                end: { line: 1, column: 12, index: 12 },
              },
              expression: {
                type: "CallExpression",
                start: 0,
                end: 11,
                callee: {
                  type: "Identifier",
                  start: 0,
                  end: 9,
                  name: "beforeUnmount",
                },
                arguments: [],
              },
            },
          ],
          directives: [],
        },
        comments: [],
      };

      expect(beforeDestroyToBeforeUnmount(ast)).toStrictEqual(expected);
    });

    test("Should remove incorrect loc values from nodes", () => {
      const ast = {
        type: "Program",
        body: [
          {
            type: "ExpressionStatement",
            loc: {
              start: {},
              end: { line: 10, column: 5 },
            },
          },
        ],
      };

      const expected = {
        type: "Program",
        body: [
          {
            type: "ExpressionStatement",
          },
        ],
      };

      expect(beforeDestroyToBeforeUnmount(ast)).toStrictEqual(expected);
    });
  });

  describe("dataOptions()", () => {
    test("Should convert data property to a method", () => {
      const ast = {
        type: "File",
        start: 0,
        end: 68,
        loc: {
          start: { line: 1, column: 0, index: 0 },
          end: { line: 6, column: 0, index: 68 },
        },
        errors: [],
        program: {
          type: "Program",
          start: 0,
          end: 68,
          loc: {},
          sourceType: "module",
          interpreter: null,
          body: [
            {
              type: "VariableDeclaration",
              start: 0,
              end: 66,
              loc: {
                start: { line: 1, column: 0, index: 0 },
                end: { line: 5, column: 3, index: 66 },
              },
              declarations: [
                {
                  type: "VariableDeclarator",
                  start: 6,
                  end: 65,
                  loc: {
                    start: { line: 1, column: 6, index: 6 },
                    end: { line: 5, column: 2, index: 65 },
                  },
                  id: {
                    type: "Identifier",
                    start: 6,
                    end: 9,
                    loc: {
                      end: { line: 1, column: 9, index: 9 },
                      identifierName: "app",
                    },
                    name: "app",
                  },
                  init: {
                    type: "NewExpression",
                    start: 12,
                    end: 65,
                    loc: { start: { line: 1, column: 12, index: 12 } },
                    callee: {
                      type: "Identifier",
                      start: 16,
                      end: 19,
                      loc: {
                        start: { line: 1, column: 16, index: 16 },
                        end: { line: 1, column: 19, index: 19 },
                        identifierName: "Vue",
                      },
                      name: "Vue",
                    },
                    arguments: [
                      {
                        type: "ObjectExpression",
                        start: 20,
                        end: 64,
                        loc: {
                          start: { line: 1, column: 20, index: 20 },
                          end: { line: 5, column: 1, index: 64 },
                        },
                        properties: [
                          {
                            type: "ObjectProperty",
                            start: 25,
                            end: 60,
                            loc: {
                              start: { line: 2, column: 2, index: 25 },
                              end: { line: 4, column: 3, index: 60 },
                            },
                            method: false,
                            key: {
                              type: "Identifier",
                              start: 25,
                              end: 29,
                              loc: {
                                end: { line: 2, column: 6, index: 29 },
                                identifierName: "data",
                              },
                              name: "data",
                            },
                            computed: false,
                            shorthand: false,
                            value: {
                              type: "ObjectExpression",
                              start: 31,
                              end: 60,
                              loc: {
                                start: { line: 2, column: 8, index: 31 },
                              },
                              properties: [
                                {
                                  type: "ObjectProperty",
                                  start: 38,
                                  end: 54,
                                  loc: {
                                    start: { line: 3, column: 4, index: 38 },
                                    end: { line: 3, column: 20, index: 54 },
                                  },
                                  method: false,
                                  key: {
                                    type: "Identifier",
                                    start: 38,
                                    end: 44,
                                    loc: {
                                      end: { line: 3, column: 10, index: 44 },
                                      identifierName: "apiKey",
                                    },
                                    name: "apiKey",
                                  },
                                  computed: false,
                                  shorthand: false,
                                  value: {
                                    type: "StringLiteral",
                                    start: 46,
                                    end: 54,
                                    loc: {
                                      start: {
                                        line: 3,
                                        column: 12,
                                        index: 46,
                                      },
                                    },
                                    extra: {
                                      rawValue: "a1b2c3",
                                      raw: '"a1b2c3"',
                                    },
                                    value: "a1b2c3",
                                  },
                                },
                              ],
                              extra: { trailingComma: 54 },
                            },
                          },
                        ],
                        extra: { trailingComma: 60 },
                      },
                    ],
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
        comments: [],
        end: 68,
        errors: [],
        loc: {
          end: {
            column: 0,
            index: 68,
            line: 6,
          },
          start: {
            column: 0,
            index: 0,
            line: 1,
          },
        },
        program: {
          body: [
            {
              declarations: [
                {
                  end: 65,
                  id: {
                    end: 9,
                    loc: {
                      end: {
                        column: 9,
                        index: 9,
                        line: 1,
                      },
                      identifierName: "app",
                    },
                    name: "app",
                    start: 6,
                    type: "Identifier",
                  },
                  init: {
                    arguments: [
                      {
                        end: 64,
                        extra: {
                          trailingComma: 60,
                        },
                        loc: {
                          end: {
                            column: 1,
                            index: 64,
                            line: 5,
                          },
                          start: {
                            column: 20,
                            index: 20,
                            line: 1,
                          },
                        },
                        properties: [
                          {
                            async: false,
                            body: {
                              body: [
                                {
                                  argument: {
                                    end: 60,
                                    extra: {
                                      trailingComma: 54,
                                    },
                                    loc: {
                                      start: {
                                        column: 8,
                                        index: 31,
                                        line: 2,
                                      },
                                    },
                                    properties: [
                                      {
                                        computed: false,
                                        end: 54,
                                        key: {
                                          end: 44,
                                          loc: {
                                            end: {
                                              column: 10,
                                              index: 44,
                                              line: 3,
                                            },
                                            identifierName: "apiKey",
                                          },
                                          name: "apiKey",
                                          start: 38,
                                          type: "Identifier",
                                        },
                                        loc: {
                                          end: {
                                            column: 20,
                                            index: 54,
                                            line: 3,
                                          },
                                          start: {
                                            column: 4,
                                            index: 38,
                                            line: 3,
                                          },
                                        },
                                        method: false,
                                        shorthand: false,
                                        start: 38,
                                        type: "ObjectProperty",
                                        value: {
                                          end: 54,
                                          extra: {
                                            raw: '"a1b2c3"',
                                            rawValue: "a1b2c3",
                                          },
                                          loc: {
                                            start: {
                                              column: 12,
                                              index: 46,
                                              line: 3,
                                            },
                                          },
                                          start: 46,
                                          type: "StringLiteral",
                                          value: "a1b2c3",
                                        },
                                      },
                                    ],
                                    start: 31,
                                    type: "ObjectExpression",
                                  },
                                  type: "ReturnStatement",
                                },
                              ],
                              directives: [],
                              type: "BlockStatement",
                            },
                            computed: false,
                            generator: false,
                            innerComments: [],
                            key: {
                              name: "data",
                              type: "Identifier",
                            },
                            kind: "method",
                            leadingComments: [],
                            params: [],
                            trailingComments: [],
                            type: "ObjectMethod",
                          },
                        ],
                        start: 20,
                        type: "ObjectExpression",
                      },
                    ],
                    callee: {
                      end: 19,
                      loc: {
                        end: {
                          column: 19,
                          index: 19,
                          line: 1,
                        },
                        identifierName: "Vue",
                        start: {
                          column: 16,
                          index: 16,
                          line: 1,
                        },
                      },
                      name: "Vue",
                      start: 16,
                      type: "Identifier",
                    },
                    end: 65,
                    loc: {
                      start: {
                        column: 12,
                        index: 12,
                        line: 1,
                      },
                    },
                    start: 12,
                    type: "NewExpression",
                  },
                  loc: {
                    end: {
                      column: 2,
                      index: 65,
                      line: 5,
                    },
                    start: {
                      column: 6,
                      index: 6,
                      line: 1,
                    },
                  },
                  start: 6,
                  type: "VariableDeclarator",
                },
              ],
              end: 66,
              kind: "const",
              loc: {
                end: {
                  column: 3,
                  index: 66,
                  line: 5,
                },
                start: {
                  column: 0,
                  index: 0,
                  line: 1,
                },
              },
              start: 0,
              type: "VariableDeclaration",
            },
          ],
          directives: [],
          end: 68,
          interpreter: null,
          loc: {},
          sourceType: "module",
          start: 0,
          type: "Program",
        },
        start: 0,
        type: "File",
      };

      expect(dataOptions(ast)).toStrictEqual(expected);
    });
  });

  describe("filters()", () => {
    test("Should move filters properties into methods if methods exist", () => {
      const ast = {
        type: "File",
        start: 0,
        end: 101,
        loc: {
          start: { line: 1, column: 0, index: 0 },
          end: { line: 7, column: 2, index: 101 },
        },
        errors: [],
        program: {
          type: "Program",
          start: 0,
          end: 101,
          loc: {},
          sourceType: "module",
          interpreter: null,
          body: [
            {
              type: "ExportDefaultDeclaration",
              start: 0,
              end: 101,
              loc: {
                start: { line: 1, column: 0, index: 0 },
                end: { line: 7, column: 2, index: 101 },
              },
              declaration: {
                type: "ObjectExpression",
                start: 15,
                end: 100,
                loc: {
                  start: { line: 1, column: 15, index: 15 },
                  end: { line: 7, column: 1, index: 100 },
                },
                properties: [
                  {
                    type: "ObjectProperty",
                    start: 20,
                    end: 96,
                    loc: {
                      start: { line: 2, column: 2, index: 20 },
                      end: { line: 6, column: 3, index: 96 },
                    },
                    method: false,
                    key: {
                      type: "Identifier",
                      start: 20,
                      end: 27,
                      loc: {
                        end: { line: 2, column: 9, index: 27 },
                        identifierName: "filters",
                      },
                      name: "filters",
                    },
                    computed: false,
                    shorthand: false,
                    value: {
                      type: "ObjectExpression",
                      start: 29,
                      end: 96,
                      loc: { start: { line: 2, column: 11, index: 29 } },
                      properties: [
                        {
                          type: "ObjectMethod",
                          start: 36,
                          end: 90,
                          loc: {
                            start: { line: 3, column: 4, index: 36 },
                            end: { line: 5, column: 5, index: 90 },
                          },
                          method: true,
                          key: {
                            type: "Identifier",
                            start: 36,
                            end: 47,
                            loc: {
                              end: { line: 3, column: 15, index: 47 },
                              identifierName: "currencyUSD",
                            },
                            name: "currencyUSD",
                          },
                          computed: false,
                          kind: "method",
                          id: null,
                          generator: false,
                          async: false,
                          params: [
                            {
                              type: "Identifier",
                              start: 48,
                              end: 53,
                              loc: {
                                start: { line: 3, column: 16, index: 48 },
                                end: { line: 3, column: 21, index: 53 },
                                identifierName: "value",
                              },
                              name: "value",
                            },
                          ],
                          body: {
                            type: "BlockStatement",
                            start: 55,
                            end: 90,
                            loc: {
                              start: { line: 3, column: 23, index: 55 },
                            },
                            body: [
                              {
                                type: "ReturnStatement",
                                start: 64,
                                end: 83,
                                loc: {
                                  start: { line: 4, column: 6, index: 64 },
                                  end: { line: 4, column: 25, index: 83 },
                                },
                                argument: {
                                  type: "BinaryExpression",
                                  start: 71,
                                  end: 82,
                                  loc: {
                                    start: { line: 4, column: 13, index: 71 },
                                    end: { line: 4, column: 24, index: 82 },
                                  },
                                  left: {
                                    type: "StringLiteral",
                                    start: 71,
                                    end: 74,
                                    loc: {
                                      end: { line: 4, column: 16, index: 74 },
                                    },
                                    extra: { rawValue: "$", raw: '"$"' },
                                    value: "$",
                                  },
                                  operator: "+",
                                  right: {
                                    type: "Identifier",
                                    start: 77,
                                    end: 82,
                                    loc: {
                                      start: {
                                        line: 4,
                                        column: 19,
                                        index: 77,
                                      },
                                      identifierName: "value",
                                    },
                                    name: "value",
                                  },
                                },
                              },
                            ],
                            directives: [],
                          },
                        },
                      ],
                      extra: { trailingComma: 90 },
                    },
                  },
                ],
                extra: { trailingComma: 96 },
              },
            },
          ],
          directives: [],
        },
        comments: [],
      };

      const expected = {
        comments: [],
        end: 101,
        errors: [],
        loc: {
          end: {
            column: 2,
            index: 101,
            line: 7,
          },
          start: {
            column: 0,
            index: 0,
            line: 1,
          },
        },
        program: {
          body: [
            {
              declaration: {
                end: 100,
                extra: {
                  trailingComma: 96,
                },
                loc: {
                  end: {
                    column: 1,
                    index: 100,
                    line: 7,
                  },
                  start: {
                    column: 15,
                    index: 15,
                    line: 1,
                  },
                },
                properties: [
                  {
                    computed: false,
                    end: 96,
                    key: {
                      end: 27,
                      loc: {
                        end: {
                          column: 9,
                          index: 27,
                          line: 2,
                        },
                        identifierName: "filters",
                      },
                      name: "methods",
                      start: 20,
                      type: "Identifier",
                    },
                    loc: {
                      end: {
                        column: 3,
                        index: 96,
                        line: 6,
                      },
                      start: {
                        column: 2,
                        index: 20,
                        line: 2,
                      },
                    },
                    method: false,
                    shorthand: false,
                    start: 20,
                    type: "ObjectProperty",
                    value: {
                      end: 96,
                      extra: {
                        trailingComma: 90,
                      },
                      loc: {
                        start: {
                          column: 11,
                          index: 29,
                          line: 2,
                        },
                      },
                      properties: [
                        {
                          async: false,
                          body: {
                            body: [
                              {
                                argument: {
                                  end: 82,
                                  left: {
                                    end: 74,
                                    extra: {
                                      raw: '"$"',
                                      rawValue: "$",
                                    },
                                    loc: {
                                      end: {
                                        column: 16,
                                        index: 74,
                                        line: 4,
                                      },
                                    },
                                    start: 71,
                                    type: "StringLiteral",
                                    value: "$",
                                  },
                                  loc: {
                                    end: {
                                      column: 24,
                                      index: 82,
                                      line: 4,
                                    },
                                    start: {
                                      column: 13,
                                      index: 71,
                                      line: 4,
                                    },
                                  },
                                  operator: "+",
                                  right: {
                                    end: 82,
                                    loc: {
                                      identifierName: "value",
                                      start: {
                                        column: 19,
                                        index: 77,
                                        line: 4,
                                      },
                                    },
                                    name: "value",
                                    start: 77,
                                    type: "Identifier",
                                  },
                                  start: 71,
                                  type: "BinaryExpression",
                                },
                                end: 83,
                                loc: {
                                  end: {
                                    column: 25,
                                    index: 83,
                                    line: 4,
                                  },
                                  start: {
                                    column: 6,
                                    index: 64,
                                    line: 4,
                                  },
                                },
                                start: 64,
                                type: "ReturnStatement",
                              },
                            ],
                            directives: [],
                            end: 90,
                            loc: {
                              start: {
                                column: 23,
                                index: 55,
                                line: 3,
                              },
                            },
                            start: 55,
                            type: "BlockStatement",
                          },
                          computed: false,
                          end: 90,
                          generator: false,
                          id: null,
                          key: {
                            end: 47,
                            loc: {
                              end: {
                                column: 15,
                                index: 47,
                                line: 3,
                              },
                              identifierName: "currencyUSD",
                            },
                            name: "currencyUSD",
                            start: 36,
                            type: "Identifier",
                          },
                          kind: "method",
                          loc: {
                            end: {
                              column: 5,
                              index: 90,
                              line: 5,
                            },
                            start: {
                              column: 4,
                              index: 36,
                              line: 3,
                            },
                          },
                          method: true,
                          params: [
                            {
                              end: 53,
                              loc: {
                                end: {
                                  column: 21,
                                  index: 53,
                                  line: 3,
                                },
                                identifierName: "value",
                                start: {
                                  column: 16,
                                  index: 48,
                                  line: 3,
                                },
                              },
                              name: "value",
                              start: 48,
                              type: "Identifier",
                            },
                          ],
                          start: 36,
                          type: "ObjectMethod",
                        },
                      ],
                      start: 29,
                      type: "ObjectExpression",
                    },
                  },
                ],
                start: 15,
                type: "ObjectExpression",
              },
              end: 101,
              loc: {
                end: {
                  column: 2,
                  index: 101,
                  line: 7,
                },
                start: {
                  column: 0,
                  index: 0,
                  line: 1,
                },
              },
              start: 0,
              type: "ExportDefaultDeclaration",
            },
          ],
          directives: [],
          end: 101,
          interpreter: null,
          loc: {},
          sourceType: "module",
          start: 0,
          type: "Program",
        },
        start: 0,
        type: "File",
      };

      expect(filters(ast)).toStrictEqual(expected);
    });

    test("Should rename filters to methods if methods do not exist", () => {
      const ast = {
        type: "File",
        start: 0,
        end: 38,
        loc: {
          start: { line: 1, column: 0, index: 0 },
          end: { line: 4, column: 0, index: 38 },
        },
        errors: [],
        program: {
          type: "Program",
          start: 0,
          end: 38,
          loc: {},
          sourceType: "module",
          interpreter: null,
          body: [
            {
              type: "ExportDefaultDeclaration",
              start: 0,
              end: 36,
              loc: {
                start: { line: 1, column: 0, index: 0 },
                end: { line: 3, column: 2, index: 36 },
              },
              declaration: {
                type: "ObjectExpression",
                start: 15,
                end: 35,
                loc: {
                  start: { line: 1, column: 15, index: 15 },
                  end: { line: 3, column: 1, index: 35 },
                },
                properties: [
                  {
                    type: "ObjectProperty",
                    start: 20,
                    end: 31,
                    loc: {
                      start: { line: 2, column: 2, index: 20 },
                      end: { line: 2, column: 13, index: 31 },
                    },
                    method: false,
                    key: {
                      type: "Identifier",
                      start: 20,
                      end: 27,
                      loc: {
                        end: { line: 2, column: 9, index: 27 },
                        identifierName: "filters",
                      },
                      name: "filters",
                    },
                    computed: false,
                    shorthand: false,
                    value: {
                      type: "ObjectExpression",
                      start: 29,
                      end: 31,
                      loc: { start: { line: 2, column: 11, index: 29 } },
                      properties: [],
                    },
                  },
                ],
                extra: { trailingComma: 31 },
              },
            },
          ],
          directives: [],
        },
        comments: [],
      };

      const expected = {
        comments: [],
        end: 38,
        errors: [],
        loc: {
          end: {
            column: 0,
            index: 38,
            line: 4,
          },
          start: {
            column: 0,
            index: 0,
            line: 1,
          },
        },
        program: {
          body: [
            {
              declaration: {
                end: 35,
                extra: {
                  trailingComma: 31,
                },
                loc: {
                  end: {
                    column: 1,
                    index: 35,
                    line: 3,
                  },
                  start: {
                    column: 15,
                    index: 15,
                    line: 1,
                  },
                },
                properties: [
                  {
                    computed: false,
                    end: 31,
                    key: {
                      end: 27,
                      loc: {
                        end: {
                          column: 9,
                          index: 27,
                          line: 2,
                        },
                        identifierName: "filters",
                      },
                      name: "methods",
                      start: 20,
                      type: "Identifier",
                    },
                    loc: {
                      end: {
                        column: 13,
                        index: 31,
                        line: 2,
                      },
                      start: {
                        column: 2,
                        index: 20,
                        line: 2,
                      },
                    },
                    method: false,
                    shorthand: false,
                    start: 20,
                    type: "ObjectProperty",
                    value: {
                      end: 31,
                      loc: {
                        start: {
                          column: 11,
                          index: 29,
                          line: 2,
                        },
                      },
                      properties: [],
                      start: 29,
                      type: "ObjectExpression",
                    },
                  },
                ],
                start: 15,
                type: "ObjectExpression",
              },
              end: 36,
              loc: {
                end: {
                  column: 2,
                  index: 36,
                  line: 3,
                },
                start: {
                  column: 0,
                  index: 0,
                  line: 1,
                },
              },
              start: 0,
              type: "ExportDefaultDeclaration",
            },
          ],
          directives: [],
          end: 38,
          interpreter: null,
          loc: {},
          sourceType: "module",
          start: 0,
          type: "Program",
        },
        start: 0,
        type: "File",
      };
      expect(filters(ast)).toStrictEqual(expected);
    });
  });
});
