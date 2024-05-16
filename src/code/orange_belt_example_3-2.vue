<template>
  <div id="header_id">
    HOWDY {{ name | upper }}.
  </div>
</template>

<script>
  var vm = new Vue({
    el: '#app',
    data: {
      name: 'john doe',
    },
    filters: {
      upper: function (value) {
        return value.toUpperCase();
      }
    }
  });
</script>