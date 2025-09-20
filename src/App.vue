<script setup>
import { RouterView } from 'vue-router'
import HeaderPart from './components/HeaderPart.vue'
</script>

<template>
  <body>
    <HeaderPart />
    <RouterView />
  </body>
</template>

<style scoped>
body {
  display: flex;
}
</style>
