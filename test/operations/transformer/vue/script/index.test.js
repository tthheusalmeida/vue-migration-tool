const {
  setDefaultLoc,
  existenceCheckerForRules,
  globalApiNewVue,
  destroyedToUnmouted,
  beforeDestroyToBeforeUnmount,
  dataOptions,
} = require("../../../../../src/operations/transformer/vue/script/index");

const existenceChecker = require("../../../../../src/singletons/existenceChecker");
const stateManager = require("../../../../../src/singletons/stateManager");
const t = require("@babel/types");

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

  // describe("existenceCheckerForRules()", () => {
  //   test("ImportDeclaration()", () => {
  //     const spyGetExistenceChecker = jest.spyOn(existenceChecker, "get");
  //     const spySetStateManager = jest.spyOn(stateManager, "set");

  //     spyGetExistenceChecker.mockReturnValue(true);

  //     const ast = {
  //       type: "Program",
  //       body: [
  //         {
  //           type: "ImportDeclaration",
  //           specifiers: [
  //             {
  //               type: "ImportSpecifier",
  //               local: { type: "Identifier", name: "Vue" },
  //               imported: { type: "Identifier", name: "Vue" },
  //             },
  //           ],
  //           source: { type: "StringLiteral", value: "vue" },
  //         },
  //       ],
  //       directives: [],
  //       sourceType: "script",
  //       interpreter: null,
  //     };

  //     globalApiNewVue(ast);

  //     expect(spySetStateManager).toHaveBeenCalledWith("importVue", {
  //       type: "ImportDeclaration",
  //       specifiers: [
  //         {
  //           type: "ImportSpecifier",
  //           local: { type: "Identifier", name: "createApp" },
  //           imported: { type: "Identifier", name: "createApp" },
  //         },
  //         {
  //           type: "ImportSpecifier",
  //           local: { type: "Identifier", name: "h" },
  //           imported: { type: "Identifier", name: "h" },
  //         },
  //       ],
  //       source: { type: "StringLiteral", value: "vue" },
  //     });
  //   });
  // });

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
});
