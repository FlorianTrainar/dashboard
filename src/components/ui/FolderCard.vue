<script setup>
import { ref, watch } from 'vue'
import SelectDialog from './SelectDialog.vue'

const props = defineProps({
  id: String,
  title: String,
  category: String,
  categories: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['open', 'delete', 'update:title', 'update:category'])

// STATE
const isEditing = ref(false)
const localTitle = ref(props.title || '')
const showCategoryModal = ref(false)
const selectedCategory = ref(props.category)

// sync si props change
watch(
  () => props.title,
  (val) => {
    localTitle.value = val || ''
  },
)
watch(
  () => props.category,
  (val) => {
    selectedCategory.value = val
  },
)
watch(selectedCategory, (val) => {
  if (val !== props.category) {
    emit('update:category', val)
  }
})

// EDIT
const startEdit = () => {
  isEditing.value = true
}

const saveTitle = () => {
  isEditing.value = false
  emit('update:title', localTitle.value)
}
</script>

<template>
  <div
    class="flex items-center justify-between p-3 md:px-4 mx-1 bg-slate-800 rounded-xl border border-slate-400/50"
  >
    <!-- LEFT -->
    <div class="flex items-center gap-3 flex-1">
      <button @click="$emit('open', id)" class="text-blue-400 hover:text-blue-300 transition">
        <i-heroicons-folder-solid class="w-6 h-6" />
      </button>

      <!-- TITLE -->
      <input
        v-model="localTitle"
        placeholder="Nouveau Dossier"
        @blur="saveTitle"
        @keyup.enter="saveTitle"
        class="bg-transparent text-white text-base font-medium outline-none w-full"
      />
    </div>

    <!-- RIGHT -->
    <div class="flex items-center gap-2">
      <!-- CATEGORY -->
      <button
        v-if="categories.length"
        @click="showCategoryModal = true"
        class="text-xs px-2 py-1 rounded bg-slate-700 text-gray-300 hover:bg-slate-600"
      >
        {{ category }}
      </button>

      <!-- DELETE -->
      <button @click="$emit('delete', id)" class="text-red-500 hover:text-red-400">
        <i-heroicons-trash class="w-5 h-5" />
      </button>
    </div>
  </div>
  <SelectDialog
    v-model="selectedCategory"
    :visible="showCategoryModal"
    :options="categories"
    title="Changer de catégorie"
    @close="showCategoryModal = false"
  />
</template>
