<script setup>
import { RouterView } from 'vue-router'

import AppHeader from './components/AppHeader.vue'
</script>

<template>
  <body>
    <AppHeader />
    <RouterView />
  </body>
</template>

<style scoped>
body {
  display: flex;
}
</style>
