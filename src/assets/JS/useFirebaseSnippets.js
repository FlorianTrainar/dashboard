// src/composables/useFirebaseSnippets.js

import { ref, onMounted } from 'vue'
import { db } from '@/firebase'
import {
  collection,
  doc,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'

export function useFirebaseSnippets(tech) {
  const snippets = ref([])

  const snippetsCollection = collection(db, 'snippets', tech, 'items')

  // Sync en temps réel depuis Firestore
  onMounted(() => {
    const q = query(snippetsCollection)
    onSnapshot(q, (snapshot) => {
      snippets.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        show: doc.data().show ?? false, // valeur par défaut
      }))
    })
  })

  // Ajouter un nouveau snippet
  async function addSnippet(snippet) {
    await addDoc(snippetsCollection, {
      ...snippet,
      show: snippet.show ?? false,
    })
  }

  // Supprimer un snippet
  async function deleteSnippet(snippetId) {
    await deleteDoc(doc(snippetsCollection, snippetId))
  }

  // Basculer l'affichage du contenu (show)
  async function toggleContent(snippetId, currentShow) {
    await updateDoc(doc(snippetsCollection, snippetId), {
      show: !currentShow,
    })
  }

  // Éditer un snippet
  async function editSnippet(snippetId, updatedData) {
    await updateDoc(doc(snippetsCollection, snippetId), updatedData)
  }

  return {
    snippets,
    addSnippet,
    deleteSnippet,
    toggleContent,
    editSnippet,
  }
}
