<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: Object,
})

const emit = defineEmits(['update', 'cancel', 'delete'])

const localData = computed({
  get: () => props.modelValue,
  set: (val) => emit('update', val),
})

function submit() {
  // On crée une copie pour ne pas muter directement localData
  const updated = { ...localData.value }

  // On force la catégorie en majuscule si elle existe
  updated.category = (updated.category || 'AUTRE').toUpperCase()

  emit('update', updated)
}
</script>

<template>
  <form @submit.prevent="submit" class="snippet-form">
    <input v-model="localData.title" placeholder="Titre" required />
    <input v-model="localData.description" placeholder="Description" />
    <textarea v-model="localData.content" placeholder="Contenu" required></textarea>
    <input v-model="localData.category" placeholder="Catégorie" required />
    <input v-model="localData.tags" placeholder="Tags (séparés par des virgules)" />

    <div class="btn-zone">
      <button type="submit" class="save-btn">
        <font-awesome-icon icon="floppy-disk" />
      </button>

      <!-- 🔥 Bouton supprimer -->
      <button type="button" @click="$emit('delete')" class="delete-btn">
        <font-awesome-icon icon="trash" />
      </button>
    </div>
  </form>
</template>
<style scoped>
form {
  position: relative;
}
</style>
