<p align="right">
  <a href="https://github.com/tthheusalmeida/vue-migration-tool/tree/main?tab=readme-ov-file#breaking-changes">
    Back to 🔨 Breaking Changes ⬅️
  </a>
</p>

## Vue-Router

Documentation with breaking changes can be found [here](https://router.vuejs.org/guide/migration/).

- [X] `new Router` becomes `createRouter`.
- [X] New `history` option to replace `mode`.
- [X] Moved the base option.
- [ ] Removal of the fallback option.
- [ ] Removed * (star or catch all) routes.
- [ ] The currentRoute property is now a ref().
- [ ] Replaced `onReady` with `isReady`.
- [ ] scrollBehavior changes.
- [ ] &lt;router-view&gt;, &lt;keep-alive&gt;, and &lt;transition&gt;.
- [ ] Removal of append prop in &lt;router-link&gt;.
- [ ] Removal of event and tag props in &lt;router-link&gt;.
- [ ] Removal of the exact prop in &lt;router-link&gt;.
- [ ] Navigation guards in mixins are ignored.
- [ ] Removal of `router.match` and changes to `router.resolve`.
- [ ] Removal of `router.getMatchedComponents()`.
- [ ] Redirect records cannot use special paths.
- [ ] All navigations are now always asynchronous.
- [ ] Removal of `router.app`.
- [ ] Passing content to route components' &lt;slot&gt;.
- [ ] Removal of `parent` from route locations.
- [ ] Removal of `pathToRegexpOptions`.
- [ ] Removal of unnamed parameters.
- [ ] Usage of `history.state`.
- [ ] `routes` option is required in `options`.
- [ ] Non existent named routes.
- [ ] Missing required `params` on named routes.
- [ ] Named children routes with an empty `path` no longer appends a slash.
- [ ] `$route` properties Encoding.
- [ ] TypeScript changes.