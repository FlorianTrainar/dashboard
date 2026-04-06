<script setup>
import { ref, watch, computed } from 'vue'
import SelectDialog from './SelectDialog.vue'
import { capitalize } from 'vue'

const props = defineProps({
  id: String,
  title: String,
  category: String,
  categories: {
    type: Array,
    default: () => [],
  },
  openId: String,
})

const emit = defineEmits(['open', 'delete', 'update:title', 'update:category', 'toggle-menu'])

// STATE
const isEditing = ref(false)
const localTitle = ref(props.title || '')
const showCategoryModal = ref(false)
const selectedCategory = ref(props.category)

const isMenuOpen = computed(() => props.openId === props.id)

// sync props
watch(
  () => props.title,
  (val) => (localTitle.value = val || ''),
)
watch(
  () => props.category,
  (val) => (selectedCategory.value = val),
)

watch(selectedCategory, (val) => {
  if (val !== props.category) {
    emit('update:category', val)
  }
})

const saveTitle = () => {
  isEditing.value = false
  emit('update:title', localTitle.value)
}

const toggleMenu = () => {
  emit('toggle-menu', isMenuOpen.value ? null : props.id)
}
</script>

<template>
  <div class="flex item-center w-full my-1 mx-2">
    <!-- MENU BUTTON -->
    <button
      @click.stop="toggleMenu"
      class="flex flex-col items-center"
      :class="isMenuOpen ? 'text-blue-400' : 'text-slate-400'"
    >
      <i-heroicons-cog class="text-2xl md:text-3xl mr-1 mt-1" />
      <i-heroicons-arrow-turn-down-right v-if="isMenuOpen" class="w-4 h-4 ml-2" />
    </button>
    <!-- CONTAINER -->
    <div
      class="w-full rounded-lg transition duration-500"
      :class="isMenuOpen ? ' bg-sky-600/40 border border-slate-300/50' : ''"
    >
      <!-- TITLE -->

      <div
        class="flex items-center gap-1 flex-1 cursor-pointer text-xl md:text-2xl py-1.5 px-2"
        @click="$emit('open', id)"
      >
        <i-heroicons-folder-open-solid class="text-blue-300" />
        <!-- INPUT SI MENU OUVERT -->
        <input
          v-if="isMenuOpen"
          v-model="localTitle"
          @blur="saveTitle"
          @keyup.enter="saveTitle"
          @keyup.esc="localTitle = title"
          @click.stop
          :placeholder="'Dossier'"
          class="bg-slate-100 w-full text-slate-950 outline-none border border-slate-300/40 rounded-lg p-1"
        />

        <!-- TEXTE NORMAL -->
        <span v-else class="" :class="title ? 'text-slate-50' : 'text-slate-400'">
          {{ title || 'Dossier' }}
        </span>
      </div>

      <!-- ACTION MENU -->
      <div v-if="isMenuOpen" class="mt-1 pl-6 pr-3 pb-2 flex gap-2">
        <button
          v-if="categories.length"
          @click="showCategoryModal = true"
          class="flex gap-1 text-left text-sm text-amber-400"
        >
          <i-heroicons-tag-solid class="w-5 h-5" />

          {{ capitalize(category) || 'aucune' }}
        </button>

        <button
          @click="$emit('delete', id)"
          class="flex gap-1 text-left text-sm text-red-400 hover:text-red-300 ml-auto"
        >
          Supprimer
          <i-heroicons-trash-solid class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>

  <!-- CATEGORY MODAL -->
  <SelectDialog
    v-model="selectedCategory"
    :visible="showCategoryModal"
    :options="categories"
    title="Changer de catégorie"
    @close="showCategoryModal = false"
  />
</template>
