<script setup>
import { ref, computed } from 'vue'
import { selectedFolderIdGlobal } from '@/assets/JS/useDashboardState'

import { useFirebaseFolders } from '@/assets/JS/useFirebaseFolders'

import FolderCard from '@/components/ui/FolderCard.vue'
import FolderContent from '@/components/ui/FolderContent.vue'
import PageHeader from '@/components/ui/PageHeader.vue'

import TaskList from '@/components/dashboard/TaskList.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import SelectDialog from '@/components/ui/SelectDialog.vue'

import { useRouter } from 'vue-router'

const router = useRouter()

// 🔥 FIREBASE
const { folders, addFolder, updateFolder, deleteFolder } = useFirebaseFolders('taskFolders')

// 🔥 STATE
const selectedFolder = computed(() => {
  if (!selectedFolderIdGlobal.value) return null

  return folders.value.find((f) => f.id === selectedFolderIdGlobal.value)
})
const showConfirm = ref(false)
const folderToDelete = ref(null)

const categories = ['general', 'codes', 'admin', 'projets', 'archives']
const selectedCategory = ref('general')
const showCategoryModal = ref(false)
const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// 🔥 REF vers TaskList
const taskRefs = ref({})

// 🔥 FILTER
const dashboardFolders = computed(() => {
  return folders.value.filter((f) => {
    if (f.type !== 'dashboard') return false
    if (selectedCategory.value === 'general') return true
    return f.category === selectedCategory.value
  })
})

// ================= ACTIONS =================

const toHome = () => {
  router.push({ name: 'home' })
}

// FOLDER
const createFolder = async () => {
  await addFolder('codes', 'dashboard')
}

// OPEN / CLOSE
const openFolder = (folder) => {
  selectedFolderIdGlobal.value = folder.id
}

const closeFolder = () => {
  selectedFolderIdGlobal.value = null
}

// DELETE
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
</script>

<template>
  <main class="wrapper">
    <!-- ================= LIST ================= -->
    <div v-if="!selectedFolder">
      <PageHeader :showCreate="true" :showBack="true" @back="toHome" @create="createFolder">
        <template #center>
          <button
            @click="showCategoryModal = true"
            class="flex text-2xl items-center gap-2 px-3 py-1 rounded-lg text-white"
          >
            {{ capitalize(selectedCategory) }}
            <i-heroicons-chevron-down class="w-4 h-4" />
          </button>
        </template>
      </PageHeader>

      <!-- LIST -->
      <div class="flex flex-col gap-1">
        <FolderCard
          v-for="folder in dashboardFolders"
          :key="folder.id"
          :id="folder.id"
          :title="folder.title"
          :category="folder.category"
          :categories="['codes', 'admin', 'projets', 'archives']"
          @open="() => openFolder(folder)"
          @delete="askDelete"
          @update:title="(title) => updateFolder(folder.id, { title })"
          @update:category="(cat) => updateFolder(folder.id, { category: cat })"
        />
      </div>
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

  <SelectDialog
    v-model="selectedCategory"
    :visible="showCategoryModal"
    :options="categories"
    title="Filtrer par catégorie"
    @close="showCategoryModal = false"
  />
</template>
