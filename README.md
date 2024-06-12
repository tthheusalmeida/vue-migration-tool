<h1 align="center">
  <strong style="font-size: 24px">Vue Migration Tool</strong>
</h1>
<p align="center">
  Better than doing it manually 😁
</p>
<p align="center">
  <a href="https://github.com/tthheusalmeida/vue-migration-tool/blob/main/LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg" target="_blank" />
  </a>
</p>

<p align="left">
  We know that migrations take time, so VMT(Vue Migration Tool) was created to help solve solve this problem.<br>
  Migrating a Vue 2.x project to Vue 3.x.
</p>

## 📂 Table of Contents

- [⚙️ How to use](#how-to-use)
- [🔨 Breaking changes](#breaking-changes)
  - [Vue](#breaking-changes-vue)
- [😃 How to contribute](#how-to-contribute)
- [📝 License](#license)

😃 How to contribute

<a id="how-to-use"></a>

## ⚙️ How to use

Clone the project: 
```
git clone https://github.com/tthheusalmeida/vue-migration-tool.git
```

Install the dependencies:
```
npm install
```

For run the project we have some environment variables:<br>

`REPOSITORY`: HTTPS link from project. <strong style="color: red">(required)</strong><br>
`BRANCH`: Branch name, if there is no name, <strong>main</strong> is used. <span>(optional)</span><br>

Then run one of these commands

#### For main branch:
```
cross-env REPOSITORY=<repository-link> npm start
```
Example: `cross-env REPOSITORY=https://github.com/tthheusalmeida/pokedex.git npm start`

#### For a specific branch:
```
cross-env REPOSITORY=<repository-link> BRANCH=<branch-name> npm start
```
Example: `cross-env REPOSITORY=https://github.com/tthheusalmeida/pokedex.git BRANCH=migrate npm start`

#### For main branch and log info:
```
cross-env REPOSITORY=<repository-link> npm run start:log
```
Example: `cross-env REPOSITORY=https://github.com/tthheusalmeida/pokedex.git npm run start:log`

also works with `BRANCH`:
```
cross-env REPOSITORY=<repository-link> BRANCH=migrate npm run start:log
```
Example: `cross-env REPOSITORY=https://github.com/tthheusalmeida/pokedex.git BRANCH=migrate npm run start:log`

At the end of the execution the code will be available in the `migrated` folder.

Enjoy! 😎

<a id="breaking-changes"></a>

## 🔨 Breaking Changes

Below is a list of breaking changes that were implemented in the project.

The idea is that over time, the project can receive more and more migrations of other plugins, libs, etc., that break during this process.

<a id="breaking-changes-vue"></a>

### Vue

Documentation with breaking changes can be found [here](https://v3-migration.vuejs.org/breaking-changes/).

#### Global API
- [X] Global Vue API is changed to use an application instance
  - TODO: Vue.config.ignoredElements and Vue.prototype
- [ ] Global and internal APIs have been restructured to be tree-shakable

#### Template Directives
- [ ] v-model usage on components has been reworked, replacing v-bind.sync
- [ ] key usage on &lt;template v-for&gt; and non-v-for nodes has changed
- [ ] v-if and v-for precedence when used on the same element has changed
- [ ] v-bind="object" is now order-sensitive
- [ ] v-on:event.native modifier has been removed

#### Components
- [ ] Functional components can only be created using a plain function
- [ ] functional attribute on single-file component (SFC) &lt;template&gt; and functional component - option are deprecated
- [ ] Async components now require defineAsyncComponent method to be created
- [ ] Component events should now be declared with the emits option

#### Render Function
- [ ] Render function API changed
- [ ] $scopedSlots property is removed and all slots are exposed via $slots as functions
- [ ] $listeners has been removed / merged into $attrs
- [ ] $attrs now includes class and style attributes

#### Custom Elements
- [ ] Custom element checks are now performed during template compilation
- [ ] Special is attribute usage is restricted to the reserved &lt;component&gt; tag only

#### Other Minor Changes
- [x] The destroyed lifecycle option has been renamed to unmounted
- [x] The beforeDestroy lifecycle option has been renamed to beforeUnmount
- [ ] Props default factory function no longer has access to this context
- [ ] Custom directive API changed to align with component lifecycle and binding.expression removed
- [x] The data option should always be declared as a function
- [ ] The data option from mixins is now merged shallowly
- [ ] Attributes coercion strategy changed
- [ ] Some transition classes got a rename
- [ ] &lt;TransitionGroup&gt; now renders no wrapper element by default
- [ ] When watching an array, the callback will only trigger when the array is replaced. If you need to - trigger on mutation, the deep option must be specified.
- [ ] &lt;template&gt; tags with no special directives (v-if/else-if/else, v-for, or v-slot) are now treated as plain elements and will result in a native &lt;template&gt; element instead of rendering its inner content.
- [ ] Mounted application does not replace the element it's mounted to
- [x] Lifecycle hook: events prefix changed to vnode-

#### Removed APIs
- [x] keyCode support as v-on modifiers
- [ ] $on, $off and $once instance methods
- [x] Filters
- [ ] Inline templates attributes
- [ ] $children instance property
- [ ] propsData option
- [ ] $destroy instance method. Users should no longer manually manage the lifecycle of individual Vue components.
- [ ] Global functions set and delete, and the instance methods $set and $delete. They are no longer required with proxy-based change detection.

<a id="how-to-contribute"></a>

## 😃 How to contribute
- First, I leave ⭐ if you liked it!
- Fork this repository.
- Create a branch with the features: `git checkout -b my-feature`
- Commit: `git commit -m 'feat: my new feature'`
- Submit your branch: `git push origin my-feature`

<a id="license"></a>

## 📝 License

This project is under the MIT license. see the [license page](https://opensource.org/licenses/MIT) for more details.