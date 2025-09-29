<script setup>
import { ref, computed } from 'vue'
import { useFirebaseProjects } from '@/assets/JS/useFirebaseProjects'
import ProjectContainer from '@/components/ProjectContainer.vue'
import AnimatedTabSelector from '@/components/AnimatedTabSelector.vue'

// === CATEGORIE ACTUELLE ===
const currentCategory = ref('codes')

const categoriesList = [
  { key: 'codes', label: 'Codes', icon: 'computer' },
  { key: 'admin', label: 'Admin', icon: 'folder-open' },
  { key: 'projets', label: 'Projects', icon: 'bars-progress' },
  { key: 'all', label: 'All', icon: 'infinity' },
  { key: 'archives', label: 'Archives', icon: 'box-archive' },
]

// Fonction pour créer un nouveau projet
function createNewProject() {
  addProject({
    title: '',
    category: currentCategory.value,
    tasks: [],
    active: true,
  })
}

// === LOGIQUE DE PROJETS ===
const { projects, addProject, updateProject, deleteProject } = useFirebaseProjects()

// === FILTRAGE DES PROJETS SELON LA CATÉGORIE ===
const filteredProjects = computed(() => {
  if (currentCategory.value === 'all') {
    return projects.value.filter((p) => p.category !== 'archives')
  }
  return projects.value.filter((p) => p.category === currentCategory.value)
})

// === TRI DES PROJETS ===
const sortedProjects = computed(() => {
  const sortByTitle = (a, b) => a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' })

  const activeProjects = filteredProjects.value.filter((p) => p.active).sort(sortByTitle)

  const inactiveProjects = filteredProjects.value.filter((p) => !p.active).sort(sortByTitle)

  return [...activeProjects, ...inactiveProjects]
})
</script>

<template>
  <main>
    <div class="wrapper">
      <div class="page-title">
        <h1>Floboard</h1>
        <button
          v-if="currentCategory !== 'all' && currentCategory !== 'archives'"
          class="open-form-btn"
          @click="createNewProject"
        >
          <font-awesome-icon icon="plus" />
          <p>New</p>
        </button>
      </div>

      <!-- === SELECTEUR DE CATÉGORIES === -->
      <AnimatedTabSelector v-model="currentCategory" :categories="categoriesList" />

      <!-- === LISTE DES PROJETS === -->
      <div v-if="sortedProjects.length > 0">
        <ProjectContainer
          v-for="project in sortedProjects"
          :key="project.id"
          :project="project"
          :onUpdate="updateProject"
          :onDelete="deleteProject"
        />
      </div>
      <div v-else class="no-project">
        <p>Aucun projet dans cette catégorie.</p>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
