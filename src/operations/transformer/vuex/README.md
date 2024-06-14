<p align="right">
  <a href="https://github.com/tthheusalmeida/vue-migration-tool/tree/main?tab=readme-ov-file#breaking-changes">
    Back to 🔨 Breaking Changes ⬅️
  </a>
</p>

## Vuex

Documentation with breaking changes can be found [here](https://vuex.vuejs.org/guide/migrating-to-4-0-from-3-x.html).

#### Installation process
- [X] To install Vuex to a Vue instance, pass the store instead of Vuex.

#### TypeScript support
- [ ] When used with TypeScript, you must declare your own module augmentation.

#### Bundles are now aligned with Vue 3
- [ ] vuex.global(.prod).js
  - [ ] When used with TypeScript, you must declare your own module augmentation.
  - [ ] Global build is built as IIFE, and not UMD, and is only meant for direct use with &lt;script src="..."&gt;.
  - [ ] Contains hard-coded prod/dev branches and the prod build is pre-minified. Use the .prod.js files for production.
- [ ] vuex.esm-browser(.prod).js
  - [ ] For use with native ES module imports including module supporting browsers via &lt;script type="module"&gt;.
- [ ] vuex.esm-bundler.js
  - [ ] For use with bundlers such as webpack, rollup and parcel.
  - [ ] Leaves prod/dev branches with process.env.NODE_ENV guards (must be replaced by bundler).
  - [ ] Does not ship minified builds (to be done together with the rest of the code after bundling).
- [ ] vuex.cjs.js
  - [ ] For use in Node.js server-side rendering with require().

#### `createLogger` function is exported from the core module
- [ ] In Vuex 3, createLogger function was exported from vuex/dist/logger but it's now included in the core package. The function should be imported directly from the vuex package.