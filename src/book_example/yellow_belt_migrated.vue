
<script>
import { createApp } from "vue";
new createApp({
  data: () => ({
    name: 'Tony'
  }),
  created: function () {
    console.log('Vue instance has been created!');
  }
}).mount("#app")
</script>


