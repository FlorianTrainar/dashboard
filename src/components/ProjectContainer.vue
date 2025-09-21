<script setup>
import { ref, watch } from 'vue'

import ConfirmDialog from './ConfirmDialog.vue'

const showConfirm = ref(false)

function confirmDelete() {
  props.onDelete(props.project.id)
  showConfirm.value = false
}

function cancelDelete() {
  showConfirm.value = false
}

const props = defineProps({
  project: Object,
  onUpdate: Function,
  onDelete: Function,
})

// === Références réactives
const title = ref(props.project.title)
const tasks = ref([...props.project.tasks])
const archived = ref(props.project.category === 'archives')

// === Sauvegarde de la catégorie originale
const originalCategory = ref(props.project.originalCategory || props.project.category)

// === Ajouter une nouvelle tâche
function addStep() {
  tasks.value.push({ text: '', done: false })
}

// === Basculer l'état d'une tâche
function toggleStep(index) {
  const step = tasks.value[index]
  step.done = !step.done
  tasks.value = [...tasks.value.filter((s) => !s.done), ...tasks.value.filter((s) => s.done)]
}

// === Modifier texte
function updateStepText(index, newText) {
  tasks.value[index].text = newText
}

// === Archiver / désarchiver
function toggleArchive() {
  if (!archived.value) {
    // On archive → on mémorise la catégorie actuelle
    originalCategory.value = props.project.category
    archived.value = true
  } else {
    // On désarchive → on restaure la catégorie originale
    archived.value = false
  }

  emitUpdate()
}

// === Mise à jour
function emitUpdate() {
  props.onUpdate({
    ...props.project,
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
      <button @click="addStep">
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
      <li v-for="(step, index) in tasks" :key="index" class="step" :class="{ done: step.done }">
        <button @click="toggleStep(index)">
          <font-awesome-icon icon="check" />
        </button>
        <input
          v-model="step.text"
          @input="updateStepText(index, step.text)"
          placeholder="Nouvelle tâche"
        />
      </li>
    </ul>
  </div>
  <ConfirmDialog
    :message="`Supprimer définitivement le projet '${title}' ?`"
    :visible="showConfirm"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />
</template>

<style scoped>
.project-container {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.project {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.project .title {
  flex: 1;
  font-size: 1.2rem;
  font-weight: bold;
}
.project-content {
  margin-top: 10px;
}
.step {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}
.step input {
  flex: 1;
  padding: 5px;
}
.step.done input {
  text-decoration: line-through;
  opacity: 0.6;
}
</style>
