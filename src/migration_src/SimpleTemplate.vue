<template>
  <div class="example-component">
    <p>{{ message }}</p>
    <button @click="reverseMessage">Reverse Message</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello Vue!'
    };
  },
  methods: {
    reverseMessage() {
      this.message = this.message.split('').reverse().join('');
    }
  },
  computed: {
    reversedMessageComputed() {
      return this.message.split('').reverse().join('');
    }
  },
  watch: {
    message(newVal, oldVal) {
      console.log('Message changed from', oldVal, 'to', newVal);
    }
  },
  beforeCreate() {
    console.log('beforeCreate hook');
  },
  created() {
    console.log('created hook');
  },
  beforeMount() {
    console.log('beforeMount hook');
  },
  mounted() {
    console.log('mounted hook');
  },
  beforeUpdate() {
    console.log('beforeUpdate hook');
  },
  updated() {
    console.log('updated hook');
  },
  beforeDestroy() {
    console.log('beforeDestroy hook');
  },
  destroyed() {
    console.log('destroyed hook');
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