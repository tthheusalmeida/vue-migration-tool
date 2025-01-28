const {
  renameHighchartsTag,
} = require("../../../../../src/operations/transformer/highcharts/template/index");

describe("=> operations/transformer/highcharts/template/index.js", () => {
  describe("renameHighchartsTag()", () => {
    test("When passes an ast with import of Chart, should remove highchart import on ast.", async () => {
      const ast = {
        type: 1,
        tag: "template",
        attrsList: [],
        attrsMap: {},
        rawAttrsMap: {},
        children: [
          {
            type: 1,
            tag: "div",
            attrsList: [],
            attrsMap: { class: "chart" },
            rawAttrsMap: {},
            children: [
              {
                type: 1,
                tag: "HiGhChaRts",
                attrsList: [{ name: ":options", value: "chartOptions" }],
                attrsMap: { ":options": "chartOptions" },
                rawAttrsMap: {},
                children: [],
                plain: false,
                hasBindings: true,
                attrs: [
                  {
                    name: "options",
                    value: "chartOptions",
                    dynamic: false,
                  },
                ],
                static: false,
                staticRoot: false,
              },
            ],
            plain: false,
            staticClass: '"chart"',
            static: false,
            staticRoot: false,
          },
        ],
        plain: true,
        static: false,
        staticRoot: false,
      };

      const expected = {
        type: 1,
        tag: "template",
        attrsList: [],
        attrsMap: {},
        rawAttrsMap: {},
        children: [
          {
            type: 1,
            tag: "div",
            attrsList: [],
            attrsMap: { class: "chart" },
            rawAttrsMap: {},
            children: [
              {
                type: 1,
                tag: "Highcharts",
                attrsList: [{ name: ":options", value: "chartOptions" }],
                attrsMap: { ":options": "chartOptions" },
                rawAttrsMap: {},
                children: [],
                plain: false,
                hasBindings: true,
                attrs: [
                  { name: "options", value: "chartOptions", dynamic: false },
                ],
                static: false,
                staticRoot: false,
              },
            ],
            plain: false,
            staticClass: '"chart"',
            static: false,
            staticRoot: false,
          },
        ],
        plain: true,
        static: false,
        staticRoot: false,
      };

      expect(await renameHighchartsTag(ast)).toStrictEqual(expected);
    });
  });
});
