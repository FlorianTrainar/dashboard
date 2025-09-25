<script setup>
import { ref, watch, onMounted } from 'vue'
import ConfirmDialog from './ConfirmDialog.vue'

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
const archived = ref(props.project.category === 'archives')
const originalCategory = ref(props.project.originalCategory || props.project.category)

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
}

// === Archiver / désarchiver
function toggleArchive() {
  if (!archived.value) {
    originalCategory.value = props.project.category
    archived.value = true
  } else {
    archived.value = false
  }
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
    category: archived.value ? 'archives' : originalCategory.value,
    originalCategory: originalCategory.value,
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
  <div class="item-container" :class="{ done: archived }">
    <div class="item-main" :class="{ active: active }">
      <button class="pause-btn" :class="{ active: active }" @click="toggleProjectActive">
        <font-awesome-icon :icon="active ? 'play' : 'pause'" />
      </button>

      <input v-model="title" class="title" placeholder="Nom du projet" />

      <button v-if="active" class="add-btn" @click="addTask">
        <font-awesome-icon icon="circle-plus" />
      </button>
      <button v-if="active" class="archive-btn" @click="toggleArchive">
        <font-awesome-icon :icon="archived ? 'box-open' : 'box-archive'" />
      </button>

      <button v-if="archived" class="delete-btn" @click="showConfirm = true">
        <font-awesome-icon icon="trash" />
      </button>
    </div>

    <ul v-if="active" class="item-content">
      <li
        v-for="(task, index) in tasks"
        :key="index"
        class="task"
        :class="{ done: task.done, priority: task.priority }"
      >
        <button v-if="task.done" @click="deleteTask(index)" class="delete-btn">
          <font-awesome-icon icon="circle-xmark" />
        </button>
        <button v-else @click="setPriorityTask(index)">
          <font-awesome-icon :icon="task.priority ? 'play' : 'pause'" />
        </button>

        <textarea
          v-model="task.text"
          @input="resize($event.target)"
          class="task-textarea"
          placeholder="Nouvelle tâche"
          rows="1"
        />

        <button @click="toggleTask(index)" class="task-btn">
          <font-awesome-icon icon="check" />
        </button>
      </li>
    </ul>

    <ConfirmDialog
      :message="`Supprimer définitivement le projet '${title}' ?`"
      :visible="showConfirm"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>
<style scoped>
.item-main > .archive-btn {
  margin-left: auto;
}

.task {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}
.task-textarea {
  flex: 1;
  padding: 5px;
  background-color: var(--back-color5-);

  box-shadow: inset 0px 0px 4px var(--back-color2-);
  border: 1px solid var(--back-color1-);

  color: var(--font-color4-);
  font-size: 1.125rem;
  border-radius: 6px;
  resize: none;
  overflow: hidden;
  min-height: 28px;
  font-family: inherit;
}

.task.priority > .task-textarea {
  background-color: var(--active-color-);
}
.task.priority svg {
  color: var(--active-color-);
}
.task.done > .task-textarea {
  text-decoration: line-through;
  background-color: var(--back-color3-);
  color: var(--font-color3-);
  opacity: 1;
}

.task.done > textarea {
  text-decoration: line-through;
  background-color: var(--back-color3-);
  color: var(--font-color3-);
  opacity: 1;
}

@media screen and (max-width: 768px) and (orientation: portrait) {
  .project > .title {
    font-size: 1.35rem;
    width: 100%;
    color: var(--font-color1);
  }
  .project > button {
    font-size: 1.4rem;
  }
  .project > .archive-btn {
    margin-left: 0px;
  }
  .task {
    margin-bottom: 3px;
  }
  .task > textarea {
    padding: 3px;
    background-color: var(--back-color5-);
    font-size: 1rem;
  }
}
</style>
