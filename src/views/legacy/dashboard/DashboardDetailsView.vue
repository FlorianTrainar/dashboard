<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useFirebaseFolders } from '@/assets/JS/useFirebaseFolders'
import DashboardFolder from '@/components/dashboard/DashboardFolder.vue'

// ROUTER
const route = useRoute()
const router = useRouter()

const folderId = route.params.id

// FIREBASE
const { folders, updateFolder, deleteFolder } = useFirebaseFolders()

// FIND FOLDER
const folder = computed(() => folders.value.find((f) => f.id === folderId))

// ACTION
const goBack = () => {
  router.push('/dashboard')
}
</script>

<template>
  <main class="max-w-2xl mx-auto px-4 pt-6 pb-24 space-y-4">
    <!-- HEADER -->
    <div class="flex items-center justify-between">
      <button @click="goBack" class="flex items-center gap-2 text-gray-400 hover:text-white">
        <i-heroicons-arrow-left class="w-5 h-5" />
        Retour
      </button>

      <h1 class="text-white font-semibold">
        {{ folder?.title || 'Chargement...' }}
      </h1>

      <div class="w-10"></div>
    </div>

    <!-- CONTENT -->
    <div v-if="folder">
      <DashboardFolder :folder="folder" :onUpdate="updateFolder" :onDelete="deleteFolder" />
    </div>

    <div v-else class="text-center text-gray-400 mt-10">Chargement...</div>
  </main>
</template>
