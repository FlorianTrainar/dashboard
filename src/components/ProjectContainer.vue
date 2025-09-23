<script setup>
import { ref, watch } from 'vue'
import ConfirmDialog from './ConfirmDialog.vue'

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

// === Ajouter une tâche
function addTask() {
  tasks.value.push({ text: '', done: false })
}

function deleteTask(index) {
  tasks.value.splice(index, 1)
}

// === Toggle tâche
function toggleTask(index) {
  const task = tasks.value[index]
  task.done = !task.done
  // Re-trier les tâches : non terminées d’abord
  tasks.value = [...tasks.value.filter((t) => !t.done), ...tasks.value.filter((t) => t.done)]
}

// === Modifier texte tâche
function updateTaskText(index, newText) {
  tasks.value[index].text = newText
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

// === Mise à jour projet
function emitUpdate() {
  props.onUpdate(props.project.id, {
    title: title.value,
    tasks: tasks.value,
    archived: archived.value,
    category: archived.value ? 'archives' : originalCategory.value,
    originalCategory: originalCategory.value,
  })
}

// === Sauvegarde automatique
watch([title, tasks, archived], emitUpdate, { deep: true })
</script>

<template>
  <div class="project-container" :class="{ done: archived }">
    <div class="project">
      <button class="add-btn" @click="addTask">
        <font-awesome-icon icon="square-plus" />
      </button>

      <input v-model="title" class="title" placeholder="Nom du projet" />

      <button class="archive-btn" @click="toggleArchive">
        <font-awesome-icon :icon="archived ? 'box-open' : 'box-archive'" />
      </button>

      <button v-if="archived" class="delete-btn" @click="showConfirm = true">
        <font-awesome-icon icon="trash" />
      </button>
    </div>

    <ul class="project-content">
      <li v-for="(task, index) in tasks" :key="index" class="task" :class="{ done: task.done }">
        <button @click="toggleTask(index)">
          <font-awesome-icon icon="check" />
        </button>
        <input
          v-model="task.text"
          @input="updateTaskText(index, task.text)"
          placeholder="Nouvelle tâche"
        />
        <button v-if="task.done" @click="deleteTask(index)">
          <font-awesome-icon icon="circle-xmark" />
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
/* Tu peux ajouter ton style ici */
</style>
