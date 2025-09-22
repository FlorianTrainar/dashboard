// useFirebaseProjects.js
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

export function useFirebaseProjects() {
  const projects = ref([])
  const { user } = useAuth()

  let unsubscribe = null

  watch(
    user,
    (newUser) => {
      // 🔁 Nettoyage de l'ancien listener si existant
      if (unsubscribe) {
        unsubscribe()
        unsubscribe = null
      }

      if (newUser) {
        const projectsCollection = collection(db, 'projects')
        const q = query(projectsCollection)

        // 🔄 Lancer l'écoute Firestore
        unsubscribe = onSnapshot(q, (snapshot) => {
          projects.value = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        })
      } else {
        // ❌ Déconnecté → vider la liste
        projects.value = []
      }
    },
    { immediate: true },
  )

  // ✅ Ajout d'un projet
  async function addProject(project) {
    const projectsCollection = collection(db, 'projects')

    const newProject = {
      ...project,
      tasks: [{ text: '', done: false }], // 👈 une tâche vide par défaut
    }

    await addDoc(projectsCollection, newProject)
  }

  // ✅ Mise à jour
  async function updateProject(projectId, updatedData) {
    const projectRef = doc(db, 'projects', projectId)
    await updateDoc(projectRef, updatedData)
  }

  // ✅ Suppression
  async function deleteProject(projectId) {
    const projectRef = doc(db, 'projects', projectId)
    await deleteDoc(projectRef)
  }

  return {
    projects,
    addProject,
    updateProject,
    deleteProject,
  }
}
