<script setup>
import { ref, computed } from 'vue'
import { useProjects } from '@/assets/JS/useProjects.js'
import ProjectForm from '@/components/ProjectForm.vue'
import ProjectContainer from '@/components/ProjectContainer.vue'

// === MODALE FORMULAIRE ===
import { useModal } from '@/assets/JS/useModal.js'
const projectModal = useModal()

// === CATEGORIE ACTUELLE ===
const currentCategory = ref('all')

// === LOGIQUE DE PROJETS ===
const { projects, addProject, updateProject, deleteProject } = useProjects()

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
      <!-- === HEADER === -->
      <div class="page-title">
        <button class="open-form-btn" @click="projectModal.open">
          <font-awesome-icon icon="square-plus" />
        </button>
        <h1>FLOBOARD</h1>
      </div>

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
          :class="{ active: currentCategory === 'projects' }"
          @click="currentCategory = 'projects'"
        >
          PROJECTS
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
          :class="{ active: currentCategory === 'sci' }"
          @click="currentCategory = 'sci'"
        >
          SCI
        </button>
        <button
          class="cat-btn"
          :class="{ active: currentCategory === 'perso' }"
          @click="currentCategory = 'perso'"
        >
          PERSO
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
    </div>
  </main>
</template>

<style scoped>
.no-project {
  margin-top: 30px;
  text-align: center;
  color: #888;
  font-style: italic;
}
</style>
