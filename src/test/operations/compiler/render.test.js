const {
  renderTemplate,
  renderTag,
  renderTagByType,
  renderAttrsMap,
  renderOpenTag,
  renderCloseTag,
} = require('../../../operations/compiler/render.js');

describe('render', () => {
  describe('renderTemplate()', () => {
    test('When passes template ast, should render template.', () => {
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

      expect(renderTemplate(template)).toBe(expected);
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
});