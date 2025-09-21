<script setup>
import { ref } from 'vue'

const emit = defineEmits(['add'])

const title = ref('')
const category = ref('projects')

const categories = ['projects', 'codes', 'sci', 'perso']

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
  <form @submit.prevent="submit" class="project-form">
    <input v-model="title" type="text" placeholder="Nom du projet" required />

    <select v-model="category">
      <option v-for="cat in categories" :key="cat" :value="cat">
        {{ cat.toUpperCase() }}
      </option>
    </select>

    <button type="submit">
      <font-awesome-icon icon="floppy-disk" />
    </button>
  </form>
</template>

<style scoped>
.project-form {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px;
}

input,
select {
  padding: 6px 12px;
  font-size: 16px;
  border: 1px solid var(--back-color4-, #ccc);
  border-radius: 4px;
  background-color: var(--back-color2-, #fff);
  color: var(--font-color2-, #333);
}

button {
  background-color: var(--accent-color-, #4caf50);
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
