<script setup>
import { useAuth } from '@/assets/JS/useAuth.js' // <-- import du composable auth

import { useModal } from '@/assets/JS/useModal'
import DraggableModal from '@/components/DraggableModal.vue'

import { useFirebaseSnippets } from '@/assets/JS/useFirebaseSnippets'
import SnippetForm from '@/components/SnippetForm.vue'

import { useEdit } from '@/assets/JS/useEdit'
import EditForm from '@/components/EditForm.vue'

import { useDelete } from '@/assets/JS/useDelete'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

import { copyToClipboard } from '@/utils/clipboard.js'

// === AUTH ===
const { user, isLoading } = useAuth()

// === MODALES ===
const snippetModal = useModal()
const editModal = useModal()

// === SNIPPETS ===
const tech = 'Dependencies'
const {
  currentCategory,
  snippetsByCategory,
  filteredSnippets,
  addSnippet,
  deleteSnippet,
  toggleContent,
  deleteCategory,
  editSnippet,
} = useFirebaseSnippets(tech)

// === EDIT ===
const { editIndex, editData, startEdit } = useEdit()

function handleEdit(snippet, index) {
  startEdit(snippet, index)
  editModal.open()
}

// === DELETE ===
const { showConfirm, confirmMessage, askConfirmation, handleConfirm, handleCancel } = useDelete()

// Méthodes wrapper async
async function onAddSnippet(snippet) {
  await addSnippet(snippet)
  snippetModal.close()
}

async function onDeleteSnippet(index) {
  const snippet = filteredSnippets.value[index]
  if (snippet) await deleteSnippet(snippet.id)
}

async function onToggleContent(index) {
  const snippet = filteredSnippets.value[index]
  if (snippet) await toggleContent(snippet.id, snippet.show)
}

async function onEditSnippet(index, updatedData) {
  const snippet = filteredSnippets.value[index]
  if (snippet) await editSnippet(snippet.id, updatedData)
}

async function onDeleteCategory(cat) {
  await deleteCategory(cat)
}
</script>

<template>
  <main>
    <div class="wrapper">
      <template v-if="isLoading">
        <p>Chargement de la session...</p>
      </template>

      <template v-else-if="!user">
        <p>Vous devez être connecté pour accéder à cette page.</p>
      </template>

      <template v-else>
        <div class="page-title">
          <button class="open-form-btn" @click="snippetModal.open">
            <font-awesome-icon icon="square-plus" />
          </button>

          <!-- MODALE CREATION -->
          <DraggableModal
            :visible="snippetModal.isVisible.value"
            title="Ajouter un snippet"
            @close="snippetModal.close"
          >
            <SnippetForm :currentTech="tech" @add-snippet="onAddSnippet" />
          </DraggableModal>

          <!-- MODALE EDITION -->
          <DraggableModal
            :visible="editModal.isVisible.value"
            title="Modifier le snippet"
            @close="editModal.close"
          >
            <EditForm
              v-model="editData"
              @update="
                () => {
                  onEditSnippet(editIndex, editData)
                  editModal.close()
                }
              "
              @cancel="editModal.close"
              @delete="
                askConfirmation(`Supprimer le snippet '${editData.title}' ?`, async () => {
                  await onDeleteSnippet(editIndex)
                  editModal.close()
                })
              "
            />
          </DraggableModal>

          <h1>Dependencies</h1>
        </div>

        <div class="cat-selector">
          <button
            v-for="cat in Object.keys(snippetsByCategory)"
            :key="cat"
            class="cat-btn"
            :class="{ active: cat === currentCategory }"
            @click="currentCategory = cat"
          >
            {{ cat }}
          </button>
        </div>

        <div
          class="snippet-container"
          v-for="(snippet, index) in filteredSnippets"
          :key="snippet.id"
        >
          <div class="snippet" @click="onToggleContent(index)">
            <div class="btn-block">
              <button @click.stop="copyToClipboard(snippet.content)">
                <font-awesome-icon icon="clipboard" />
              </button>
              <button @click.stop="handleEdit(snippet, index)">
                <font-awesome-icon icon="pencil" />
              </button>
            </div>
            <div class="info-block">
              <h2 class="title">{{ snippet.title }}</h2>
              <h3 class="description">{{ snippet.description }}</h3>
            </div>
          </div>

          <pre v-if="snippet.show" class="snippet-content">{{ snippet.content }}</pre>
        </div>

        <button
          v-if="currentCategory"
          class="delete-cat"
          @click="
            askConfirmation(`Supprimer la catégorie '${currentCategory}' ?`, async () => {
              await onDeleteCategory(currentCategory)
            })
          "
        >
          <font-awesome-icon icon="trash" />
          <p>Supprimer la catégorie : {{ currentCategory }}</p>
        </button>
      </template>
    </div>
  </main>

  <ConfirmDialog
    :visible="showConfirm"
    :message="confirmMessage"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>
