const {
  traverseTemplate,
  walk,
} = require('../../../../src/operations/transformer/template/traverse');

describe('=> operations/transformer/template/traverse', () => {
  describe('traverseTemplate()', () => {
    test('When passes a AST without node, should not traverse on AST.', () => {
      traverseTemplate();

      expect().toEqual();
    });

    test('When passes a AST with node and action, should walk and transforme AST.', () => {
      const ast = {
        type: 1,
        tag: 'div',
        children: [
          {
            type: 2,
            tag: 'span',
            children: [
              {
                type: 3
              }
            ],
          }
        ]
      };
      const action = (node) => {
        if (node.tag === 'div') {
          node.tag = 'a';
        }
      };

      const expected = {
        type: 1,
        tag: 'a',
        children: [
          {
            type: 2,
            tag: 'span',
            children: [
              {
                type: 3
              }
            ],
          }
        ]
      };
      traverseTemplate(ast, { action });

      expect(ast).toEqual(expected);
    });
  });

  describe('walk()', () => {
    test('When passes a AST without node, should not walk on AST.', () => {
      walk();

      expect().toEqual();
    });

    test('When passes a AST with node, should walk on AST.', () => {
      const ast = {
        type: 1,
        tag: 'div',
        children: [
          {
            type: 2,
            tag: 'span',
            children: [
              {
                type: 3
              }
            ],
          }
        ]
      };
      const expected = {
        type: 1,
        tag: 'div',
        children: [
          {
            type: 2,
            tag: 'span',
            children: [
              {
                type: 3
              }
            ],
          }
        ]
      };
      walk(ast);

      expect(ast).toEqual(expected);
    });

    test('When passes a AST with node and action, should walk and transforme AST.', () => {
      const ast = {
        type: 1,
        tag: 'div',
        children: [
          {
            type: 2,
            tag: 'span',
            children: [
              {
                type: 3
              }
            ],
          }
        ]
      };
      const action = (node) => {
        if (node.tag === 'div') {
          node.tag = 'a';
        }
      };

      const expected = {
        type: 1,
        tag: 'a',
        children: [
          {
            type: 2,
            tag: 'span',
            children: [
              {
                type: 3
              }
            ],
          }
        ]
      };
      walk(ast, action);

      expect(ast).toEqual(expected);
    });

    test('When passes a AST with node and no action, should walk on AST without transforming.', () => {
      const ast = {
        type: 1,
        tag: 'div',
      };
      const expected = {
        type: 1,
        tag: 'div',
      };
      walk(ast);

      expect(ast).toEqual(expected);
    });
  });
});