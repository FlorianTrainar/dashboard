<script setup>
import { ref, computed } from 'vue'
// import { useProjects } from '@/assets/JS/useProjects.js'
import { useFirebaseProjects } from '@/assets/JS/useFirebaseProjects'
import ProjectForm from '@/components/ProjectForm.vue'
import ProjectContainer from '@/components/ProjectContainer.vue'

// === MODALE FORMULAIRE ===
import { useModal } from '@/assets/JS/useModal.js'
const projectModal = useModal()

// === CATEGORIE ACTUELLE ===
const currentCategory = ref('all')

// === LOGIQUE DE PROJETS ===
const { projects, addProject, updateProject, deleteProject } = useFirebaseProjects()

// === PROJETS FILTRÉS SELON CATEGORIE ===
const filteredProjects = computed(() => {
  if (currentCategory.value === 'all') {
    return projects.value.filter((p) => p.category !== 'archives')
  }
  return projects.value.filter((p) => p.category === currentCategory.value)
})
</script>

<template>
  <main>
    <div class="wrapper">
      <!-- Afficher le formulaire si pas connecté -->

      <div class="page-title">
        <h1>Floboard</h1>
        <button class="open-form-btn" @click="projectModal.open">
          <font-awesome-icon icon="plus" />
          <p>New</p>
        </button>
      </div>

      <!-- === FORMULAIRE D’AJOUT DE PROJET === -->
      <ProjectForm
        v-if="projectModal.isVisible.value"
        @close="projectModal.close"
        @add="
          (p) => {
            addProject(p)
            projectModal.close()
          }
        "
      />

      <!-- === SELECTEUR DE CATÉGORIES === -->

      <div class="cat-selector">
        <button
          class="cat-btn"
          :class="{ active: currentCategory === 'all' }"
          @click="currentCategory = 'all'"
        >
          ALL
        </button>
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
          :class="{ active: currentCategory === 'archives' }"
          @click="currentCategory = 'archives'"
        >
          ARCHIVES
        </button>
      </div>

      <!-- === LISTE DES PROJETS === -->
      <div v-if="filteredProjects.length > 0">
        <ProjectContainer
          v-for="project in filteredProjects"
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

<style scoped>
/* .no-project {
  margin-top: 3000px;
  text-align: center;
  color: #888;
  font-style: italic;
} */
</style>
