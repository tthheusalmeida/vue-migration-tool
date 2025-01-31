const fs = require("fs");
const { parse } = require("@babel/parser");
const { compile } = require("vue-template-compiler");
const {
  runParser,
  getTemplateAst,
  getScriptAst,
} = require("../../../src/operations/parser/index.js");
const {
  getTemplateContent,
  getScriptContent,
  getStyleContent,
} = require("../../../src/utils/string");
const {
  stringifyCircularStructureToJson,
} = require("../../../src/utils/object");

jest.mock("fs");
jest.mock("@babel/parser", () => ({ parse: jest.fn() }));
jest.mock("vue-template-compiler", () => ({ compile: jest.fn() }));
jest.mock("../../../src/utils/message", () => ({ showLog: jest.fn() }));
jest.mock("../../../src/utils/string", () => ({
  getTemplateContent: jest.fn(),
  getScriptContent: jest.fn(),
  getStyleContent: jest.fn(),
  splitfilePath: jest.fn(() => "mocked/path"),
}));
jest.mock("../../../src/utils/object", () => ({
  stringifyCircularStructureToJson: jest.fn(),
}));

describe("=> operations/parser", () => {
  describe("runParser()", () => {
    test("When passes file without content, should return AST with template, script and styleString empty.", () => {
      fs.readFileSync.mockReturnValue("");
      const result = runParser("test.vue", "vue");
      expect(result).toEqual({ template: {}, script: {}, styleString: "" });
    });

    test("When passes file content, should return AST.", () => {
      const mockContent =
        "<template><div>Hello</div></template><script>export default {}</script>";
      fs.readFileSync.mockReturnValue(mockContent);
      getTemplateContent.mockReturnValue("<div>Hello</div>");
      getScriptContent.mockReturnValue("export default {}");
      getStyleContent.mockReturnValue(".class { color: red; }");
      compile.mockReturnValue({ compiledTemplate: {} });
      parse.mockReturnValue({ parsedScript: {} });
      stringifyCircularStructureToJson.mockReturnValue(
        '{"template": {}, "script": {}, "styleString": ""}'
      );

      const result = runParser("test.vue", "vue");
      expect(result).toEqual({ template: {}, script: {}, styleString: "" });
      expect(fs.readFileSync).toHaveBeenCalledWith("test.vue", "utf8");
      expect(getTemplateContent).toHaveBeenCalledWith(mockContent);
      expect(getScriptContent).toHaveBeenCalledWith(mockContent, "vue");
      expect(getStyleContent).toHaveBeenCalledWith(mockContent);
    });
  });

  describe("getTemplateAst()", () => {
    test("When passes file content with template, should return AST.", () => {
      getTemplateContent.mockReturnValue("<div>Hello</div>");
      compile.mockReturnValue({ compiledTemplate: {} });
      expect(getTemplateAst("<template><div>Hello</div></template>")).toEqual({
        compiledTemplate: {},
      });
    });

    test("When passes file content without template, should return empty AST.", async () => {
      expect(getScriptAst("")).toEqual({});
    });
  });

  describe("getScriptAst", () => {
    test("should return empty object for empty content", () => {
      expect(getScriptAst("", "vue")).toEqual({});
    });

    test("should parse script content", () => {
      getScriptContent.mockReturnValue("export default {}");
      parse.mockReturnValue({ parsedScript: {} });
      expect(getScriptAst("<script>export default {}</script>", "vue")).toEqual(
        { parsedScript: {} }
      );
    });
  });
});
