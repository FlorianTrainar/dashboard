<script setup>
import { ref, computed, watch } from 'vue'
import { selectedFolderIdGlobal, selectedProjectIdGlobal } from '@/assets/JS/useDashboardState'

import { useFirebaseFolders } from '@/assets/JS/useFirebaseFolders'
import { useFolderActions } from '@/assets/JS/useFolderAction'

import FolderCard from '@/components/ui/FolderCard.vue'
import FolderContent from '@/components/ui/FolderContent.vue'
import PageHeader from '@/components/ui/PageHeader.vue'

import TaskList from '@/components/dashboard/TaskList.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import CategoryNavigator from '@/components/ui/CategoryNavigator.vue'

import { useSwipe } from '@/assets/JS/useSwipe'

import { useRouter } from 'vue-router'

const router = useRouter()

// 🔥 FIREBASE
const { folders, addFolder, updateFolder, deleteFolder } = useFirebaseFolders('taskFolders')

// 🔥 STATE
const { showConfirm, openMenuId, openFolder, askDelete, confirmDelete, cancelDelete } =
  useFolderActions(deleteFolder)

const selectedFolder = computed(() => {
  if (!selectedFolderIdGlobal.value) return null

  return folders.value.find((f) => f.id === selectedFolderIdGlobal.value)
})

// Categories

const categories = ['codes', 'admin', 'projets', 'general', 'archives']
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

// 🔥 REF vers TaskList
const taskRefs = ref({})

// 🔥 FILTER
const dashboardFolders = computed(() => {
  return folders.value
    .filter((f) => {
      if (f.type !== 'dashboard') return false

      // GENERAL → tout sauf archives
      if (selectedCategory.value === 'general') {
        return f.category !== 'archives'
      }

      // ARCHIVES → uniquement archives
      if (selectedCategory.value === 'archives') {
        return f.category === 'archives'
      }

      // NORMAL
      return f.category === selectedCategory.value
    })
    .sort((a, b) => {
      if (!a.title && !b.title) return 0
      if (!a.title) return -1
      if (!b.title) return 1
      return a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' })
    })
})

const canCreateFolder = computed(() => {
  return selectedCategory.value !== 'general' && selectedCategory.value !== 'archives'
})

// ================= ACTIONS =================

const toHome = () => {
  router.push({ name: 'home' })
}

// FOLDER
const createFolder = async () => {
  if (selectedCategory.value === 'general' || selectedCategory.value === 'archives') {
    return
  }

  await addFolder(selectedCategory.value, 'dashboard')
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

// ADD PROJECT
const addProject = () => {
  const projects = [...(selectedFolder.value.projects || [])]

  const shifted = projects.map((p) => ({
    ...p,
    order: (p.order || 0) + 1,
  }))

  const newProject = {
    id: crypto.randomUUID(),
    title: '',
    tasks: [],
    active: true,
    archived: false,
    order: 1,
  }

  const normalized = normalizeOrders([newProject, ...shifted])

  updateFolder(selectedFolder.value.id, {
    ...selectedFolder.value,
    projects: normalized,
  })
}

// UPDATE PROJECT
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

// DELETE PROJECT

const deleteProject = async (projectId) => {
  const folderId = selectedFolder.value.id

  const filtered = selectedFolder.value.projects.filter((p) => p.id !== projectId)

  const normalized = normalizeOrders(filtered)

  updateFolder(folderId, {
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
      if (p.order >= newOrder && p.order < oldOrder) {
        p.order++
      }
    }

    if (newOrder > oldOrder) {
      if (p.order <= newOrder && p.order > oldOrder) {
        p.order--
      }
    }
  })

  moved.order = newOrder

  const normalized = normalizeOrders(projects)

  updateFolder(selectedFolder.value.id, {
    ...selectedFolder.value,
    projects: normalized,
  })
}

// ================= Tasks =================

const handleAddTask = (projectId) => {
  taskRefs.value[projectId]?.addTask()
}

watch(selectedFolderIdGlobal, () => {
  selectedProjectIdGlobal.value = null
})

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
    <!-- ================= LIST ================= -->
    <div v-if="!selectedFolder">
      <PageHeader
        :showCreate="canCreateFolder"
        :showBack="true"
        @back="toHome"
        @create="createFolder"
      >
        <template #center>
          <CategoryNavigator v-model:index="selectedIndex" :categories="categories" />
        </template>
      </PageHeader>

      <!-- LIST -->
      <Transition name="fade" mode="out-in">
        <div :key="selectedCategory" class="flex justify-around flex-wrap">
          <FolderCard
            v-for="folder in dashboardFolders"
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

    <!-- ================= DETAIL ================= -->
    <div v-else>
      <PageHeader
        :title="selectedFolder.title || 'Dossier Sans titre'"
        :showBack="true"
        @back="closeFolder"
        :showCreate="true"
        @create="addProject"
      >
        <template #icon>
          <i-heroicons-folder-open-solid class="text-blue-400 text-xl md:text-2xl" /> </template
      ></PageHeader>

      <!-- CONTENT -->
      <FolderContent
        :folder="selectedFolder"
        :openProjectId="selectedProjectIdGlobal"
        @update-project="(id, data) => updateProject(id, data)"
        @delete-project="deleteProject"
        @add-item="handleAddTask"
        @move-project="moveProject"
      >
        <template #items="{ project }">
          <TaskList
            :ref="(el) => (taskRefs[project.id] = el)"
            :tasks="project.tasks"
            :folderId="selectedFolder.id"
            :folderTitle="selectedFolder.title"
            :projectId="project.id"
            :projectTitle="project.title"
            :onUpdate="(tasks) => updateProject(project.id, { tasks })"
          />
        </template>
      </FolderContent>
    </div>
  </main>

  <!-- CONFIRM -->
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
