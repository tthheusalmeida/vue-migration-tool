<template>
  <div v-bind:id="header_id">Hello {{ name }}</div>
</template>

<script>
import { createApp } from "vue";
new createApp({
  data() {
    return {
      name: 'Tony',
      header_id: 'greeting'
    };
  }
}).mount("#app")
</script>


