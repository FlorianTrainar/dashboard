<script setup>
import { useAuth } from '@/assets/JS/useAuth.js'

const { user, login, logout, isLoading } = useAuth()

// Pour récupérer email + password du formulaire
const email = ref('')
const password = ref('')

const error = ref(null)

async function handleLogin() {
  error.value = null
  try {
    await login(email.value, password.value)
  } catch (e) {
    error.value = e.message || 'Erreur lors de la connexion'
  }
}

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
      <div v-if="!user && !isLoading">
        <h2>Connexion</h2>
        <form @submit.prevent="handleLogin">
          <div>
            <label for="email">Email</label>
            <input id="email" v-model="email" type="email" required autocomplete="email" />
          </div>
          <div>
            <label for="password">Mot de passe</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              autocomplete="current-password"
            />
          </div>
          <button type="submit">Se connecter</button>
        </form>
        <p v-if="error" style="color: red">{{ error }}</p>
      </div>

      <div v-else-if="user">
        <!-- === HEADER === -->
        <div class="page-title">
          <button class="open-form-btn" @click="projectModal.open">
            <font-awesome-icon icon="square-plus" />
          </button>
          <h1>FLOBOARD ({{ user.email }})</h1>
          <!-- 👇 BOUTON DECONNEXION -->
          <button class="logout-btn" @click="logout">Se déconnecter</button>
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
