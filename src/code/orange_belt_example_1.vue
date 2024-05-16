<template>
  <div id="app">
    {{ name }}
  </div>
</template>

<script>
  var vm = new Vue({
    el: '#app',
    data: {
      name: 'Tony',
    }
  });
</script>