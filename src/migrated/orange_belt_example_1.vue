<template>
  <div id="app">{{ name }}</div>
</template>

<script>
import { createApp } from "vue";
new createApp({
  data() {
    return {
      name: 'Tony'
    };
  }
}).mount("#app")
</script>


