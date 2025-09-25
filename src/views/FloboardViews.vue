<script setup>
import { ref, computed } from 'vue'
import { useFirebaseProjects } from '@/assets/JS/useFirebaseProjects'
import ProjectContainer from '@/components/ProjectContainer.vue'

// === CATEGORIE ACTUELLE ===
const currentCategory = ref('codes')

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

// === PROJETS FILTRÉS SELON CATEGORIE ===
const filteredProjects = computed(() => {
  if (currentCategory.value === 'all') {
    return projects.value.filter((p) => p.category !== 'archives')
  }
  return projects.value.filter((p) => p.category === currentCategory.value)
})
const sortedProjects = computed(() => {
  const sortByTitle = (a, b) => {
    return a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' })
  }

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

      <div class="cat-selector">
        <button
          class="cat-btn"
          :class="{ active: currentCategory === 'codes' }"
          @click="currentCategory = 'codes'"
        >
          CODES
        </button>
        <button
          class="cat-btn"
          :class="{ active: currentCategory === 'admin' }"
          @click="currentCategory = 'admin'"
        >
          ADMIN
        </button>
        <button
          class="cat-btn"
          :class="{ active: currentCategory === 'projets' }"
          @click="currentCategory = 'projets'"
        >
          PROJETS
        </button>
        <button
          class="cat-btn"
          :class="{ active: currentCategory === 'all' }"
          @click="currentCategory = 'all'"
        >
          ALL
        </button>
        <button
          class="cat-btn"
          :class="{ active: currentCategory === 'archives' }"
          @click="currentCategory = 'archives'"
        >
          ARCHIVES
        </button>
      </div>

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
