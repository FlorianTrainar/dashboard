<script setup>
import { ref, watch, onMounted } from 'vue'

import TaskDialog from './TaskDialog.vue'
import { useTasks } from '@/assets/JS/useTasks'

import { useTaskUtils } from '@/assets/JS/useTaskUtils'
import { useTextareaAutoResize } from '@/assets/JS/useTextareaAutoResize.js'
import { formatSmartDate } from '@/utils/formatDate'

const { resizeAll, resize } = useTextareaAutoResize('.task-textarea')

// PROPS
const props = defineProps({
  tasks: Array,
  onUpdate: Function,

  folderId: String,
  folderTitle: String,
  projectId: String,
  projectTitle: String,
})

const {
  createTask,
  updateTaskDate,
  deleteTask: removeTask,
  toggleTask: toggleTaskLogic,
  shiftTask: shiftTaskLogic,
} = useTasks()

// STATE

const localTasks = ref([])
const { getTaskClass } = useTaskUtils()

const selectedTask = ref(null)
const showDialog = ref(false)
const openTaskDialog = (task) => {
  selectedTask.value = {
    ...task,
    date: task.deadline ? new Date(task.deadline.seconds * 1000).toISOString().split('T')[0] : null,
  }
  showDialog.value = true
}
const updateTaskFromDialog = async (updatedTask) => {
  const index = localTasks.value.findIndex((t) => t.id === updatedTask.id)
  if (index === -1) return

  const task = localTasks.value[index]

  task.recurrence = updatedTask.recurrence

  // 👉 gérer la date
  if (updatedTask.date) {
    await saveDeadline(index, updatedTask.date)
  }

  emitUpdate()
}
const deleteFromDialog = async (task) => {
  const index = localTasks.value.findIndex((t) => t.id === task.id)
  if (index === -1) return

  await deleteTask(index)
}

// INIT
watch(
  () => props.tasks,
  (val) => {
    localTasks.value = (val || []).map((t) => ({
      ...t,
    }))
  },
  { immediate: true },
)

// LOGIQUE

const emitUpdate = () => {
  props.onUpdate(localTasks.value)
}

const sortTasks = () => {
  localTasks.value = [...localTasks.value].sort((a, b) => {
    // done en bas
    if (a.done !== b.done) return a.done ? 1 : -1

    // sans deadline en bas
    if (!a.deadline && b.deadline) return 1
    if (a.deadline && !b.deadline) return -1

    // comparer dates
    if (a.deadline && b.deadline) {
      return a.deadline.seconds - b.deadline.seconds
    }

    return 0
  })

  resizeAll()
}

const addTask = () => {
  const newTask = createTask()

  localTasks.value.push(newTask)

  sortTasks()
  emitUpdate()
}

const shiftTask = (index) => {
  const task = localTasks.value[index]

  shiftTaskLogic(task)

  sortTasks()
  emitUpdate()
}

const deleteTask = (index) => {
  removeTask(localTasks.value, index)
  emitUpdate()
}

const toggleTask = (index) => {
  const task = localTasks.value[index]

  // 🔁 récurrent
  if (!task.done && task.recurrence) {
    shiftTaskLogic(task)
  } else {
    toggleTaskLogic(task)
  }

  sortTasks()
  emitUpdate()
}

const saveDeadline = (index, dateValue) => {
  const task = localTasks.value[index]

  updateTaskDate(task, dateValue)

  sortTasks()
  emitUpdate()
}

// WATCH

onMounted(resizeAll)

// EXPOSE
defineExpose({
  addTask,
})
</script>

<template>
  <ul class="p-1 space-y-1">
    <li
      v-for="(task, index) in localTasks"
      :key="task.id"
      class="rounded-lg overflow-hidden flex flex-col border border-slate-300/50"
    >
      <!-- Header -->
      <div
        v-if="!task.done"
        class="flex items-center justify-between py-1.5 px-2 border-b border-slate-400/50"
      >
        <!-- DEADLINE -->
        <div class="flex items-center gap-2">
          <button @click="openTaskDialog(task)">
            <i-heroicons-cog-6-tooth class="w-6 h-6" />
          </button>

          <p :class="!task.done ? getTaskClass(task.deadline, 'text') : ''">
            {{ formatSmartDate(task.deadline) }}
          </p>
        </div>

        <!-- Check -->
        <button
          v-if="task.recurrence && task.deadline"
          @click="shiftTask(index)"
          class="text-slate-300 flex gap-2"
        >
          <p class="text-sm italic">{{ task.recurrence }}</p>

          <i-heroicons-arrow-path class="w-6 h-6" />
        </button>

        <button v-else @click="toggleTask(index)" class="text-slate-300">
          <i-heroicons-check class="w-6 h-6" />
        </button>
      </div>
      <div
        v-else
        class="flex items-center justify-between py-2 px-2 bg-red-900/60 border-b border-red-100/30"
      >
        <button v-if="task.done" @click="deleteTask(index)" class="text-red-400 flex gap-1">
          <i-heroicons-x-circle-solid class="w-6 h-6" />
          <p>Effacer ?</p>
        </button>
        <button v-if="task.done" @click="toggleTask(index)" class="text-yellow-400 flex gap-2">
          <p>Annuler ?</p>
          <i-heroicons-check-circle class="w-6 h-6" />
        </button>
      </div>

      <!-- TEXTAREA -->
      <div>
        <textarea
          v-model="task.text"
          @input="resize($event.target)"
          @blur="emitUpdate"
          rows="1"
          placeholder="Nouvelle tâche"
          class="block task-textarea w-full px-2 py-1"
          :class="task.done ? 'bg-slate-800 text-slate-500' : 'bg-slate-800 text-slate-50'"
        />
      </div>
    </li>
  </ul>

  <TaskDialog
    :visible="showDialog"
    :task="selectedTask"
    @close="showDialog = false"
    @update="updateTaskFromDialog"
    @delete="deleteFromDialog"
  />
</template>
