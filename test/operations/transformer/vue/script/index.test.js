const {
  setDefaultLoc,
  existenceCheckerForRules,
  globalApiNewVue,
  destroyedToUnmouted,
  beforeDestroyToBeforeUnmount,
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
});
