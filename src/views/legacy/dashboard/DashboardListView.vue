<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import FolderCard from '@/components/ui/FolderCard.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import { useFirebaseFolders } from '@/assets/JS/useFirebaseFolders'

// 🔥 DATA
const { folders, addFolder, updateFolder, deleteFolder } = useFirebaseFolders()

const router = useRouter()

// 🔥 STATE
const showConfirm = ref(false)
const folderToDelete = ref(null)

// 🔥 CATEGORIES (dashboard uniquement)
const categories = ['codes', 'admin', 'projets', 'archives']

const dashboardFolders = computed(() => folders.value.filter((f) => f.type === 'dashboard'))

// 🔥 ACTIONS

const createFolder = async () => {
  await addFolder('codes', 'dashboard') // catégorie par défaut
}

const openFolder = (id) => {
  router.push(`/dashboard/${id}`)
}

const askDelete = (id) => {
  folderToDelete.value = id
  showConfirm.value = true
}

const confirmDelete = async () => {
  if (folderToDelete.value) {
    await deleteFolder(folderToDelete.value)
  }
  showConfirm.value = false
  folderToDelete.value = null
}

const cancelDelete = () => {
  showConfirm.value = false
  folderToDelete.value = null
}
</script>

<template>
  <main class="max-w-2xl mx-auto px-4 pt-6 pb-24 space-y-4">
    <!-- HEADER -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-white">Dashboard</h1>

      <!-- ADD -->
      <button
        @click="createFolder"
        class="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white text-sm transition"
      >
        <i-heroicons-plus class="w-5 h-5" />
        Nouveau
      </button>
    </div>

    <!-- LIST -->
    <div v-if="folders.length" class="space-y-3">
      <FolderCard
        v-for="folder in dashboardFolders"
        :key="folder.id"
        :id="folder.id"
        :title="folder.title"
        :category="folder.category"
        :categories="categories"
        @open="openFolder"
        @delete="askDelete"
        @archive="(id) => updateFolder(id, { category: 'archives' })"
        @update:title="(title) => updateFolder(folder.id, { title })"
        @update:category="(cat) => updateFolder(folder.id, { category: cat })"
      />
    </div>

    <!-- EMPTY -->
    <div v-else class="text-center text-gray-400 mt-10">Aucun dossier</div>
  </main>

  <!-- CONFIRM DELETE -->
  <ConfirmDialog
    :message="'Supprimer ce dossier ?'"
    :visible="showConfirm"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />
</template>
