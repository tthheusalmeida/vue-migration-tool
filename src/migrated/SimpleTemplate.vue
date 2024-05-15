<template>
  <div class="example-component">
    <p>{{ message }}</p>
    <div @vue:unmounted="unmounted"></div>
    <div @vue:beforeUnmount="beforeUnmount"></div>
    <div @vue:mounted="mounted"></div>
    <input v-on:keyup.enter="submit" />
    <div><input type="text" @click="test()" v-bind="$attrs" /></div>
  </div>
</template>

<script>
export default {
  name: 'SimpleTemplate',
  inheritAttrs: false,
  unmounted() {
    console.log('destroyed hook');
  },
  beforeUnmount() {
    console.log('beforeDestroy hook');
  },
  mounted() {
    console.log('mounted hook');
  },
  methods: {
    test() {
      const {
        submit
      } = this.$listeners;
      console.log('SUBMIT: ', submit);
    }
  }
};
</script>

<style lang="scss">
.example-component {
  /* Estilos para a classe example-component */
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
