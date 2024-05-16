<template>
  <div id="header_id">HOWDY {{ name }}</div>
</template>

<script>
import { createApp } from "vue";
new createApp({
  data() {
    return {
      name: 'john doe'
    };
  }
}).mount("#app")
</script>


