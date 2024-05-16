<template>
  <div id="header_id">HOWDY {{ upper(name) }} .</div>
</template>

<script>
import { createApp } from "vue";
new createApp({
  data() {
    return {
      name: 'john doe'
    };
  },
  filters: {
    upper: function (value) {
      return value.toUpperCase();
    }
  }
}).mount("#app")
</script>


