const {
  renderTemplate,
  renderTag,
  renderTagByType,
  renderAttrsMap,
  renderOpenTag,
  renderCloseTag,
  renderScript,
} = require('../../../src/operations/compiler/render.js');

jest.mock('prettier', () => ({
  format: jest.fn(code => code),
}));

describe('=> operations/compiler/render', () => {
  describe('renderTemplate()', () => {
    test('When passes template ast, should render template.', async () => {
      const template = {
        type: 1,
        tag: 'template',
        attrsMap: {},
        children: [
          {
            type: 1,
            tag: 'div',
            attrsMap: {
              class: 'example-component'
            },
            children: [
              {
                type: 1,
                tag: 'p',
                attrsMap: {},
                children: [
                  {
                    type: 2,
                    text: '{{ message }}',
                  }
                ],
              },
              {
                type: 3,
                text: ' ',
                static: true
              },
              {
                type: 1,
                tag: 'button',
                attrsMap: {
                  '@click': 'reverseMessage',
                },
                children: [
                  {
                    type: 3,
                    text: 'Reverse Message',
                    static: true
                  }
                ],
              }
            ],
          }
        ],
      };
      const expected = '<template><div class="example-component"><p>{{ message }}</p><button @click="reverseMessage"></button></div></template>';

      const result = await renderTemplate(template);
      expect(result).toBe(expected);
    });
  });

  describe('renderTag()', () => {
    test('When passes node, should render tag.', () => {
      const node = {
        type: 1,
        tag: 'div',
        children: [
          {
            type: 1,
            tag: 'img',
            attrsMap: {
              ':src': 'img',
              ':alt': 'name',
            },
          }
        ]
      };
      const expected = '<div><img :src="img" :alt="name"></div>';

      expect(renderTag(node)).toBe(expected);
    });

    test('When passes empty node, should not render any tag.', () => {
      expect(renderTag({})).toBe('');
    });
  });

  describe('renderTagByType()', () => {
    test('When passes node type equal NODE_TYPE.TAG and it has children, should render tag and children.', () => {
      const node = {
        type: 1,
        tag: 'div',
        children: [
          {
            type: 1,
            tag: 'img',
            attrsMap: {
              ':src': 'img',
              ':alt': 'name',
            },
          }
        ]
      };
      const expected = '<div><img :src="img" :alt="name"></div>';

      expect(renderTagByType(node)).toBe(expected);
    });

    test('When passes node type equal NODE_TYPE.TAG and it has if conditions, should render tag and if conditions.', () => {
      const node = {
        type: 1,
        tag: 'div',
        children: [
          {
            type: 1,
            tag: 'div',
            attrsMap: {
              'v-if': 'isThereData',
            },
          }
        ],
        ifConditions: [
          {
            block: {
              type: 1,
              tag: 'Loading',
              attrsMap: {
                'v-else': ''
              },
            }
          }
        ],
      };
      const expected = '<div><div v-if="isThereData"></div></div><Loading v-else></Loading>';

      expect(renderTagByType(node)).toBe(expected);
    });

    test('When passes node type equal NODE_TYPE.TEMPLATE_STRING, should render tag with template string.', () => {
      const node = {
        type: 1,
        tag: 'div',
        attrsMap: {
          class: 'card_id',
          ':style': 'getBorderStyle(types[0])',
        },
        children: [
          {
            type: 2,
            text: '\r\n        n°{{ id }}\r\n      ',
          }
        ],
      };
      const expected = '<div class="card_id" :style="getBorderStyle(types[0])">n°{{ id }}</div>';

      expect(renderTagByType(node)).toBe(expected);
    });

    test('When passes node type equal NODE_TYPE.EMPTY or otherwise, should render tag empty value.', () => {
      const node = {
        type: 1,
        tag: 'div',
        attrsMap: {
          class: 'card_id',
          ':style': 'getBorderStyle(types[0])',
        },
        children: [
          {
            type: 3,
            text: " ",
          }
        ],
      };
      const expected = '<div class="card_id" :style="getBorderStyle(types[0])"></div>';

      expect(renderTagByType(node)).toBe(expected);
    });
  });

  describe('renderAttrsMap()', () => {
    test('When passes attributes, should render all attributes.', () => {
      const attrs = {
        'class': 'card',
        'v-if': 'isThereData',
        ':style': 'backgroundColor(types[0])',
        '@click': 'openPokemonDetails',
      };
      const expected = 'class="card" v-if="isThereData" :style="backgroundColor(types[0])" @click="openPokemonDetails"';

      expect(renderAttrsMap(attrs)).toBe(expected);
    });

    test('When passes attributes without value, should render only key.', () => {
      const attrs = { 'v-else': '' };
      const expected = 'v-else';

      expect(renderAttrsMap(attrs)).toBe(expected);
    });
  });

  describe('renderOpenTag()', () => {
    test('When passes a node with attributes, should render open tag with all attributes.', () => {
      const node = {
        tag: 'button',
        attrsMap: {
          'class': 'myClass',
          '@click': 'reverseMessage',
        }
      };
      const expected = '<button class="myClass" @click="reverseMessage">';

      expect(renderOpenTag(node)).toBe(expected);
    });

    test('When passes a node without attributes, should render just open tag.', () => {
      const node = {
        tag: 'button',
        attrsMap: {}
      };
      const expected = '<button>';

      expect(renderOpenTag(node)).toBe(expected);
    });
  });

  describe('renderCloseTag()', () => {
    test('When passes a node with tag, should render the closing tag.', () => {
      const node = { tag: 'div' };
      const expected = '</div>';

      expect(renderCloseTag(node)).toBe(expected);
    });

    test('When passes a node without tag, should render nothing.', () => {
      const node = {};

      expect(renderCloseTag(node)).toBe('');
    });
  });

  describe('renderScript()', () => {
    test('When passes script ast, should render script.', async () => {
      const script = {
        "type": "File",
        "start": 0,
        "end": 191,
        "loc": {
          "start": {
            "line": 1,
            "column": 0,
            "index": 0
          },
          "end": {
            "line": 14,
            "column": 2,
            "index": 191
          }
        },
        "errors": [],
        "program": {
          "type": "Program",
          "start": 0,
          "end": 191,
          "loc": {
            "start": {
              "line": 1,
              "column": 0,
              "index": 0
            },
            "end": {
              "line": 14,
              "column": 2,
              "index": 191
            }
          },
          "sourceType": "module",
          "interpreter": null,
          "body": [
            {
              "type": "ExportDefaultDeclaration",
              "start": 0,
              "end": 191,
              "loc": {
                "start": {
                  "line": 1,
                  "column": 0,
                  "index": 0
                },
                "end": {
                  "line": 14,
                  "column": 2,
                  "index": 191
                }
              },
              "declaration": {
                "type": "ObjectExpression",
                "start": 15,
                "end": 190,
                "loc": {
                  "start": {
                    "line": 1,
                    "column": 15,
                    "index": 15
                  },
                  "end": {
                    "line": 14,
                    "column": 1,
                    "index": 190
                  }
                },
                "properties": [
                  {
                    "type": "ObjectProperty",
                    "start": 20,
                    "end": 36,
                    "loc": {
                      "start": {
                        "line": 2,
                        "column": 2,
                        "index": 20
                      },
                      "end": {
                        "line": 2,
                        "column": 18,
                        "index": 36
                      }
                    },
                    "method": false,
                    "key": {
                      "type": "Identifier",
                      "start": 20,
                      "end": 24,
                      "loc": {
                        "start": {
                          "line": 2,
                          "column": 2,
                          "index": 20
                        },
                        "end": {
                          "line": 2,
                          "column": 6,
                          "index": 24
                        },
                        "identifierName": "name"
                      },
                      "name": "name"
                    },
                    "computed": false,
                    "shorthand": false,
                    "value": {
                      "type": "StringLiteral",
                      "start": 26,
                      "end": 36,
                      "loc": {
                        "start": {
                          "line": 2,
                          "column": 8,
                          "index": 26
                        },
                        "end": {
                          "line": 2,
                          "column": 18,
                          "index": 36
                        }
                      },
                      "extra": {
                        "rawValue": "PokeCard",
                        "raw": "'PokeCard'"
                      },
                      "value": "PokeCard"
                    }
                  },
                  {
                    "type": "ObjectProperty",
                    "start": 41,
                    "end": 115,
                    "loc": {
                      "start": {
                        "line": 3,
                        "column": 2,
                        "index": 41
                      },
                      "end": {
                        "line": 8,
                        "column": 3,
                        "index": 115
                      }
                    },
                    "method": false,
                    "key": {
                      "type": "Identifier",
                      "start": 41,
                      "end": 46,
                      "loc": {
                        "start": {
                          "line": 3,
                          "column": 2,
                          "index": 41
                        },
                        "end": {
                          "line": 3,
                          "column": 7,
                          "index": 46
                        },
                        "identifierName": "props"
                      },
                      "name": "props"
                    },
                    "computed": false,
                    "shorthand": false,
                    "value": {
                      "type": "ObjectExpression",
                      "start": 48,
                      "end": 115,
                      "loc": {
                        "start": {
                          "line": 3,
                          "column": 9,
                          "index": 48
                        },
                        "end": {
                          "line": 8,
                          "column": 3,
                          "index": 115
                        }
                      },
                      "properties": [
                        {
                          "type": "ObjectProperty",
                          "start": 55,
                          "end": 110,
                          "loc": {
                            "start": {
                              "line": 4,
                              "column": 4,
                              "index": 55
                            },
                            "end": {
                              "line": 7,
                              "column": 5,
                              "index": 110
                            }
                          },
                          "method": false,
                          "key": {
                            "type": "Identifier",
                            "start": 55,
                            "end": 57,
                            "loc": {
                              "start": {
                                "line": 4,
                                "column": 4,
                                "index": 55
                              },
                              "end": {
                                "line": 4,
                                "column": 6,
                                "index": 57
                              },
                              "identifierName": "id"
                            },
                            "name": "id"
                          },
                          "computed": false,
                          "shorthand": false,
                          "value": {
                            "type": "ObjectExpression",
                            "start": 59,
                            "end": 110,
                            "loc": {
                              "start": {
                                "line": 4,
                                "column": 8,
                                "index": 59
                              },
                              "end": {
                                "line": 7,
                                "column": 5,
                                "index": 110
                              }
                            },
                            "properties": [
                              {
                                "type": "ObjectProperty",
                                "start": 68,
                                "end": 80,
                                "loc": {
                                  "start": {
                                    "line": 5,
                                    "column": 6,
                                    "index": 68
                                  },
                                  "end": {
                                    "line": 5,
                                    "column": 18,
                                    "index": 80
                                  }
                                },
                                "method": false,
                                "key": {
                                  "type": "Identifier",
                                  "start": 68,
                                  "end": 72,
                                  "loc": {
                                    "start": {
                                      "line": 5,
                                      "column": 6,
                                      "index": 68
                                    },
                                    "end": {
                                      "line": 5,
                                      "column": 10,
                                      "index": 72
                                    },
                                    "identifierName": "type"
                                  },
                                  "name": "type"
                                },
                                "computed": false,
                                "shorthand": false,
                                "value": {
                                  "type": "Identifier",
                                  "start": 74,
                                  "end": 80,
                                  "loc": {
                                    "start": {
                                      "line": 5,
                                      "column": 12,
                                      "index": 74
                                    },
                                    "end": {
                                      "line": 5,
                                      "column": 18,
                                      "index": 80
                                    },
                                    "identifierName": "String"
                                  },
                                  "name": "String"
                                }
                              },
                              {
                                "type": "ObjectProperty",
                                "start": 89,
                                "end": 103,
                                "loc": {
                                  "start": {
                                    "line": 6,
                                    "column": 6,
                                    "index": 89
                                  },
                                  "end": {
                                    "line": 6,
                                    "column": 20,
                                    "index": 103
                                  }
                                },
                                "method": false,
                                "key": {
                                  "type": "Identifier",
                                  "start": 89,
                                  "end": 97,
                                  "loc": {
                                    "start": {
                                      "line": 6,
                                      "column": 6,
                                      "index": 89
                                    },
                                    "end": {
                                      "line": 6,
                                      "column": 14,
                                      "index": 97
                                    },
                                    "identifierName": "required"
                                  },
                                  "name": "required"
                                },
                                "computed": false,
                                "shorthand": false,
                                "value": {
                                  "type": "BooleanLiteral",
                                  "start": 99,
                                  "end": 103,
                                  "loc": {
                                    "start": {
                                      "line": 6,
                                      "column": 16,
                                      "index": 99
                                    },
                                    "end": {
                                      "line": 6,
                                      "column": 20,
                                      "index": 103
                                    }
                                  },
                                  "value": true
                                }
                              }
                            ]
                          }
                        }
                      ]
                    }
                  },
                  {
                    "type": "ObjectProperty",
                    "start": 120,
                    "end": 187,
                    "loc": {
                      "start": {
                        "line": 9,
                        "column": 2,
                        "index": 120
                      },
                      "end": {
                        "line": 13,
                        "column": 3,
                        "index": 187
                      }
                    },
                    "method": false,
                    "key": {
                      "type": "Identifier",
                      "start": 120,
                      "end": 128,
                      "loc": {
                        "start": {
                          "line": 9,
                          "column": 2,
                          "index": 120
                        },
                        "end": {
                          "line": 9,
                          "column": 10,
                          "index": 128
                        },
                        "identifierName": "computed"
                      },
                      "name": "computed"
                    },
                    "computed": false,
                    "shorthand": false,
                    "value": {
                      "type": "ObjectExpression",
                      "start": 130,
                      "end": 187,
                      "loc": {
                        "start": {
                          "line": 9,
                          "column": 12,
                          "index": 130
                        },
                        "end": {
                          "line": 13,
                          "column": 3,
                          "index": 187
                        }
                      },
                      "properties": [
                        {
                          "type": "ObjectMethod",
                          "start": 137,
                          "end": 182,
                          "loc": {
                            "start": {
                              "line": 10,
                              "column": 4,
                              "index": 137
                            },
                            "end": {
                              "line": 12,
                              "column": 5,
                              "index": 182
                            }
                          },
                          "method": true,
                          "key": {
                            "type": "Identifier",
                            "start": 137,
                            "end": 148,
                            "loc": {
                              "start": {
                                "line": 10,
                                "column": 4,
                                "index": 137
                              },
                              "end": {
                                "line": 10,
                                "column": 15,
                                "index": 148
                              },
                              "identifierName": "isThereData"
                            },
                            "name": "isThereData"
                          },
                          "computed": false,
                          "kind": "method",
                          "id": null,
                          "generator": false,
                          "async": false,
                          "params": [],
                          "body": {
                            "type": "BlockStatement",
                            "start": 151,
                            "end": 182,
                            "loc": {
                              "start": {
                                "line": 10,
                                "column": 18,
                                "index": 151
                              },
                              "end": {
                                "line": 12,
                                "column": 5,
                                "index": 182
                              }
                            },
                            "body": [
                              {
                                "type": "ReturnStatement",
                                "start": 160,
                                "end": 175,
                                "loc": {
                                  "start": {
                                    "line": 11,
                                    "column": 6,
                                    "index": 160
                                  },
                                  "end": {
                                    "line": 11,
                                    "column": 21,
                                    "index": 175
                                  }
                                },
                                "argument": {
                                  "type": "MemberExpression",
                                  "start": 167,
                                  "end": 174,
                                  "loc": {
                                    "start": {
                                      "line": 11,
                                      "column": 13,
                                      "index": 167
                                    },
                                    "end": {
                                      "line": 11,
                                      "column": 20,
                                      "index": 174
                                    }
                                  },
                                  "object": {
                                    "type": "ThisExpression",
                                    "start": 167,
                                    "end": 171,
                                    "loc": {
                                      "start": {
                                        "line": 11,
                                        "column": 13,
                                        "index": 167
                                      },
                                      "end": {
                                        "line": 11,
                                        "column": 17,
                                        "index": 171
                                      }
                                    }
                                  },
                                  "computed": false,
                                  "property": {
                                    "type": "Identifier",
                                    "start": 172,
                                    "end": 174,
                                    "loc": {
                                      "start": {
                                        "line": 11,
                                        "column": 18,
                                        "index": 172
                                      },
                                      "end": {
                                        "line": 11,
                                        "column": 20,
                                        "index": 174
                                      },
                                      "identifierName": "id"
                                    },
                                    "name": "id"
                                  }
                                }
                              }
                            ],
                            "directives": []
                          }
                        }
                      ]
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

      const expected = "<script>\nexport default {\n  name: 'PokeCard',\n  props: {\n    id: {\n      type: String,\n      required: true\n    }\n  },\n  computed: {\n    isThereData() {\n      return this.id;\n    }\n  }\n};\n</script>\n";
      const result = await renderScript(script);
      expect(result).toBe(expected);
    });
  });
});