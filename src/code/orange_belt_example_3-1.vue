<template>
  <div id="header_id">
    HOWDY {{ name }}
  </div>
</template>

<script>
  var vm = new Vue({
    el: '#app',
    data: {
      name: 'john doe',
    }
  });
</script>