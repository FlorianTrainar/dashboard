<script setup>
import { ref } from 'vue'

const emit = defineEmits(['add'])

const title = ref('')
const category = ref('')

const categories = ['codes', 'admin', 'projets']

function submit() {
  if (!title.value.trim()) return

  emit('add', {
    title: title.value.trim(),
    category: category.value,
  })

  // Réinitialiser le formulaire
  title.value = ''
  category.value = 'projects'
}
</script>

<template>
  <div class="project-form">
    <form @submit.prevent="submit" class="project">
      <input v-model="title" type="text" placeholder="Nom du projet" required />

      <div>
        <select class="project-select" v-model="category" required>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat.toUpperCase() }}
          </option>
        </select>

        <button type="submit" class="create-btn">
          <font-awesome-icon icon="folder-plus" />
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
