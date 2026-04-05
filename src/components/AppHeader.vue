<script setup>
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const isActive = (name) => route.name === name
</script>

<template>
  <!-- ================= NEW HEADER ================= -->
  <header class="fixed bottom-0 left-0 w-full h-[80px] bg-slate-900/80 backdrop-blur-md z-40">
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
</template>
