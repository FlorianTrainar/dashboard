<script setup>
import { useModal } from '@/assets/JS/useModal'
import DraggableModal from '@/components/DraggableModal.vue'

import { useSnippets } from '@/assets/JS/useSnippets'
import SnippetForm from '@/components/SnippetForm.vue'

import { useEdit } from '@/assets/JS/useEdit'
import EditForm from '@/components/EditForm.vue'

import { useDelete } from '@/assets/JS/useDelete'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

import { copyToClipboard } from '@/utils/clipboard.js'

// === MODALES ===
const snippetModal = useModal()
const editModal = useModal()

// === SNIPPETS ===
const tech = 'Js'
const {
  currentCategory,
  snippetsByCategory,
  filteredSnippets,
  addSnippet,
  deleteSnippet,
  toggleContent,
  deleteCategory,
  editSnippet,
} = useSnippets(tech)

// === EDIT ===
const { editIndex, editData, startEdit } = useEdit()
function handleEdit(snippet, index) {
  startEdit(snippet, index)
  editModal.open()
}

// === DELETE ===
const { showConfirm, confirmMessage, askConfirmation, handleConfirm, handleCancel } = useDelete()
</script>

<template>
  <main>
    <div class="wrapper">
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
          <SnippetForm :currentTech="tech" @add-snippet="addSnippet" />
        </DraggableModal>

        <!-- === MODALE ÉDITION === -->
        <DraggableModal
          :visible="editModal.isVisible.value"
          title="Modifier le snippet"
          @close="editModal.close"
        >
          <EditForm
            v-model="editData"
            @update="
              () => {
                editSnippet(editIndex, editData)
                editModal.close()
              }
            "
            @cancel="editModal.close"
            @delete="
              askConfirmation(`Supprimer le snippet '${editData.title}' ?`, () => {
                deleteSnippet(editIndex)
                editModal.close()
              })
            "
          />
        </DraggableModal>

        <h1>JavaScript</h1>
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

      <!-- /// -->

      <div class="snippet-container" v-for="(snippet, index) in filteredSnippets" :key="index">
        <div class="snippet" @click="toggleContent(index)">
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

        <!-- <button @click="toggleContent(index)">
          <font-awesome-icon :icon="snippet.show ? 'eye-slash' : 'eye'" />
        </button> -->

        <!-- <button
              @click="
                askConfirmation(`Supprimer le snippet '${snippet.title}' ?`, () =>
                  deleteSnippet(index),
                )
              "
            >
              <font-awesome-icon icon="trash" />
            </button> -->

        <p v-if="snippet.show" class="snippet-content">{{ snippet.content }}</p>
      </div>

      <!-- Delete Cat -->

      <button
        class="delete-cat"
        @click="
          askConfirmation(`Supprimer la catégorie '${currentCategory}' ?`, () =>
            deleteCategory(currentCategory),
          )
        "
      >
        <font-awesome-icon icon="trash" />
        <p>Supprimer la catégorie : {{ currentCategory }}</p>
      </button>
    </div>
  </main>
  <ConfirmDialog
    :visible="showConfirm"
    :message="confirmMessage"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>
<style scoped></style>
