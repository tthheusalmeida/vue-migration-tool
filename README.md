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
- [😃 How to contribute](#how-to-contribute)
- [📝 License](#license)

<a id="how-to-use"></a>

## ⚙️ How to use

To use [Vue Migration Tool](https://github.com/tthheusalmeida/vue-migration-tool), your code must follow the standards in this <strong>[Vue Guide](https://v2.vuejs.org/v2/guide/)</strong>.<br>
> ⚠️ If your code has a different implementation than the guide, there may be inconsistencies after migration.<br>

Here we go!
___

Clone the project: 
```
git clone https://github.com/tthheusalmeida/vue-migration-tool.git
```

Install the dependencies:
```
npm install
```

For run the project we have some environment variables:<br>

`REPOSITORY`: HTTPS link from project. <strong>(required)</strong><br>
`BRANCH`: Branch name, if there is no name, <strong>main</strong> is used. <em>(optional)</em><br>

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

Each dependency has its own list with checkboxes. When a checkbox is ✔️, it means the change has been implemented.<br>

Here is a list of breaking changes from each dependency that were implemented in the project:

- [Vue](https://github.com/tthheusalmeida/vue-migration-tool/tree/main/src/operations/transformer/vue/README.md)
- [Vuex](https://github.com/tthheusalmeida/vue-migration-tool/tree/main/src/operations/transformer/vuex/README.md)
- [Vue-Router](https://github.com/tthheusalmeida/vue-migration-tool/tree/main/src/operations/transformer/router/README.md)
- [Vite](https://github.com/tthheusalmeida/vue-migration-tool/tree/main/src/operations/transformer/vite/README.md)
- [Highcharts](https://github.com/tthheusalmeida/vue-migration-tool/tree/main/src/operations/transformer/highcharts/README.md)

Over time, the project may receive more migrations of other plugins, libraries, etc., which can cause breaking changes.

<a id="how-to-contribute"></a>

## 😃 How to contribute
- First, leave ⭐ if you liked it!
- Fork this repository.
- Create a branch for your feature: `git checkout -b my-feature`
- If you are adding a new dependency breaking change:
  1. Create a folder with the dependency's name in `src/operation/tranformer`.
  2. Inside this folder, create a folder for scripts and/or templates.
  3. Create a constant containing all functions from this dependency as `{dependency}_TEMPLATE_TRANSFORM_LIST` or `{dependency}_SCRIPT_TRANSFORM_LIST`.
  4. In `src/operation/tranformer/index.js`, import your constant to `templateRules` or `scriptRules`.
  5. Create a `README.md` file to list breaking changes, whether they have been migrated or not.
  5. Follow the steps below..
- If you are updating an existing dependency breaking change:
  1. Add a breaking change message in `src/utils/message.js`.
  2. Create a function in `src/operation/tranformer/{dependency}/template/index.js` or `src/operation/tranformer/{dependency}/script/index.js`.
  3. Include `showLog` with a new breaking change message in the created function.
  4. Add the created function to `{dependency}_TEMPLATE_TRANSFORM_LIST` or `{dependency}_SCRIPT_TRANSFORM_LIST`.
- Commit: `git commit -m 'feat: my new feature'`
- Push your branch: `git push origin my-feature`

<a id="license"></a>

## 📝 License

This project is under the MIT license. see the [license page](https://opensource.org/licenses/MIT) for more details.<br>

<p align="left">Made by <strong><a href="https://www.linkedin.com/in/matheus-almeida-602139182/">Matheus Almeida</a></strong></p>