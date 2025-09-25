<script setup>
import { ref, watch, computed, nextTick } from 'vue'
import { useAuth } from '@/assets/JS/useAuth.js'
import { useFirebaseSnippets } from '@/assets/JS/useFirebaseSnippets'
import { copyToClipboard } from '@/utils/clipboard.js'

import { useDelete } from '@/assets/JS/useDelete'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const { showConfirm, confirmMessage, askConfirmation, handleConfirm, handleCancel } = useDelete()

const { user, isLoading } = useAuth()

const tech = 'Vue'
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
    description: snippet.description,
    category: snippet.category,
    content: snippet.content,
  })
}

// === Catégories fixes
const categories = ['SETUP', 'SCRIPT', 'DIRECTIVES', 'AUTRE']
const knownCategories = computed(() => categories.filter((cat) => cat !== 'AUTRE'))

const currentCategory = ref(categories[0])

// === Filtrage par catégorie
const filteredSnippets = computed(() => {
  if (currentCategory.value === 'AUTRE') {
    return snippets.value.filter((s) => !knownCategories.value.includes(s.category))
  }
  return snippets.value.filter((s) => s.category === currentCategory.value)
})

// === Ajouter un snippet vide
async function addEmptySnippet() {
  await addSnippet({
    title: '',
    description: '',
    category: currentCategory.value,
    content: '',
    show: false,
  })
}

async function onToggleContent(index) {
  const snippet = filteredSnippets.value[index]
  if (snippet) await toggleContent(snippet.id, snippet.show)
}

function askDeleteSnippet(snippet) {
  askConfirmation(`Supprimer le snippet "${snippet.title || 'sans titre'}" ?`, async () => {
    await deleteSnippet(snippet.id)
  })
}

// === Auto-resize
function resizeTextarea(event) {
  const el = event.target
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}

// Resize automatique quand un snippet est affiché
watch(
  filteredSnippets,
  async (snippets) => {
    await nextTick()

    snippets.forEach((snippet, index) => {
      if (snippet.show) {
        // Trouver les éléments visibles dans le DOM
        const snippetEl = document.querySelectorAll('.item-container')[index]
        if (!snippetEl) return

        const desc = snippetEl.querySelector('.snippet-description')
        const content = snippetEl.querySelector('.snippet')

        if (desc) {
          desc.style.height = 'auto'
          desc.style.height = desc.scrollHeight + 'px'
        }
        if (content) {
          content.style.height = 'auto'
          content.style.height = content.scrollHeight + 'px'
        }
      }
    })
  },
  { deep: true },
)
</script>

<template>
  <main>
    <div class="wrapper" v-if="!isLoading && user">
      <div class="page-title">
        <h1>Vue.js</h1>
        <button class="open-form-btn" @click="addEmptySnippet">
          <font-awesome-icon icon="plus" />
          <p>Ajouter</p>
        </button>
      </div>

      <!-- === Catégories fixes === -->
      <div class="cat-selector">
        <button
          v-for="cat in categories"
          :key="cat"
          class="cat-btn"
          :class="{ active: cat === currentCategory }"
          @click="currentCategory = cat"
        >
          {{ cat }}
        </button>
      </div>

      <!-- === Snippets filtrés === -->
      <div class="item-container" v-for="(snippet, index) in filteredSnippets" :key="snippet.id">
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

          <button @click="copyToClipboard(snippet.content)" class="archive-btn">
            <font-awesome-icon icon="clipboard" />
          </button>
        </div>

        <div class="item-content" v-if="snippet.show">
          <div class="info">
            <textarea
              class="snippet-description"
              placeholder="Description"
              rows="1"
              v-model="snippet.description"
              @input="
                (e) => {
                  resizeTextarea(e)
                  emitUpdate(snippet)
                }
              "
            ></textarea>

            <select v-model="snippet.category">
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>

          <textarea
            v-model="snippet.content"
            class="snippet"
            placeholder="Snippet"
            rows="1"
            @input="resizeTextarea"
          ></textarea>
          <button @click="askDeleteSnippet(snippet)" class="delete-btn">
            <font-awesome-icon icon="trash" />
          </button>
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
.snippet-description,
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
.snippet-description:focus,
.snippet:focus {
  background-color: var(--back-color5-);
}

.delete-btn {
  font-size: 1.4rem;
  display: flex;
}
</style>
