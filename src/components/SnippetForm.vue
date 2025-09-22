<script setup>
import { ref } from 'vue'

const props = defineProps({
  currentTech: String, // exemple : 'Vue' ou 'CSS'
})

const emit = defineEmits(['add-snippet'])

const title = ref('')
const description = ref('')
const content = ref('')
const category = ref('')
const tags = ref('') // chaîne séparée par des virgules

function handleSubmit() {
  if (!title.value || !content.value) return

  emit('add-snippet', {
    title: title.value,
    description: description.value,
    content: content.value,
    category: category.value.toUpperCase() || 'AUTRE',
    tags: tags.value
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
  })

  // Réinitialiser le formulaire
  title.value = ''
  description.value = ''
  content.value = ''
  category.value = ''
  tags.value = ''
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="snippet-form">
    <input v-model="title" placeholder="Titre" required />
    <input v-model="description" placeholder="Description" />

    <textarea v-model="content" placeholder="Contenu" required></textarea>
    <input v-model="category" placeholder="Catégorie" />
    <input v-model="tags" placeholder="Tags (séparés par des virgules)" />

    <div class="btn-zone">
      <button class="save-btn" type="submit">
        <font-awesome-icon icon="floppy-disk" />
      </button>
    </div>
  </form>
</template>

<style scoped></style>
