<p align="right">
  <a href="https://github.com/tthheusalmeida/vue-migration-tool#breaking-changes">
    Back to 🔨 Breaking Changes ⬅️
  </a>
</p>

## Vite

For Vite, there is a [guide](https://v2.vuejs.org/v2/guide/migration-vue-2-7#Vite) on how to upgrade from Vue-Cli to Vite, but I decided to take a different approach.<br>

Instead, I opted to remove the Vue dependencies and switch directly to version vite@5.2.13. I reviewed the [Vite documentation](https://vitejs.dev/guide/) to understand what changes were made and what functionalities it no longer supports from Vue 2.

Here are some of them:

- [X] Remove `vue.config.js` and add `vite.config.js`.
- [X] `required` is no longer supported in Vite. It's ESM only.
- [X] `process.env` is no longer supported in Vite. Changed to `import.meta.env`.
- [X] Rename environment variables starting with `VUE_` in the `.env` file to `VITE_`.
- [X] The component import must end with `.vue` in the file name.