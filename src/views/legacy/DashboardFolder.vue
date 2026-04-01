<script setup>
import { ref, computed } from 'vue'
import ConfirmDialog from '../ui/ConfirmDialog.vue'
import ProjectContainer from './ProjectContainer.vue'

// === PROPS
const props = defineProps({
  folder: Object,
  onUpdate: Function,
  onDelete: Function,
})

// === STATE
const showArchived = ref(false)
const showConfirm = ref(false)

// === ADD PROJECT
const addProject = () => {
  const updated = [
    ...(props.folder.projects || []),
    {
      id: crypto.randomUUID(),
      title: '',
      tasks: [],
      active: true,
      archived: false,
    },
  ]

  props.onUpdate(props.folder.id, {
    ...props.folder,
    projects: updated,
  })
}

// === UPDATE PROJECT
const updateProject = (project, data) => {
  const updated = [...(props.folder.projects || [])]

  const cleanedData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined))

  const index = updated.findIndex((p) => p.id === project.id)
  if (index === -1) return

  updated[index] = {
    ...updated[index],
    ...cleanedData,
  }

  props.onUpdate(props.folder.id, {
    ...props.folder,
    projects: updated,
  })
}

// === DELETE PROJECT
const deleteProject = (project) => {
  const updated = (props.folder.projects || []).filter((p) => p.id !== project.id)

  props.onUpdate(props.folder.id, {
    ...props.folder,
    projects: updated,
  })
}

// === DELETE FOLDER
const confirmDelete = () => {
  props.onDelete(props.folder.id)
  showConfirm.value = false
}

const cancelDelete = () => {
  showConfirm.value = false
}

// === FILTERS
const visibleProjects = computed(() => (props.folder.projects || []).filter((p) => !p.archived))

const archivedProjects = computed(() => (props.folder.projects || []).filter((p) => p.archived))
</script>

<template>
  <div class="space-y-4">
    <!-- PROJECTS -->
    <ProjectContainer
      v-for="project in visibleProjects"
      :key="project.id"
      :project="project"
      :onUpdate="(id, data) => updateProject(project, data)"
      :onDelete="() => deleteProject(project)"
    />

    <!-- ARCHIVED -->
    <div v-if="showArchived">
      <ProjectContainer
        v-for="project in archivedProjects"
        :key="'archived-' + project.id"
        :project="project"
        :onUpdate="(id, data) => updateProject(project, data)"
        :onDelete="() => deleteProject(project)"
      />
    </div>

    <!-- ACTIONS -->
    <div class="flex gap-3 pt-2">
      <!-- ADD -->
      <button @click="addProject" class="text-green-400 hover:text-green-300">
        <i-heroicons-plus-circle-solid class="w-7 h-7" />
      </button>

      <!-- ARCHIVE TOGGLE -->
      <button @click="showArchived = !showArchived">
        <i-heroicons-archive-box-x-mark-solid v-if="showArchived" class="w-6 h-6 text-yellow-400" />
        <i-heroicons-archive-box-solid v-else class="w-6 h-6 text-gray-400" />
      </button>

      <!-- DELETE FOLDER -->
      <button @click="showConfirm = true" class="ml-auto text-red-500 hover:text-red-400">
        <i-heroicons-trash-solid class="w-6 h-6" />
      </button>
    </div>
  </div>

  <!-- CONFIRM -->
  <ConfirmDialog
    :message="`Supprimer ce dossier ?`"
    :visible="showConfirm"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />
</template>
