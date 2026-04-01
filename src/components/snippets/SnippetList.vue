<script setup>
import { ref, watch, onMounted } from 'vue'
import { useSnippets } from '@/assets/JS/useSnippets'
import { useTextareaAutoResize } from '@/assets/JS/useTextareaAutoResize.js'

import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

const { resizeAll, resize } = useTextareaAutoResize('.snippet-textarea')

const props = defineProps({
  snippets: Array,
  onUpdate: Function,
})

const { createSnippet, deleteSnippet: removeSnippet } = useSnippets()

const localSnippets = ref([])

watch(
  () => props.snippets,
  (val) => {
    localSnippets.value = (val || []).map((s) => ({ ...s }))
  },
  { immediate: true },
)

const emitUpdate = () => {
  props.onUpdate(localSnippets.value)
}

const addSnippet = () => {
  const newSnippet = createSnippet()
  localSnippets.value.push(newSnippet)
  emitUpdate()
}

const copiedId = ref(null)

const copySnippet = async (snippet) => {
  await navigator.clipboard.writeText(snippet.content)
  copiedId.value = snippet.id

  setTimeout(() => {
    copiedId.value = null
  }, 1500)
}
// Delete
const showConfirm = ref(false)
const snippetToDelete = ref(null)

const askDelete = (index) => {
  snippetToDelete.value = index
  showConfirm.value = true
}

const confirmDelete = () => {
  if (snippetToDelete.value !== null) {
    removeSnippet(localSnippets.value, snippetToDelete.value)
    emitUpdate()
  }

  showConfirm.value = false
  snippetToDelete.value = null
}

const cancelDelete = () => {
  showConfirm.value = false
  snippetToDelete.value = null
}

onMounted(resizeAll)

defineExpose({
  addSnippet,
})
</script>

<template>
  <ul class="p-1 space-y-2">
    <li
      v-for="(snippet, index) in localSnippets"
      :key="snippet.id"
      class="rounded-lg border border-slate-400/50 overflow-hidden"
    >
      <!-- HEADER -->
      <div class="flex justify-between gap-2 items-start px-2 py-1 bg-slate-700">
        <button @click="copySnippet(snippet)" class="ml-2">
          <i-heroicons-clipboard-solid
            v-if="copiedId !== snippet.id"
            class="w-6 h-6 text-green-400"
          />
          <i-heroicons-check v-else class="w-5 h-5 text-lime-400" />
        </button>
        <textarea
          v-model="snippet.title"
          @input="resize($event.target)"
          @blur="emitUpdate"
          rows="1"
          placeholder="Titre du snippet"
          class="snippet-textarea w-full bg-slate-600 text-white resize-none outline-none p-1"
        />
        <button @click="askDelete(index)" class="text-red-400 ml-2">
          <i-heroicons-x-circle class="w-6 h-6" />
        </button>
      </div>

      <!-- CONTENT -->
      <div class="bg-slate-800">
        <textarea
          v-model="snippet.content"
          @input="resize($event.target)"
          @blur="emitUpdate"
          rows="3"
          placeholder="Code ou contenu..."
          class="snippet-textarea w-full px-2 py-2 bg-slate-800 text-green-300 font-mono resize-none outline-none"
        />
      </div>
    </li>
  </ul>
  <ConfirmDialog
    :message="'Supprimer ce snippet ?'"
    :visible="showConfirm"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />
</template>
