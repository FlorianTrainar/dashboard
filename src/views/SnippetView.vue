<script setup>
import { ref, computed, watch } from 'vue'
import { selectedFolderIdGlobal } from '@/assets/JS/useDashboardState'

import { useFirebaseFolders } from '@/assets/JS/useFirebaseFolders'
import { useFolderActions } from '@/assets/JS/useFolderAction'

import FolderCard from '@/components/ui/FolderCard.vue'
import FolderContent from '@/components/ui/FolderContent.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import CategoryNavigator from '@/components/ui/CategoryNavigator.vue'

import { useSwipe } from '@/assets/JS/useSwipe'

import SnippetList from '@/components/snippets/SnippetList.vue'

import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

import { useRouter } from 'vue-router'

const router = useRouter()

// 🔥 FIREBASE
const { folders, addFolder, updateFolder, deleteFolder } = useFirebaseFolders('snippetFolders')

// 🔥 STATE
const { showConfirm, openMenuId, openFolder, askDelete, confirmDelete, cancelDelete } =
  useFolderActions(deleteFolder)

const selectedFolder = computed(() => {
  if (!selectedFolderIdGlobal.value) return null
  return folders.value.find((f) => f.id === selectedFolderIdGlobal.value)
})

// Categories

const categories = ['rapide', 'style', 'programme', 'pages', 'JS', 'general']
const assignableCategories = computed(() => categories.filter((c) => c !== 'general'))

const currentIndex = ref(0)

const selectedCategory = computed(() => categories[currentIndex.value])

const selectedIndex = computed({
  get: () => currentIndex.value,
  set: (i) => {
    currentIndex.value = i
  },
})

const nextCategory = () => {
  currentIndex.value = (currentIndex.value + 1) % categories.length
}

const prevCategory = () => {
  currentIndex.value = (currentIndex.value - 1 + categories.length) % categories.length
}

const { onTouchStart, onTouchEnd } = useSwipe({
  onLeft: nextCategory,
  onRight: prevCategory,
})

// 🔥 FILTER
const snippetFolders = computed(() => {
  return folders.value
    .filter((f) => {
      if (f.type !== 'snippet') return false

      // GENERAL → tout sauf archives
      if (selectedCategory.value === 'general') {
        return f.category
      }

      return f.category === selectedCategory.value
    })
    .sort((a, b) => {
      // 1. dossiers sans titre en haut
      if (!a.title && !b.title) return 0
      if (!a.title) return -1
      if (!b.title) return 1

      // 2. tri alphabétique
      return a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' })
    })
})
const canCreateFolder = computed(() => {
  return selectedCategory.value !== 'general'
})

// ================= ACTIONS =================

// FOLDER
const createFolder = async () => {
  if (['general'].includes(selectedCategory.value)) return
  await addFolder(selectedCategory.value, 'snippet')
}

const closeFolder = () => {
  selectedFolderIdGlobal.value = null
}

// ================= PROJECTS =================

const normalizeOrders = (projects) => {
  return projects
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((p, index) => ({
      ...p,
      order: index + 1,
    }))
}

const addProject = () => {
  const projects = [...(selectedFolder.value.projects || [])]

  const shifted = projects.map((p) => ({
    ...p,
    order: (p.order || 0) + 1,
  }))

  const newProject = {
    id: crypto.randomUUID(),
    title: '',
    snippets: [],
    order: 1,
  }

  const normalized = normalizeOrders([newProject, ...shifted])

  updateFolder(selectedFolder.value.id, {
    ...selectedFolder.value,
    projects: normalized,
  })
}

const updateProject = (projectId, data) => {
  const updated = [...(selectedFolder.value.projects || [])]

  const index = updated.findIndex((p) => p.id === projectId)
  if (index === -1) return

  updated[index] = {
    ...updated[index],
    ...data,
  }

  updateFolder(selectedFolder.value.id, {
    ...selectedFolder.value,
    projects: updated,
  })
}

const deleteProject = (projectId) => {
  const filtered = selectedFolder.value.projects.filter((p) => p.id !== projectId)

  const normalized = normalizeOrders(filtered)

  updateFolder(selectedFolder.value.id, {
    ...selectedFolder.value,
    projects: normalized,
  })
}

const moveProject = (projectId, newOrder) => {
  const projects = [...(selectedFolder.value.projects || [])]

  const moved = projects.find((p) => p.id === projectId)
  if (!moved) return

  const oldOrder = moved.order || 0

  projects.forEach((p) => {
    if (p.id === projectId) return

    if (newOrder < oldOrder) {
      if (p.order >= newOrder && p.order < oldOrder) p.order++
    }

    if (newOrder > oldOrder) {
      if (p.order <= newOrder && p.order > oldOrder) p.order--
    }
  })

  moved.order = newOrder

  const normalized = normalizeOrders(projects)

  updateFolder(selectedFolder.value.id, {
    ...selectedFolder.value,
    projects: normalized,
  })
}
const addSnippet = (projectId) => {
  console.log('🔥 ADD SNIPPET', projectId)

  const project = selectedFolder.value.projects.find((p) => p.id === projectId)
  if (!project) return

  const snippets = [...(project.snippets || [])]

  snippets.push({
    id: crypto.randomUUID(),
    title: '',
    content: '',
  })

  updateProject(projectId, { snippets })
}

watch(
  folders,
  (newFolders, oldFolders) => {
    const newFolder = newFolders.find((f) => !oldFolders.some((o) => o.id === f.id))

    if (newFolder) {
      openMenuId.value = newFolder.id
    }
  },
  { deep: true },
)
</script>

<template>
  <main class="wrapper" @touchstart="onTouchStart" @touchend="onTouchEnd">
    <!-- LIST -->
    <div v-if="!selectedFolder">
      <PageHeader :showCreate="canCreateFolder" @create="createFolder">
        <template #center>
          <CategoryNavigator v-model:index="selectedIndex" :categories="categories" />
        </template>
      </PageHeader>

      <Transition name="fade" mode="out-in">
        <div :key="selectedCategory" class="flex justify-around flex-wrap">
          <FolderCard
            v-for="folder in snippetFolders"
            :key="folder.id"
            :id="folder.id"
            :title="folder.title"
            :category="folder.category"
            :categories="assignableCategories"
            @open="() => openFolder(folder)"
            @delete="askDelete"
            @update:title="(title) => updateFolder(folder.id, { title })"
            @update:category="(cat) => updateFolder(folder.id, { category: cat })"
            :openId="openMenuId"
            @toggle-menu="openMenuId = $event"
          />
        </div>
      </Transition>
    </div>

    <!-- DETAIL -->
    <div v-else>
      <PageHeader
        :title="selectedFolder.title || 'Dossier Sans titre'"
        :showBack="true"
        @back="closeFolder"
        :showCreate="true"
        @create="addProject"
      >
        <template #icon>
          <i-heroicons-folder-open-solid class="text-blue-400 text-xl md:text-2xl" />
        </template>
      </PageHeader>

      <FolderContent
        :folder="selectedFolder"
        @update-project="(id, data) => updateProject(id, data)"
        @delete-project="deleteProject"
        @add-item="addSnippet"
        @move-project="moveProject"
      >
        <template #items="{ project }">
          <snippetList
            :snippets="project.snippets"
            :onUpdate="(snippets) => updateProject(project.id, { snippets })"
          />
        </template>
      </FolderContent>
    </div>
  </main>

  <ConfirmDialog
    :message="'Supprimer ce dossier ?'"
    :visible="showConfirm"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />
</template>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
