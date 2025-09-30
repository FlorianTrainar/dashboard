<script setup>
import { ref, computed, watch } from 'vue'
import { useAuth } from '@/assets/JS/useAuth.js'
import { useFirebaseSnippets } from '@/assets/JS/useFirebaseSnippets'
import { useDelete } from '@/assets/JS/useDelete'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { useTextareaAutoResize } from '@/assets/JS/useTextareaAutoResize.js'
import { copyToClipboard } from '@/utils/clipboard.js'
import AnimatedTabSelector from '@/components/AnimatedTabSelector.vue'

const tech = 'React'
const { snippets, addSnippet, deleteSnippet, editSnippet, toggleContent } =
  useFirebaseSnippets(tech)

function emitUpdate(snippet) {
  if (!snippet.id) return
  editSnippet(snippet.id, {
    title: snippet.title,
    description: snippet.description,
    category: snippet.category,
    content: snippet.content,
  })
}

const { resizeAll, resize } = useTextareaAutoResize('.snippet-description, .snippet')

const { showConfirm, confirmMessage, askConfirmation, handleConfirm, handleCancel } = useDelete()

const { user, isLoading } = useAuth()

const categoriesList = [
  { key: 'SETUP', label: 'Setup', icon: 'gear' },
  { key: 'MODULES', label: 'Mods', icon: 'puzzle-piece' },
  { key: 'STYLE', label: 'Style', icon: 'palette' },
  { key: 'DEPENDENCIES', label: 'Deps', icon: 'boxes-stacked' },
  { key: 'AUTRE', label: 'Autre', icon: 'ellipsis' },
]

const categories = categoriesList.map((cat) => cat.key)
const knownCategories = computed(() => categories.filter((cat) => cat !== 'AUTRE'))
const currentCategory = ref('SETUP')

const isEditingTitle = ref(false)

const sortedSnippets = ref([])
function sortSnippets() {
  sortedSnippets.value = snippets.value
    .slice()
    .sort((a, b) => a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' }))
}

watch(
  [snippets, currentCategory],
  () => {
    if (!isEditingTitle.value) {
      sortSnippets()
    }
  },
  { deep: true, immediate: true },
)

const displayedSnippets = computed(() => {
  if (currentCategory.value === 'AUTRE') {
    return sortedSnippets.value.filter((s) => !knownCategories.value.includes(s.category))
  }
  return sortedSnippets.value.filter((s) => s.category === currentCategory.value)
})

async function onToggleContent(snippetId) {
  const snippet = snippets.value.find((s) => s.id === snippetId)
  if (snippet) await toggleContent(snippet.id, snippet.show)
}

const copiedSnippets = ref(new Set())
function handleCopy(snippet) {
  copyToClipboard(snippet.content)
    .then(() => {
      copiedSnippets.value.add(snippet.id)
      setTimeout(() => copiedSnippets.value.delete(snippet.id), 1000)
    })
    .catch(() => {
      console.error('Erreur lors de la copie')
    })
}

async function addEmptySnippet() {
  await addSnippet({
    title: '',
    description: '',
    category: currentCategory.value,
    content: '',
    show: false,
  })
}

function askDeleteSnippet(snippet) {
  askConfirmation(`Supprimer le snippet "${snippet.title || 'sans titre'}" ?`, async () => {
    await deleteSnippet(snippet.id)
  })
}

// Gérer redimensionnement quand displayedSnippets change
import { nextTick } from 'vue'
watch(
  displayedSnippets,
  async () => {
    await nextTick()
    resizeAll()
  },
  { deep: true },
)
</script>

<template>
  <main>
    <div class="wrapper" v-if="!isLoading && user">
      <div class="page-header">
        <div class="page-title">
          <h1>React</h1>
          <button class="open-form-btn" @click="addEmptySnippet">
            <font-awesome-icon icon="plus" />
            <p>Ajouter</p>
          </button>
        </div>

        <AnimatedTabSelector v-model="currentCategory" :categories="categoriesList" />
      </div>
      <div class="page-main">
        <div class="item-container" v-for="snippet in displayedSnippets" :key="snippet.id">
          <div class="item-main" :class="{ active: snippet.show }">
            <button
              class="pause-btn"
              :class="{ active: snippet.show }"
              @click="onToggleContent(snippet.id)"
            >
              <font-awesome-icon :icon="snippet.show ? 'play' : 'pause'" />
            </button>

            <input
              v-model="snippet.title"
              @focus="isEditingTitle = true"
              @blur="
                () => {
                  isEditingTitle = false
                  emitUpdate(snippet)
                  sortSnippets()
                }
              "
              @keydown.enter.prevent="
                (event) => {
                  isEditingTitle = false
                  emitUpdate(snippet)
                  sortSnippets()
                  // enlever le focus pour déclencher blur ensuite
                  event.target.blur()
                }
              "
              placeholder="Titre"
              class="title"
            />

            <button
              @click="handleCopy(snippet)"
              class="clipboard-btn"
              :class="{ copied: copiedSnippets.has(snippet.id) }"
            >
              <font-awesome-icon
                :icon="copiedSnippets.has(snippet.id) ? 'thumbs-up' : 'clipboard'"
              />
            </button>
          </div>

          <div class="item-content" v-if="snippet.show">
            <textarea
              class="snippet-description"
              placeholder="Description"
              rows="1"
              v-model="snippet.description"
              @input="
                (e) => {
                  resize(e.target)
                  emitUpdate(snippet)
                }
              "
            ></textarea>

            <textarea
              v-model="snippet.content"
              class="snippet"
              placeholder="Snippet"
              rows="1"
              @input="
                (e) => {
                  resize(e.target)
                  emitUpdate(snippet)
                }
              "
            ></textarea>

            <div class="snippet-footer">
              <select class="snippet-category" v-model="snippet.category">
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
              <button @click="askDeleteSnippet(snippet)" class="delete-btn">
                <font-awesome-icon icon="trash" />
              </button>
            </div>
          </div>
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

<style scoped></style>
