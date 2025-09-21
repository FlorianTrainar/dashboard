// src/composables/useFirebaseSnippets.js
import { ref, computed, onMounted, watch } from 'vue'
import { db } from '@/firebase'
import {
  collection,
  doc,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'

export function useFirebaseSnippets(tech) {
  const snippets = ref([]) // liste brute de tous les snippets pour cette tech
  const currentCategory = ref('')

  const snippetsCollection = collection(db, 'snippets', tech, 'items')

  // Sync en temps réel Firestore
  onMounted(() => {
    const q = query(snippetsCollection)
    onSnapshot(q, (snapshot) => {
      snippets.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      // Si currentCategory vide, on la set à la 1ère catégorie trouvée
      if (!currentCategory.value) {
        const cats = [...new Set(snippets.value.map((s) => s.category))]
        currentCategory.value = cats[0] || ''
      }
    })
  })

  // Snippets filtrés par catégorie, triés par titre
  const snippetsByCategory = computed(() => {
    const byCat = {}
    snippets.value.forEach((s) => {
      if (!byCat[s.category]) byCat[s.category] = []
      byCat[s.category].push({ ...s, show: s.show || false })
    })
    // Tri alphabétique
    Object.keys(byCat).forEach((cat) => {
      byCat[cat].sort((a, b) => a.title.localeCompare(b.title))
    })
    return byCat
  })

  const filteredSnippets = computed(() => {
    return snippetsByCategory.value[currentCategory.value] || []
  })

  async function addSnippet(snippet) {
    await addDoc(snippetsCollection, {
      ...snippet,
      show: false,
    })
  }

  async function deleteSnippet(snippetId) {
    await deleteDoc(doc(snippetsCollection, snippetId))
  }

  async function toggleContent(snippetId, currentShow) {
    await updateDoc(doc(snippetsCollection, snippetId), {
      show: !currentShow,
    })
  }

  async function editSnippet(snippetId, updatedData) {
    await updateDoc(doc(snippetsCollection, snippetId), updatedData)
  }

  async function deleteCategory(categoryName) {
    // Supprime tous les snippets de la catégorie
    const snaps = snippets.value.filter((s) => s.category === categoryName)
    const batch = snaps.map((s) => deleteDoc(doc(snippetsCollection, s.id)))
    await Promise.all(batch)
    // Réinitialise currentCategory
    const remainingCats = [...new Set(snippets.value.map((s) => s.category))].filter(
      (cat) => cat !== categoryName,
    )
    currentCategory.value = remainingCats[0] || ''
  }

  return {
    currentCategory,
    snippetsByCategory,
    filteredSnippets,
    addSnippet,
    deleteSnippet,
    toggleContent,
    editSnippet,
    deleteCategory,
  }
}
