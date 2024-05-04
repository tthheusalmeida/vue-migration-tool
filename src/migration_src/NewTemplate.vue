<template>
  <div class="example-component">
    <p>{{ message }}</p>
    <button @click="reverseMessage"></button>
  </div>
</template>

<script>
export default {
  unmounted() {
    console.log('destroyed hook');
  },
  beforeUnmount() {
    console.log('beforeDestroy hook');
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
