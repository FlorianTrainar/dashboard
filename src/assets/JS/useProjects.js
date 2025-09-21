import { ref, computed, watch } from 'vue'

// --- LocalStorage ---
const STORAGE_KEY = 'floboard-projects'

function loadFromStorage() {
  const saved = localStorage.getItem(STORAGE_KEY)
  try {
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function saveToStorage(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
}

// --- Composable ---
export function useProjects() {
  const projects = ref(loadFromStorage())

  // Ajoute un nouveau projet
  function addProject({ title, category }) {
    const newProject = {
      id: Date.now(),
      title,
      category,
      tasks: [],
      archived: false,
    }
    projects.value.push(newProject)
  }

  function updateProject(updatedProject) {
    const index = projects.value.findIndex((p) => p.id === updatedProject.id)
    if (index !== -1) {
      projects.value[index] = updatedProject
    }
  }

  // Supprime un projet
  function deleteProject(projectId) {
    projects.value = projects.value.filter((p) => p.id !== projectId)
  }

  // Ajoute une tâche à un projet
  function addTask(projectId) {
    const project = projects.value.find((p) => p.id === projectId)
    if (project) {
      project.tasks.push({
        id: Date.now(),
        text: '',
        done: false,
      })
    }
  }

  // Met à jour le texte d'une tâche
  function updateTask(projectId, taskId, newText) {
    const project = projects.value.find((p) => p.id === projectId)
    const task = project?.tasks.find((t) => t.id === taskId)
    if (task) {
      task.text = newText
    }
  }

  // Bascule l'état done d'une tâche
  function toggleTaskDone(projectId, taskId) {
    const project = projects.value.find((p) => p.id === projectId)
    const task = project?.tasks.find((t) => t.id === taskId)
    if (task) {
      task.done = !task.done

      // Reorganiser les tâches : les non faites d'abord
      project.tasks.sort((a, b) => a.done - b.done)
    }
  }

  // Archive ou désarchive un projet
  function toggleArchive(projectId) {
    const project = projects.value.find((p) => p.id === projectId)
    if (project) {
      project.archived = !project.archived
    }
  }

  // Computed: projets visibles par catégorie
  function getProjectsByCategory(category) {
    return computed(() => {
      if (category === 'all') {
        return projects.value.filter((p) => !p.archived)
      } else if (category === 'archives') {
        return projects.value.filter((p) => p.archived)
      } else {
        return projects.value.filter((p) => p.category === category && !p.archived)
      }
    })
  }

  // Sauvegarde automatique
  watch(
    projects,
    () => {
      saveToStorage(projects.value)
    },
    { deep: true },
  )

  return {
    projects,
    addProject,
    deleteProject,
    addTask,
    updateTask,
    toggleTaskDone,
    toggleArchive,
    updateProject,
    getProjectsByCategory,
  }
}
