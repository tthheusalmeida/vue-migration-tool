const {
  replaceExtensionVueToJson,
  getTagContent,
  getTemplateContent,
  getScriptContent,
  getStyleContent,
  splitfilePath,
  insertTagScript,
  importToVariableName,
  changeUnescapedInterpolation,
} = require("../../src/utils/string");

describe("=> utils/string", () => {
  describe("replaceExtensionVueToJson()", () => {
    test("When passes vue file extension, should return json file extension.", () => {
      const string = "Component.vue";
      const expected = "Component.json";

      expect(replaceExtensionVueToJson(string)).toBe(expected);
    });

    test("When passes empty string, should return empty string.", () => {
      const string = "";

      expect(replaceExtensionVueToJson(string)).toBe("");
    });

    test("When passes any other kind of extension, should return passed string.", () => {
      const string = "Component.txt";
      const expected = "Component.txt";

      expect(replaceExtensionVueToJson(string)).toBe(expected);
    });
  });

  describe("getTagContent()", () => {
    test("When startTag and endTag are not passed, should return empty string", () => {
      const fileContent = `<div>Some content</div>`;
      expect(getTagContent(fileContent)).toBe("");
    });

    test("When startTag is missing, should return empty string", () => {
      const fileContent = `<div>Some content</div>`;
      expect(getTagContent(fileContent, "", "</div>")).toBe("");
    });

    test("When endTag is missing, should return empty string", () => {
      const fileContent = `<div>Some content</div>`;
      expect(getTagContent(fileContent, "<div>", "")).toBe("");
    });

    test("When both startTag and endTag are missing, should return empty string", () => {
      const fileContent = `<div>Some content</div>`;
      expect(getTagContent(fileContent, "", "")).toBe("");
    });

    test("When includeTag is not passed, should default to false", () => {
      const fileContent = `<div>Some content</div>`;
      const expected = "Some content";

      expect(getTagContent(fileContent, "<div>", "</div>")).toBe(expected);
    });

    test("When fileContent does not contain the startTag, should return empty string", () => {
      const fileContent = `<div>Some content</div>`;
      expect(getTagContent(fileContent, "<span>", "</div>")).toBe("");
    });

    test("When fileContent does not contain the endTag, should return empty string", () => {
      const fileContent = `<div>Some content</div>`;
      expect(getTagContent(fileContent, "<div>", "</span>")).toBe("");
    });

    test("When startTag and endTag are the same, should return empty string", () => {
      const fileContent = `<div>Some content</div>`;
      expect(getTagContent(fileContent, "<div>", "<div>")).toBe("");
    });

    test("When includeTag is true, should include startTag and endTag", () => {
      const fileContent = `<div>Some content</div>`;
      const expected = `<div>Some content</div>`;

      expect(getTagContent(fileContent, "<div>", "</div>", true)).toBe(
        expected
      );
    });

    test("When fileContent is empty, should return empty string", () => {
      const fileContent = "";
      expect(getTagContent(fileContent, "<div>", "</div>")).toBe("");
    });

    test("When passes any Vue tag and includeTag as false, should return the content between them.", () => {
      const fileContent = `
      <template>
        <div class="example-component">
          <p>{{ message }}</p>
          <button @click="reverseMessage">Reverse Message</button>
        </div>
      </template>`;
      const expected =
        '<div class="example-component">\n          <p>{{ message }}</p>\n          <button @click="reverseMessage">Reverse Message</button>\n        </div>';

      expect(getTagContent(fileContent, "<template>", "</template>")).toBe(
        expected
      );
    });

    test("When passes any Vue tag and includeTag as true, should return the content between them and both tags.", () => {
      const fileContent = `
      <template>
        <div class="example-component">
          <p>{{ message }}</p>
          <button @click="reverseMessage">Reverse Message</button>
        </div>
      </template>`;
      const expected =
        '<template>\n        <div class="example-component">\n          <p>{{ message }}</p>\n          <button @click="reverseMessage">Reverse Message</button>\n        </div>\n      </template>';

      expect(
        getTagContent(fileContent, "<template>", "</template>", true)
      ).toBe(expected);
    });
  });

  describe("getTemplateContent()", () => {
    test("When passes Vue template tag, should return the content between them and both tags.", () => {
      const fileContent = `
      <template>
        <div class="example-component">
          <p>{{ message }}</p>
          <button @click="reverseMessage">Reverse Message</button>
        </div>
      </template>`;
      const expected =
        '<template>\n        <div class="example-component">\n          <p>{{ message }}</p>\n          <button @click="reverseMessage">Reverse Message</button>\n        </div>\n      </template>';

      expect(getTemplateContent(fileContent)).toBe(expected);
    });

    test("When passes Vue template tag empty, should return empty content.", () => {
      const fileContent = "";

      expect(getTemplateContent(fileContent)).toBe("");
    });
  });

  describe("getScriptContent()", () => {
    test("When passes Vue script tag, should return the content between them.", () => {
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
        };`;

      expect(getScriptContent(fileContent, ".vue")).toBe(expected);
    });

    test("When passes Vue script tag empty, should return empty content.", () => {
      const fileContent = "";

      expect(getScriptContent(fileContent, ".vue")).toBe("");
    });

    test("When the file extension is not '.vue', should return the original content.", () => {
      const fileContent = `
      export const someFunction = () => {
        console.log('This is not a Vue file');
      };`;

      expect(getScriptContent(fileContent, ".js")).toBe(fileContent);
    });
  });

  describe("getStyleContent()", () => {
    test("When passes Vue style tag, should return the content between them and both tags.", () => {
      const fileContent = `<style lang="scss">
      .example-component {
        /* Estilos para a classe example-component */
        background-color: #f0f0f0;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      </style>`;
      const expected =
        '<style lang="scss">\n      .example-component {\n        /* Estilos para a classe example-component */\n        background-color: #f0f0f0;\n        padding: 20px;\n        border-radius: 5px;\n        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);\n      }\n      </style>';

      expect(getStyleContent(fileContent)).toBe(expected);
    });

    test("When passes Vue style tag empty, should return empty content.", () => {
      const fileContent = "";

      expect(getStyleContent(fileContent)).toBe("");
    });
  });

  describe("splitfilePath()", () => {
    it("Should return the third part when the regex splits into more than two parts.", () => {
      const filePath = "folder1/folder2/file.txt";
      const regex = /[\\/]/;
      const result = splitfilePath(filePath, regex);
      expect(result).toBe("file.txt");
    });

    it("should return the second part when the regex splits into only two parts.", () => {
      const filePath = "folder1/file.txt";
      const regex = /[\\/]/;
      const result = splitfilePath(filePath, regex);
      expect(result).toBe("file.txt");
    });

    it("should return the original path if the regex does not split the path.", () => {
      const filePath = "file.txt";
      const regex = /[\\/]/;
      const result = splitfilePath(filePath, regex);
      expect(result).toBe("file.txt");
    });

    it("should return the correct part for paths with more than 3 levels.", () => {
      const filePath = "folder1/folder2/folder3/file.txt";
      const regex = /[\\/]/;
      const result = splitfilePath(filePath, regex);
      expect(result).toBe("folder3");
    });

    it("should correctly handle regex that does not split into expected parts.", () => {
      const filePath = "file.txt";
      const regex = /_/;
      const result = splitfilePath(filePath, regex);
      expect(result).toBe("file.txt");
    });

    it("should return undefined when there are not enough parts in the path.", () => {
      const filePath = "";
      const regex = /[\\/]/;
      const result = splitfilePath(filePath, regex);
      expect(result).toBe("");
    });
  });

  describe("insertTagScript()", () => {
    test("Should insert the script tag before </body>", () => {
      const htmlContent = "<html>" + "\n\t<body>" + "\n\t</body>" + "\n</html>";
      const expected =
        "<html>" +
        "\n\t<body>" +
        '\n\t\t<script type="module" src="/src/main.js"></script>' +
        "\n</body>" +
        "\n</html>";

      expect(insertTagScript(htmlContent)).toBe(expected);
    });

    test("Should not alter the content if </body> is missing", () => {
      const htmlContent = `
        <html>
          <head></head>
          <div></div>
        </html>`;

      expect(insertTagScript(htmlContent)).toBe(htmlContent);
    });
  });

  describe("importToVariableName()", () => {
    test("Should convert file name with hyphens to camelCase", () => {
      const importPath = "/path/to/my-component.js";
      const expected = "myComponent";

      expect(importToVariableName(importPath)).toBe(expected);
    });

    test("Should handle file names without hyphens", () => {
      const importPath = "/path/to/component.js";
      const expected = "component";

      expect(importToVariableName(importPath)).toBe(expected);
    });

    test("Should handle nested paths and ignore directories", () => {
      const importPath = "/nested/path/to/another-component.js";
      const expected = "anotherComponent";

      expect(importToVariableName(importPath)).toBe(expected);
    });

    test("Should return empty string if the path does not contain a file name", () => {
      const importPath = "/path/to/";
      const expected = "";

      expect(importToVariableName(importPath)).toBe(expected);
    });
  });

  describe("changeUnescapedInterpolation()", () => {
    test("Should replace unescaped interpolation tags with %...%", () => {
      const texto = "Hello <%= name %>, welcome!";
      const expected = "Hello %name%, welcome!";

      expect(changeUnescapedInterpolation(texto)).toBe(expected);
    });

    test("Should not alter text without <%= %> tags", () => {
      const texto = "Hello, welcome!";

      expect(changeUnescapedInterpolation(texto)).toBe(texto);
    });

    test("Should handle multiple unescaped interpolation tags", () => {
      const texto = "Hello <%= name %>, your age is <%= age %>.";
      const expected = "Hello %name%, your age is %age%.";

      expect(changeUnescapedInterpolation(texto)).toBe(expected);
    });

    test("Should handle edge cases with invalid formatting", () => {
      const texto = "Hello <%name%>, welcome!";
      const expected = "Hello <%name%>, welcome!";

      expect(changeUnescapedInterpolation(texto)).toBe(expected);
    });
  });
});
