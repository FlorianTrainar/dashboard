<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { ref } from 'vue'

import LegacyHeader from './legacy/LegacyHeader.vue'

const route = useRoute()
const showLegacyHeader = ref(false)
const isActive = (name) => route.name === name

const toggleHeader = () => {
  showLegacyHeader.value = !showLegacyHeader.value
}
</script>

<template>
  <!-- TOGGLE BUTTON  -->
  <button
    @click="toggleHeader"
    class="fixed top-2 right-2 z-50 px-3 py-1 text-xs bg-slate-700 text-white rounded"
  >
    {{ showLegacyHeader ? 'NEW UI' : 'OLD UI' }}
  </button>

  <!-- ================= NEW HEADER ================= -->
  <header
    v-if="!showLegacyHeader"
    class="fixed bottom-0 left-0 w-full h-[80px] bg-slate-900/80 backdrop-blur-md z-40"
  >
    <div class="wrapper h-full flex items-center justify-around mx-auto">
      <RouterLink :to="{ name: 'home' }" class="flex flex-col items-center">
        <i-heroicons-calendar-days-solid v-if="isActive('home')" class="text-2xl text-white" />
        <i-heroicons-calendar-days v-else class="text-2xl text-gray-400" />
      </RouterLink>
      <RouterLink :to="{ name: 'dashboard' }" class="flex flex-col items-center">
        <i-heroicons-inbox-stack-solid v-if="isActive('dashboard')" class="text-2xl text-white" />
        <i-heroicons-inbox-stack v-else class="text-2xl text-gray-400" />
      </RouterLink>
      <RouterLink :to="{ name: 'snippet' }" class="flex flex-col items-center">
        <i-heroicons-command-line-solid v-if="isActive('snippet')" class="text-2xl text-white" />
        <i-heroicons-command-line v-else class="text-2xl text-gray-400" />
      </RouterLink>
      <RouterLink :to="{ name: 'client-admin' }" class="flex flex-col items-center">
        <i-heroicons-briefcase-solid v-if="isActive('client-admin')" class="text-2xl text-white" />
        <i-heroicons-briefcase v-else class="text-2xl text-gray-400" />
      </RouterLink>
    </div>
  </header>

  <LegacyHeader v-else />
</template>
