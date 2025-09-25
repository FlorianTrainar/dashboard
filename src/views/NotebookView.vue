<script setup>
import { watch, onMounted, nextTick } from 'vue'
import { useAuth } from '@/assets/JS/useAuth.js'
import { useFirebaseSnippets } from '@/assets/JS/useFirebaseSnippets'
import { useDelete } from '@/assets/JS/useDelete'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { useTextareaAutoResize } from '@/assets/JS/useTextareaAutoResize.js'

const tech = 'Notebook'
const {
  snippets, // Tous les snippets bruts
  addSnippet,
  deleteSnippet,
  editSnippet,
  toggleContent,
} = useFirebaseSnippets(tech)

function emitUpdate(snippet) {
  if (!snippet.id) return
  editSnippet(snippet.id, {
    title: snippet.title,
    content: snippet.content,
  })
}

const { resize } = useTextareaAutoResize('.snippet-description, .snippet')

const { showConfirm, confirmMessage, askConfirmation, handleConfirm, handleCancel } = useDelete()

const { user, isLoading } = useAuth()

async function addEmptySnippet() {
  await addSnippet({
    title: '',
    description: '',
    content: '',
    show: false,
  })
}

async function onToggleContent(index) {
  const snippet = snippets.value[index]
  if (snippet) {
    await toggleContent(snippet.id, snippet.show)
    await nextTick()
    const textareas = document.querySelectorAll('.snippet')
    textareas.forEach((el) => resize(el))
  }
}
function resizeVisibleTextareas() {
  nextTick(() => {
    const textareas = document.querySelectorAll('.snippet')
    textareas.forEach((el) => resize(el))
  })
}
watch(
  snippets,
  () => {
    if (snippets.value.some((s) => s.show)) {
      resizeVisibleTextareas()
    }
  },
  { deep: true },
)

function askDeleteSnippet(snippet) {
  askConfirmation(`Supprimer la note "${snippet.title || 'sans titre'}" ?`, async () => {
    await deleteSnippet(snippet.id)
  })
}

onMounted(async () => {
  resizeVisibleTextareas()
})
</script>

<template>
  <main>
    <div class="wrapper" v-if="!isLoading && user">
      <div class="page-title">
        <h1>Notebook</h1>
        <button class="open-form-btn" @click="addEmptySnippet">
          <font-awesome-icon icon="plus" />
          <p>Ajouter</p>
        </button>
      </div>

      <!-- Notes -->
      <div class="item-container" v-for="(snippet, index) in snippets" :key="snippet.id">
        <div class="item-main" :class="{ active: snippet.show }">
          <button
            class="pause-btn"
            :class="{ active: snippet.show }"
            @click="onToggleContent(index)"
          >
            <font-awesome-icon :icon="snippet.show ? 'play' : 'pause'" />
          </button>

          <input
            v-model="snippet.title"
            @input="() => emitUpdate(snippet)"
            placeholder="Titre"
            class="title"
          />

          <button @click="askDeleteSnippet(snippet)" class="delete-btn">
            <font-awesome-icon icon="trash" />
          </button>
        </div>

        <div class="item-content" v-if="snippet.show">
          <textarea
            v-model="snippet.content"
            class="snippet"
            placeholder="Note"
            rows="1"
            @input="
              (e) => {
                resize(e.target)
                emitUpdate(snippet)
              }
            "
          ></textarea>
        </div>
      </div>
    </div>

    <p v-else-if="isLoading">Chargement de la session...</p>
    <p v-else>Vous devez être connecté pour accéder à cette page.</p>
  </main>
  <ConfirmDialog
    :visible="showConfirm"
    :message="confirmMessage"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>

<style scoped>
textarea::placeholder {
  color: var(--back-color3-);
}

.info {
  display: flex;
  justify-content: space-between;
  gap: 6px;
}
.info > textarea,
.info > select {
  font-size: 1.1rem;
  color: var(--font-color4-);
}
.info > select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: none;
  border: none;
  padding-right: 1rem;
  color: var(--selected-color-);
  font-size: 1.1rem;
  text-align: center;
  align-self: flex-start;
  margin-top: 4px;
}
.info > select:hover {
  cursor: pointer;
}

.snippet {
  flex: 1;
  padding: 5px;
  background-color: var(--back-color4-);

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
.snippet {
  margin: 10px 0;
  width: 100%;
}
.snippet:focus {
  background-color: var(--back-color5-);
}

.delete-btn {
  font-size: 1.4rem;
  display: flex;
}
</style>
