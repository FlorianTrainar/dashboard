<script setup>
import { ref, computed } from 'vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

// PROPS
const props = defineProps({
  folder: Object,
})

// EMITS
const emit = defineEmits(['update-project', 'delete-project', 'add-item', 'move-project'])

// STATE
const showConfirm = ref(false)
const projectToDelete = ref(null)

// DELETE PROJECT
const askDelete = (projectId) => {
  projectToDelete.value = projectId
  showConfirm.value = true
}

const confirmDelete = () => {
  emit('delete-project', projectToDelete.value)
  showConfirm.value = false
  projectToDelete.value = null
}

const moveUp = (project) => {
  if (!project.order || project.order === 1) return
  emit('move-project', project.id, project.order - 1)
}

const moveDown = (project) => {
  const max = props.folder.projects.length
  if (!project.order || project.order === max) return
  emit('move-project', project.id, project.order + 1)
}

const sortedProjects = computed(() => {
  return [...(props.folder.projects || [])].sort((a, b) => (a.order || 0) - (b.order || 0))
})
</script>
<template>
  <!-- ================= PROJECTS ================= -->
  <TransitionGroup tag="div" name="list" class="flex flex-col gap-1 md:gap-3 px-1">
    <div
      v-for="project in sortedProjects"
      :key="project.id"
      class="bg-slate-900 rounded-lg flex flex-col border border-slate-400/50 pb-4 gap-2 mb-3"
    >
      <div
        class="flex items-center justify-between rounded-t-lg p-2 gap-2 bg-blue-500/30 border-b border-slate-400/20"
      >
        <!-- ORDER -->
        <div class="flex items-center gap-1">
          <button @click="moveUp(project)">
            <i-heroicons-arrow-up class="w-5 h-5" />
          </button>
          <button @click="moveDown(project)">
            <i-heroicons-arrow-down class="w-5 h-5" />
          </button>
        </div>
        <!-- TITLE -->
        <div class="flex gap-1 flex-1">
          <input
            v-model="project.title"
            @blur="emit('update-project', project.id, { title: project.title })"
            class="bg-transparent rounded-lg text-white outline-none text-lg md:text-xl font-semibold"
            placeholder="Nom du projet"
          />
        </div>

        <!-- DELETE -->
        <button @click="askDelete(project.id)" class="text-red-500">
          <i-heroicons-trash-solid class="w-6 h-6" />
        </button>
      </div>

      <!-- SLOT (tasks) -->
      <slot name="items" :project="project" />

      <!-- ADD TASK -->
      <button
        @click="emit('add-item', project.id)"
        class="text-green-400 hover:text-green-300 border border-slate-300 rounded-lg bg-green-600 text-slate-300 mx-8"
      >
        <i-heroicons-plus class="w-8 h-8 mx-auto" />
      </button>
    </div>
  </TransitionGroup>

  <!-- CONFIRM -->
  <ConfirmDialog
    :message="'Supprimer ce projet ?'"
    :visible="showConfirm"
    @confirm="confirmDelete"
    @cancel="showConfirm = false"
  />
</template>
<style scoped>
.list-move {
  transition: transform 0.3s cubic-bezier(0.2, 0, 0, 1);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.2s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
