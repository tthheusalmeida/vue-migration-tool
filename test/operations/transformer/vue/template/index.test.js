const {
  templateListenersRemoved,
  eventsPrefixChanged,
  keyCodeModifiers,
} = require("../../../../../src/operations/transformer/vue/template");
const breakingChanges = require("../../../../../src/singletons/breakingChanges");

jest.mock("../../../../../src/singletons/breakingChanges");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("=> operations/transformer/vue/template/index.js", () => {
  describe("templateListenersRemoved()", () => {
    test("When passes an ast with $listeners and $attrs, should be merged into $attrs.", () => {
      const ast = {
        children: [
          {
            attrsMap: {
              "v-on": "$listeners",
              "v-bind": "$attrs",
            },
          },
        ],
      };

      const result = templateListenersRemoved(ast);

      expect(result.children[0].attrsMap["v-bind"]).toBe("$attrs");
      expect(result.children[0].attrsMap["v-on"]).toBeUndefined();
      expect(breakingChanges.increaseCount).toHaveBeenCalled();
    });

    test("When passes an ast with $listeners, should be move into $attrs.", () => {
      const ast = {
        children: [
          {
            attrsMap: {
              "v-on": "$listeners",
            },
          },
        ],
      };

      const result = templateListenersRemoved(ast);

      expect(result.children[0].attrsMap["v-bind"]).toBe("$attrs");
      expect(result.children[0].attrsMap["v-on"]).toBeUndefined();
      expect(breakingChanges.increaseCount).toHaveBeenCalled();
    });
  });

  describe("eventsPrefixChanged()", () => {
    test("When passes an ast without attrsMap, should return current ast.", () => {
      const result = eventsPrefixChanged({ children: [] });

      expect(result).toEqual({ children: [] });
      expect(breakingChanges.increaseCount).not.toHaveBeenCalled();
    });

    test("When passes an ast with v-on lifecycle, should be changed.", () => {
      const ast = {
        children: [
          {
            attrsMap: {
              "@hook:beforeDestroy": "beforeDestroy",
              "@hook:destroyed": "destroyed",
              "@hook:mounted": "mounted",
            },
          },
        ],
      };

      const expected = {
        children: [
          {
            attrsMap: {
              "@vue:beforeUnmount": "beforeUnmount",
              "@vue:unmounted": "unmounted",
              "@vue:mounted": "mounted",
            },
          },
        ],
      };

      const result = eventsPrefixChanged(ast);

      expect(result).toEqual(expected);
      expect(breakingChanges.increaseCount).toHaveBeenCalled();
    });
  });

  describe("keyCodeModifiers()", () => {
    test("When passes an ast without attrsMap, should return current ast.", () => {
      const result = keyCodeModifiers({ children: [] });

      expect(result).toEqual({ children: [] });
      expect(breakingChanges.increaseCount).not.toHaveBeenCalled();
    });

    test("When passes an ast with v-on, should be changed.", () => {
      const ast = {
        children: [
          {
            attrsMap: {
              "v-on:13": "someAction",
            },
          },
        ],
      };

      const expected = {
        children: [
          {
            attrsMap: {
              "v-on:enter": "someAction",
            },
          },
        ],
      };

      const result = keyCodeModifiers(ast);

      expect(result).toEqual(expected);
      expect(breakingChanges.increaseCount).toHaveBeenCalled();
    });

    test("When passes an ast with wrong v-on, should emit changed.", () => {
      const ast = {
        children: [
          {
            attrsMap: {
              "v-on:31209": "someAction",
            },
          },
        ],
      };

      expect(() => keyCodeModifiers(ast)).toThrow(Error);
      expect(breakingChanges.increaseCount).not.toHaveBeenCalled();
    });
  });
});
