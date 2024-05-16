<template>
  <div id="{{ header_id }}">Hello {{ name }}</div>
</template>

<script>
  var vm = new Vue({
    el: '#app',
    data: {
      name: 'Tony',
      header_id: 'greeting',
    }
  });
</script>