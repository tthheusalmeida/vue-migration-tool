<template>
  <div class="example-component">
    <p>{{ message }}</p>
    <div @hook:destroyed="destroyed"></div>
    <div @hook:beforeDestroy="beforeDestroy"></div>
    <div @hook:mounted="mounted"></div>
    <input v-on:keyup.13="submit" />
    <div>
      <input type="text" v-on="$listeners" @click="test()" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SimpleTemplate',
  inheritAttrs: false,
  destroyed() {
    console.log('destroyed hook');
  },
  beforeDestroy() {
    console.log('beforeDestroy hook');
  },
  mounted() {
    console.log('mounted hook');
  },
  methods: {
    test() {
      const { submit } = this.$listeners;

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