<script setup>
import { ref, watch, onMounted } from 'vue'
import ConfirmDialog from '../ui/ConfirmDialog.vue'

import { useTextareaAutoResize } from '@/assets/JS/useTextareaAutoResize.js'
const { resizeAll, resize } = useTextareaAutoResize('.task-textarea')

// === Props
const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
  onUpdate: {
    type: Function,
    required: true,
  },
  onDelete: {
    type: Function,
    required: true,
  },
})

// === Références internes (copie défensive des props)
const title = ref(props.project.title || '')
const tasks = ref(Array.isArray(props.project.tasks) ? [...props.project.tasks] : [])
tasks.value = tasks.value.map((task) => ({
  ...task,
  priority: task.priority || false,
}))
const archived = ref(props.project.archived || false)

// === Gestion de la boîte de confirmation
const showConfirm = ref(false)
function confirmDelete() {
  props.onDelete(props.project.id)
  showConfirm.value = false
}
function cancelDelete() {
  showConfirm.value = false
}

// projet actif / paused
const active = ref(typeof props.project.active === 'boolean' ? props.project.active : true)
function toggleProjectActive() {
  active.value = !active.value
  emitUpdate()

  if (active.value) {
    resizeAll()
  }
}

// === Archiver / désarchiver
function toggleArchive() {
  archived.value = !archived.value
  emitUpdate()
}

// === Taches
function sortTasks() {
  tasks.value = [
    ...tasks.value.filter((t) => t.priority && !t.done),
    ...tasks.value.filter((t) => !t.priority && !t.done),
    ...tasks.value.filter((t) => t.done),
  ]
  resizeAll()
}
function addTask() {
  tasks.value.push({ text: '', done: false, priority: false })
  sortTasks()
}
function deleteTask(index) {
  tasks.value.splice(index, 1)
}
function toggleTask(index) {
  const task = tasks.value[index]
  task.done = !task.done
  if (task.done) {
    task.priority = false
  }

  sortTasks()
}
function setPriorityTask(index) {
  const task = tasks.value[index]
  task.priority = !task.priority

  sortTasks()
}

// === Mise à jour projet
function emitUpdate() {
  props.onUpdate(props.project.id, {
    title: title.value,
    tasks: tasks.value,
    archived: archived.value,
    active: active.value,
  })
}

// === Sauvegarde automatique
watch([title, tasks, archived], emitUpdate, { deep: true })

onMounted(() => {
  resizeAll()
})
</script>

<template>
  <div
    class="w-full mb-1 p-1 bg-slate-900 border border-slate-600 rounded-lg"
    :class="{ 'opacity-70': archived }"
  >
    <!-- HEADER -->
    <div class="flex items-center gap-2 px-2 py-1">
      <!-- PLAY / PAUSE -->
      <button
        @click="toggleProjectActive"
        class="text-lg md:text-xl text-gray-400 hover:text-white"
        :class="{ 'text-blue-400': active }"
      >
        <font-awesome-icon :icon="active ? 'play' : 'pause'" />
      </button>

      <!-- TITLE -->
      <input
        v-model="title"
        placeholder="Nom du projet"
        class="flex-1 bg-transparent text-gray-300 md:text-lg px-2 py-1 outline-none focus:text-white"
      />

      <!-- ACTIONS -->
      <div class="flex items-center gap-2">
        <button v-if="active" @click="addTask" class="text-green-400 hover:text-green-300 text-lg">
          <font-awesome-icon icon="circle-plus" />
        </button>

        <button
          v-if="active"
          @click="toggleArchive"
          class="text-yellow-300 hover:text-yellow-200 text-lg"
        >
          <font-awesome-icon :icon="archived ? 'box-open' : 'box-archive'" />
        </button>

        <button
          v-if="archived"
          @click="showConfirm = true"
          class="text-red-500 hover:text-red-400 text-lg"
        >
          <font-awesome-icon icon="trash" />
        </button>
      </div>
    </div>

    <!-- TASK LIST -->
    <ul v-if="active" class="bg-slate-700 p-2 rounded-md space-y-1">
      <li v-for="(task, index) in tasks" :key="index" class="flex items-center gap-2">
        <!-- LEFT BUTTON -->
        <button v-if="task.done" @click="deleteTask(index)" class="text-red-400 hover:text-red-300">
          <font-awesome-icon icon="circle-xmark" />
        </button>

        <button
          v-else
          @click="setPriorityTask(index)"
          class="text-gray-400 hover:text-white"
          :class="{ 'text-blue-400': task.priority }"
        >
          <font-awesome-icon :icon="task.priority ? 'play' : 'pause'" />
        </button>

        <!-- TEXTAREA -->
        <textarea
          v-model="task.text"
          @input="resize($event.target)"
          rows="1"
          placeholder="Nouvelle tâche"
          class="task-textarea flex-1 px-2 py-1 rounded-md resize-none overflow-hidden bg-slate-300 text-slate-900 text-sm md:text-base border border-slate-900 shadow-inner focus:bg-white outline-none"
          :class="[
            task.done && 'line-through bg-slate-500 text-slate-700',
            task.priority && 'bg-blue-400 text-white',
          ]"
        />

        <!-- DONE BUTTON -->
        <button @click="toggleTask(index)" class="text-green-500 hover:text-green-400">
          <font-awesome-icon icon="check" />
        </button>
      </li>
    </ul>

    <!-- CONFIRM -->
    <ConfirmDialog
      :message="`Supprimer définitivement le projet '${title}' ?`"
      :visible="showConfirm"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>
