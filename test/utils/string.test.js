const {
  replaceExtensionVueToJson,
  getTagContent,
  getTemplateContent,
  getScriptContent,
  getStyleContent,
} = require('../../src/utils/string');

describe('=> utils/string', () => {
  describe('replaceExtensionVueToJson()', () => {
    test('When passes vue file extension, should return json file extension.', () => {
      const string = 'Component.vue';
      const expected = 'Component.json';

      expect(replaceExtensionVueToJson(string)).toBe(expected);
    });

    test('When passes empty string, should return empty string.', () => {
      const string = '';

      expect(replaceExtensionVueToJson(string)).toBe('');
    });

    test('When passes any other kind of extension, should return passed string.', () => {
      const string = 'Component.txt';
      const expected = 'Component.txt';

      expect(replaceExtensionVueToJson(string)).toBe(expected);
    });
  });

  describe('getTagContent()', () => {
    test('When passes any Vue tag and includeTag as false, should return the content between them.', () => {
      const fileContent = `
      <template>
        <div class="example-component">
          <p>{{ message }}</p>
          <button @click="reverseMessage">Reverse Message</button>
        </div>
      </template>`;
      const expected = '<div class="example-component">\n          <p>{{ message }}</p>\n          <button @click="reverseMessage">Reverse Message</button>\n        </div>';

      expect(getTagContent(fileContent, '<template>', '</template>')).toBe(expected);
    });

    test('When passes any Vue tag and includeTag as true, should return the content between them and both tags.', () => {
      const fileContent = `
      <template>
        <div class="example-component">
          <p>{{ message }}</p>
          <button @click="reverseMessage">Reverse Message</button>
        </div>
      </template>`;
      const expected = '<template>\n        <div class="example-component">\n          <p>{{ message }}</p>\n          <button @click="reverseMessage">Reverse Message</button>\n        </div>\n      </template>';

      expect(getTagContent(fileContent, '<template>', '</template>', true)).toBe(expected);
    });
  });

  describe('getTemplateContent()', () => {
    test('When passes Vue template tag, should return the content between them and both tags.', () => {
      const fileContent = `
      <template>
        <div class="example-component">
          <p>{{ message }}</p>
          <button @click="reverseMessage">Reverse Message</button>
        </div>
      </template>`;
      const expected = '<template>\n        <div class="example-component">\n          <p>{{ message }}</p>\n          <button @click="reverseMessage">Reverse Message</button>\n        </div>\n      </template>';

      expect(getTemplateContent(fileContent)).toBe(expected);
    });

    test('When passes Vue template tag empty, should return empty content.', () => {
      const fileContent = '';

      expect(getTemplateContent(fileContent)).toBe('');
    });
  });

  describe('getScriptContent()', () => {
    test('When passes Vue script tag, should return the content between them.', () => {
      const fileContent = `
      <script>
        export default {
          name: 'PokeCard',
          props: {
            id: {
              type: String,
              required: true
            }
          },
          computed: {
            isThereData() {
              return this.id;
            }
          }
        };
      </script>`;
      const expected = `export default {
          name: 'PokeCard',
          props: {
            id: {
              type: String,
              required: true
            }
          },
          computed: {
            isThereData() {
              return this.id;
            }
          }
        };`

      expect(getScriptContent(fileContent)).toBe(expected);
    });

    test('When passes Vue script tag empty, should return empty content.', () => {
      const fileContent = '';

      expect(getScriptContent(fileContent)).toBe('');
    });
  });

  describe('getStyleContent()', () => {
    test('When passes Vue style tag, should return the content between them and both tags.', () => {
      const fileContent = `<style lang="scss">
      .example-component {
        /* Estilos para a classe example-component */
        background-color: #f0f0f0;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      </style>`;
      const expected = '<style lang="scss">\n      .example-component {\n        /* Estilos para a classe example-component */\n        background-color: #f0f0f0;\n        padding: 20px;\n        border-radius: 5px;\n        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);\n      }\n      </style>';

      expect(getStyleContent(fileContent)).toBe(expected);
    });

    test('When passes Vue style tag empty, should return empty content.', () => {
      const fileContent = '';

      expect(getStyleContent(fileContent)).toBe('');
    });
  });
});