import { ref, watch } from 'vue'
import { db } from '@/firebase'
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import { useAuth } from './useAuth.js'

// 🔥 store par collection
const stores = {}

export function useFirebaseFolders(collectionName = 'taskFolders') {
  const { user } = useAuth()

  // 🔥 créer store si pas existant
  if (!stores[collectionName]) {
    const folders = ref([])
    let unsubscribe = null

    watch(
      user,
      (newUser) => {
        if (unsubscribe) {
          unsubscribe()
          unsubscribe = null
        }

        if (newUser) {
          const q = query(collection(db, collectionName))

          unsubscribe = onSnapshot(q, (snapshot) => {
            folders.value = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          })
        } else {
          folders.value = []
        }
      },
      { immediate: true },
    )

    stores[collectionName] = {
      folders,
    }
  }

  const { folders } = stores[collectionName]

  // ================= CRUD =================

  const addFolder = async (category, type) => {
    await addDoc(collection(db, collectionName), {
      title: '',
      type,
      category,
      projects: [],
    })
  }

  const updateFolder = async (folderId, updatedData) => {
    const current = folders.value.find((f) => f.id === folderId)
    if (!current) return

    const hasChanged = JSON.stringify(current) !== JSON.stringify(updatedData)
    if (!hasChanged) return

    await updateDoc(doc(db, collectionName, folderId), updatedData)
  }

  const deleteFolder = async (folderId) => {
    await deleteDoc(doc(db, collectionName, folderId))
  }

  return {
    folders,
    addFolder,
    updateFolder,
    deleteFolder,
  }
}
