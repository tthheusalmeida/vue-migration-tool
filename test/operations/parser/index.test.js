const { stringifyCircularStructureToJson } = require('../../../src/utils/object');
const {
  runParser,
  getTemplateAst,
  getScriptAst,
} = require('../../../src/operations/parser/index.js');

jest.mock('fs', () => ({
  readFileSync: jest.fn(),
}));
const fs = require('fs');

describe('=> operations/parser', () => {
  describe('runParser()', () => {
    test('When passes file without content, should return AST with template, script and styleString empty.', () => {
      fs.readFileSync.mockImplementation(() => '');

      const result = JSON.parse(stringifyCircularStructureToJson(runParser('anyVueFile.vue')));
      const expected = {
        template: {},
        script: {},
        styleString: '',
      };

      expect(result).toEqual(expected);
    });

    test('When passes file content, should return AST.', () => {
      fs.readFileSync.mockImplementation(() =>
        `<template>
          <div class="example-component">
            <p>{{ message }}</p>
          </div>
        </template>

        <script>
        export default {
          myFunction() {
            console.log('function hook');
          },
        };
        </script>

        <style lang="scss">
          .example-component {
            /* Estilos para a classe example-component */
            background-color: #f0f0f0;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
        </style>`
      );

      const result = JSON.parse(stringifyCircularStructureToJson(runParser('anyVueFile.vue')));
      const expected = {
        template: {
          ast: {
            type: 1,
            tag: 'template',
            attrsList: [],
            attrsMap: {},
            rawAttrsMap: {},
            children: [
              {
                type: 1,
                tag: 'div',
                attrsList: [],
                attrsMap: {
                  class: 'example-component'
                },
                rawAttrsMap: {},
                children: [
                  {
                    type: 1,
                    tag: 'p',
                    attrsList: [],
                    attrsMap: {},
                    rawAttrsMap: {},
                    children: [
                      {
                        type: 2,
                        expression: '_s(message)',
                        tokens: [
                          {
                            '@binding': 'message'
                          }
                        ],
                        text: '{{ message }}',
                        static: false
                      }
                    ],
                    plain: true,
                    static: false,
                    staticRoot: false
                  }
                ],
                plain: false,
                staticClass: '\"example-component\"',
                static: false,
                staticRoot: false
              }
            ],
            plain: true,
            static: false,
            staticRoot: false
          },
          render: "with(this){return [_c('div',{staticClass:\"example-component\"},[_c('p',[_v(_s(message))])])]}",
          staticRenderFns: [],
          errors: [
            'Cannot use <template> as component root element because it may contain multiple nodes.'
          ],
          tips: []
        },
        script: {
          type: 'File',
          start: 0,
          end: 107,
          loc: {
            start: {
              line: 1,
              column: 0,
              index: 0
            },
            end: {
              line: 5,
              column: 10,
              index: 107
            }
          },
          errors: [],
          program: {
            type: 'Program',
            start: 0,
            end: 107,
            loc: {},
            sourceType: 'module',
            interpreter: null,
            body: [
              {
                type: 'ExportDefaultDeclaration',
                start: 0,
                end: 107,
                loc: {
                  start: {
                    line: 1,
                    column: 0,
                    index: 0
                  },
                  end: {
                    line: 5,
                    column: 10,
                    index: 107
                  }
                },
                declaration: {
                  type: 'ObjectExpression',
                  start: 15,
                  end: 106,
                  loc: {
                    start: {
                      line: 1,
                      column: 15,
                      index: 15
                    },
                    end: {
                      line: 5,
                      column: 9,
                      index: 106
                    }
                  },
                  properties: [
                    {
                      type: 'ObjectMethod',
                      start: 27,
                      end: 95,
                      loc: {
                        start: {
                          line: 2,
                          column: 10,
                          index: 27
                        },
                        end: {
                          line: 4,
                          column: 11,
                          index: 95
                        }
                      },
                      method: true,
                      key: {
                        type: 'Identifier',
                        start: 27,
                        end: 37,
                        loc: {
                          end: {
                            line: 2,
                            column: 20,
                            index: 37
                          },
                          identifierName: 'myFunction'
                        },
                        name: 'myFunction'
                      },
                      computed: false,
                      kind: 'method',
                      id: null,
                      generator: false,
                      async: false,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 40,
                        end: 95,
                        loc: {
                          start: {
                            line: 2,
                            column: 23,
                            index: 40
                          }
                        },
                        body: [
                          {
                            type: 'ExpressionStatement',
                            start: 54,
                            end: 83,
                            loc: {
                              start: {
                                line: 3,
                                column: 12,
                                index: 54
                              },
                              end: {
                                line: 3,
                                column: 41,
                                index: 83
                              }
                            },
                            expression: {
                              type: 'CallExpression',
                              start: 54,
                              end: 82,
                              loc: {
                                end: {
                                  line: 3,
                                  column: 40,
                                  index: 82
                                }
                              },
                              callee: {
                                type: 'MemberExpression',
                                start: 54,
                                end: 65,
                                loc: {
                                  end: {
                                    line: 3,
                                    column: 23,
                                    index: 65
                                  }
                                },
                                object: {
                                  type: 'Identifier',
                                  start: 54,
                                  end: 61,
                                  loc: {
                                    end: {
                                      line: 3,
                                      column: 19,
                                      index: 61
                                    },
                                    identifierName: 'console'
                                  },
                                  name: 'console'
                                },
                                computed: false,
                                property: {
                                  type: 'Identifier',
                                  start: 62,
                                  end: 65,
                                  loc: {
                                    start: {
                                      line: 3,
                                      column: 20,
                                      index: 62
                                    },
                                    identifierName: 'log'
                                  },
                                  name: 'log'
                                }
                              },
                              arguments: [
                                {
                                  type: 'StringLiteral',
                                  start: 66,
                                  end: 81,
                                  loc: {
                                    start: {
                                      line: 3,
                                      column: 24,
                                      index: 66
                                    },
                                    end: {
                                      line: 3,
                                      column: 39,
                                      index: 81
                                    }
                                  },
                                  extra: {
                                    rawValue: 'function hook',
                                    raw: "'function hook'"
                                  },
                                  value: 'function hook'
                                }
                              ]
                            }
                          }
                        ],
                        directives: []
                      }
                    }
                  ],
                  extra: {
                    trailingComma: 95
                  }
                }
              }
            ],
            directives: []
          },
          comments: []
        },
        styleString: "<style lang=\"scss\">\n          .example-component {\n            /* Estilos para a classe example-component */\n            background-color: #f0f0f0;\n            padding: 20px;\n            border-radius: 5px;\n            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);\n          }\n        </style>",
      };

      expect(result).toEqual(expected);
    });
  });

  describe('getTemplateAst()', () => {
    test('When passes file content with template, should return AST.', () => {
      const template = `<template>
        <div class="example-component">
          <p>{{ message }}</p>
          <button @click="reverseMessage">Reverse Message</button>
        </div>
      </template>`;
      const result = JSON.parse(stringifyCircularStructureToJson(getTemplateAst(template)));
      const expected = {
        "ast": {
          "type": 1,
          "tag": "template",
          "attrsList": [],
          "attrsMap": {},
          "rawAttrsMap": {},
          "children": [
            {
              "type": 1,
              "tag": "div",
              "attrsList": [],
              "attrsMap": {
                "class": "example-component"
              },
              "rawAttrsMap": {},
              "children": [
                {
                  "type": 1,
                  "tag": "p",
                  "attrsList": [],
                  "attrsMap": {},
                  "rawAttrsMap": {},
                  "children": [
                    {
                      "type": 2,
                      "expression": "_s(message)",
                      "tokens": [
                        {
                          "@binding": "message"
                        }
                      ],
                      "text": "{{ message }}",
                      "static": false
                    }
                  ],
                  "plain": true,
                  "static": false,
                  "staticRoot": false
                },
                {
                  "type": 3,
                  "text": " ",
                  "static": true
                },
                {
                  "type": 1,
                  "tag": "button",
                  "attrsList": [
                    {
                      "name": "@click",
                      "value": "reverseMessage"
                    }
                  ],
                  "attrsMap": {
                    "@click": "reverseMessage"
                  },
                  "rawAttrsMap": {},
                  "children": [
                    {
                      "type": 3,
                      "text": "Reverse Message",
                      "static": true
                    }
                  ],
                  "plain": false,
                  "hasBindings": true,
                  "events": {
                    "click": {
                      "value": "reverseMessage",
                      "dynamic": false
                    }
                  },
                  "static": false,
                  "staticRoot": false
                }
              ],
              "plain": false,
              "staticClass": "\"example-component\"",
              "static": false,
              "staticRoot": false
            }
          ],
          "plain": true,
          "static": false,
          "staticRoot": false
        },
        "render": "with(this){return [_c('div',{staticClass:\"example-component\"},[_c('p',[_v(_s(message))]),_v(\" \"),_c('button',{on:{\"click\":reverseMessage}},[_v(\"Reverse Message\")])])]}",
        "staticRenderFns": [],
        "errors": [
          "Cannot use <template> as component root element because it may contain multiple nodes."
        ],
        "tips": []
      };

      expect(result).toEqual(expected);
    });

    test('When passes file content without template, should return empty AST.', async () => {
      expect(getScriptAst('')).toEqual({});
    });
  });

  describe('getScriptAst()', () => {
    test('When passes file content with script, should return AST.', () => {
      const script = `<script>
      export default {
        destroyed() {
          console.log('destroyed hook');
        }
      };
      </script>`
      const expected = {
        "type": "File",
        "start": 0,
        "end": 98,
        "loc": {
          "start": {
            "line": 1,
            "column": 0,
            "index": 0
          },
          "end": {
            "line": 5,
            "column": 8,
            "index": 98
          }
        },
        "errors": [],
        "program": {
          "type": "Program",
          "start": 0,
          "end": 98,
          "loc": {
            "start": {
              "line": 1,
              "column": 0,
              "index": 0
            },
            "end": {
              "line": 5,
              "column": 8,
              "index": 98
            }
          },
          "sourceType": "module",
          "interpreter": null,
          "body": [
            {
              "type": "ExportDefaultDeclaration",
              "start": 0,
              "end": 98,
              "loc": {
                "start": {
                  "line": 1,
                  "column": 0,
                  "index": 0
                },
                "end": {
                  "line": 5,
                  "column": 8,
                  "index": 98
                }
              },
              "declaration": {
                "type": "ObjectExpression",
                "start": 15,
                "end": 97,
                "loc": {
                  "start": {
                    "line": 1,
                    "column": 15,
                    "index": 15
                  },
                  "end": {
                    "line": 5,
                    "column": 7,
                    "index": 97
                  }
                },
                "properties": [
                  {
                    "type": "ObjectMethod",
                    "start": 25,
                    "end": 89,
                    "loc": {
                      "start": {
                        "line": 2,
                        "column": 8,
                        "index": 25
                      },
                      "end": {
                        "line": 4,
                        "column": 9,
                        "index": 89
                      }
                    },
                    "method": true,
                    "key": {
                      "type": "Identifier",
                      "start": 25,
                      "end": 34,
                      "loc": {
                        "start": {
                          "line": 2,
                          "column": 8,
                          "index": 25
                        },
                        "end": {
                          "line": 2,
                          "column": 17,
                          "index": 34
                        },
                        "identifierName": "destroyed"
                      },
                      "name": "destroyed"
                    },
                    "computed": false,
                    "kind": "method",
                    "id": null,
                    "generator": false,
                    "async": false,
                    "params": [],
                    "body": {
                      "type": "BlockStatement",
                      "start": 37,
                      "end": 89,
                      "loc": {
                        "start": {
                          "line": 2,
                          "column": 20,
                          "index": 37
                        },
                        "end": {
                          "line": 4,
                          "column": 9,
                          "index": 89
                        }
                      },
                      "body": [
                        {
                          "type": "ExpressionStatement",
                          "start": 49,
                          "end": 79,
                          "loc": {
                            "start": {
                              "line": 3,
                              "column": 10,
                              "index": 49
                            },
                            "end": {
                              "line": 3,
                              "column": 40,
                              "index": 79
                            }
                          },
                          "expression": {
                            "type": "CallExpression",
                            "start": 49,
                            "end": 78,
                            "loc": {
                              "start": {
                                "line": 3,
                                "column": 10,
                                "index": 49
                              },
                              "end": {
                                "line": 3,
                                "column": 39,
                                "index": 78
                              }
                            },
                            "callee": {
                              "type": "MemberExpression",
                              "start": 49,
                              "end": 60,
                              "loc": {
                                "start": {
                                  "line": 3,
                                  "column": 10,
                                  "index": 49
                                },
                                "end": {
                                  "line": 3,
                                  "column": 21,
                                  "index": 60
                                }
                              },
                              "object": {
                                "type": "Identifier",
                                "start": 49,
                                "end": 56,
                                "loc": {
                                  "start": {
                                    "line": 3,
                                    "column": 10,
                                    "index": 49
                                  },
                                  "end": {
                                    "line": 3,
                                    "column": 17,
                                    "index": 56
                                  },
                                  "identifierName": "console"
                                },
                                "name": "console"
                              },
                              "computed": false,
                              "property": {
                                "type": "Identifier",
                                "start": 57,
                                "end": 60,
                                "loc": {
                                  "start": {
                                    "line": 3,
                                    "column": 18,
                                    "index": 57
                                  },
                                  "end": {
                                    "line": 3,
                                    "column": 21,
                                    "index": 60
                                  },
                                  "identifierName": "log"
                                },
                                "name": "log"
                              }
                            },
                            "arguments": [
                              {
                                "type": "StringLiteral",
                                "start": 61,
                                "end": 77,
                                "loc": {
                                  "start": {
                                    "line": 3,
                                    "column": 22,
                                    "index": 61
                                  },
                                  "end": {
                                    "line": 3,
                                    "column": 38,
                                    "index": 77
                                  }
                                },
                                "extra": {
                                  "rawValue": "destroyed hook",
                                  "raw": "'destroyed hook'"
                                },
                                "value": "destroyed hook"
                              }
                            ]
                          }
                        }
                      ],
                      "directives": []
                    }
                  }
                ]
              }
            }
          ],
          "directives": []
        },
        "comments": []
      };

      expect(getScriptAst(script)).toEqual(expected);
    });

    test('When passes file content without script, should return empty AST.', async () => {
      expect(getScriptAst('')).toEqual({});
    });
  });
});