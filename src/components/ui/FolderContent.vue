<script setup>
import { ref, computed, watch } from 'vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

// PROPS
const props = defineProps({
  folder: Object,
  openProjectId: String,
})

// EMITS
const emit = defineEmits(['update-project', 'delete-project', 'add-item', 'move-project'])

// STATE
const showConfirm = ref(false)
const projectToDelete = ref(null)
const openProjectMenuId = ref(null)

const toggleProjectMenu = (id) => {
  openProjectMenuId.value = openProjectMenuId.value === id ? null : id
}
const isMenuOpen = (id) => openProjectMenuId.value === id

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
const isProjectEmpty = (project) => {
  return (project.tasks?.length ?? 0) === 0 && (project.snippets?.length ?? 0) === 0
}

watch(
  () => props.openProjectId,
  (id) => {
    if (id) {
      openProjectMenuId.value = id
    }
  },
  { immediate: true },
)
</script>
<template>
  <!-- ================= PROJECTS ================= -->
  <TransitionGroup tag="div" name="list" class="flex flex-col gap-1 md:gap-3 px-1">
    <div
      v-for="project in sortedProjects"
      :key="project.id"
      class="rounded-lg flex flex-col my-1 items-center transition duration-500"
      :class="isMenuOpen(project.id) ? 'border border-slate-300/40 bg-sky-600/30 pt-4 pb-2 ' : ''"
    >
      <!-- Header -->
      <div
        class="flex items-center rounded-t-lg gap-2 w-full px-4"
        :class="isMenuOpen(project.id) ? 'pb-2' : ''"
      >
        <button @click.stop="toggleProjectMenu(project.id)" class="flex items-center">
          <div v-if="!isMenuOpen(project.id)" class="flex gap-1">
            <i-heroicons-pause-solid class="text-2xl text-slate-400" />
            <p class="text-xl md:text-2xl font-semibold">
              {{ project.title }}
            </p>
          </div>
          <i-heroicons-play-solid v-else class="text-2xl text-blue-400" />
        </button>

        <input
          v-if="isMenuOpen(project.id)"
          v-model="project.title"
          @blur="emit('update-project', project.id, { title: project.title })"
          class="rounded-lg px-1 bg-slate-300 text-slate-900 outline-none text-xl md:text-2xl font-semibold w-full"
          placeholder="Nom du projet"
        />
        <div class="flex items-center gap-1 ml-auto">
          <button @click="moveUp(project)">
            <i-heroicons-arrow-up-circle-solid class="text-2xl text-slate-300" />
          </button>
          <button @click="moveDown(project)">
            <i-heroicons-arrow-down-circle-solid class="text-2xl text-slate-300" />
          </button>
        </div>
      </div>

      <section v-if="isMenuOpen(project.id)" class="flex flex-col items-center w-full pb-2">
        <!-- SLOT (tasks) -->
        <div class="w-full">
          <slot name="items" :project="project" />
        </div>

        <!-- ADD TASK -->
        <div class="flex justify-between w-full mt-3 px-4">
          <button
            @click="emit('add-item', project.id)"
            class="text-green-600 border border-slate-300/40 rounded-full bg-slate-100/80 text-2xl font-bold px-6"
          >
            +
          </button>
          <button
            v-if="isProjectEmpty(project)"
            @click="askDelete(project.id)"
            class="flex items-center border border-red-600/50 bg-slate-50/80 rounded-full px-4 text-red-600 font-semibold flex gap-1"
          >
            supprimer

            <i-heroicons-trash-solid class="w-6 h-6" />
          </button>
        </div>
      </section>
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
